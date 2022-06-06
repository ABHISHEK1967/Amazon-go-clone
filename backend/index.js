const AWS = require("aws-sdk");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const options = {
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
  origin: "*",
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
const fileUpload = require("express-fileupload");
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use(cors(options));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

const lambda = new AWS.Lambda({
  accessKeyId: "<ACCESS_ID>",
  secretAccessKey: "<ACCESS_KEY>",
  sessionToken:
    "<SESSION_TOKEN>",
  region: "us-east-1",
});

const s3 = new AWS.S3({
  accessKeyId: "<ACCESS_ID>W",
  secretAccessKey: "<ACCESS_KEY>",
  sessionToken:
    "<SESSION_TOKEN>",
  region: "us-east-1",
});

async function getDetails() {
  return lambda
    .invoke({
      FunctionName: "cloud-project-get",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({}),
    })
    .promise();
}

async function updateStocks(obj) {
  return lambda
    .invoke({
      FunctionName: "cloud-project-upsert",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify({
        id: obj.id,
        quantity: obj.quantity,
      }),
    })
    .promise();
}

async function placeOrder(obj) {
  return lambda
    .invoke({
      FunctionName: "cloud-project-put",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(obj),
    })
    .promise();
}

async function sendEmail(obj) {
  return lambda
    .invoke({
      FunctionName: "sns-email-function",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(obj),
    })
    .promise();
}

app.get("/", async (req, res) => {
  try {
    let response = await getDetails();
    res.send({ data: response.Payload, success: true });
  } catch (err) {
    res.send({ error: err, success: false });
  }
});

app.post("/placeOrder", async (req, res) => {
  await placeOrder(req.body);
  let response;
  for (let i = 0; i < req.body.orderItems.length; i++) {
    response = await updateStocks(req.body.orderItems[i]);
  }

  await sendEmail({ message: "Order has been placed successfully" });
  res.send({ data: response.Payload, success: true });
});

/**
 * Description: storeData API for uploading file to AWS S3 Bucket
 * Method: POST
 */
app.post("/storeFile", async (req, res) => {
  console.log("/storeFile POST API CALLED");
  let file;
  let fileContent;
  if (req.files) {
    file = req.files.picture;
    // console.log(file);
    fileContent = await fs.readFileSync(file.tempFilePath);
  }
  if (file) {
    await uploadFile(file, fileContent);
  }

  res.send({ message: "file uploaded successfully" }).status(200);
});

/**
 * Description: Helper function to upload file to AWS S3 Bucket and retrieve the public URI
 * for location of the file in the bucket
 * @param {Parameter for provisioning file to upload} file
 */
const uploadFile = async (file, fileContent) => {
  const params = {
    Bucket: "image-data-store-g33-aws",
    Key: "image-input/" + file.name,
    Body: fileContent,
    ContentType: "application/pdf",
  };
  const stored = await s3.upload(params).promise();
  return stored.Location;
};

app.listen(process.env.PORT ||8080, () => {
  console.log("listening on port 8080");
});
