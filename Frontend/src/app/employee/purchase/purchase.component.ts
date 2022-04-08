import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpServiceService } from "src/app/services/http/http-service.service";

@Component({
  selector: "app-purchase",
  templateUrl: "./purchase.component.html",
  styleUrls: ["./purchase.component.scss"],
})
export class PurchaseComponent implements OnInit {
  uploadedFiles: any[] = [];
  constructor(private router: Router, private httpService : HttpServiceService) {}

  ngOnInit(): void {}

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.httpService.uploadToS3(this.uploadedFiles)
    .subscribe(()=>{
      console.log("Uploaded files")
    })
  }

  signOut() {
    localStorage.removeItem("isEmployee");
    this.router.navigate(["/employee/login"]);
  }

  clear(){
    this.uploadedFiles= [];
  }
}
