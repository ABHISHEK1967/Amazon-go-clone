import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Quagga from "@ericblade/quagga2";
import { Article } from "../IArticle";
import { HttpServiceService } from "../services/http/http-service.service";
import { ShoppingCart } from "../ShoppingCart";

@Component({
  selector: "app-sales-order",
  templateUrl: "./sales-order.component.html",
  styleUrls: ["./sales-order.component.scss"],
})
export class SalesOrderComponent implements OnInit {
  title = "aka-group33";
  errorMessage?: string;
  started?: boolean;
  acceptAnyCode = false;
  items: [Article, number][] = [];
  totalPrice: number = 0;
  private catalogue: any[] = [];
  private shoppingCart: ShoppingCart;
  private lastScannedCode: string | undefined;
  private lastScannedCodeDate: number | undefined;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private httpService: HttpServiceService
  ) {
    this.shoppingCart = new ShoppingCart();
  }

  ngOnInit(): void {
    this.initializeScanner();
    this.httpService.getDetails().subscribe((res: any) => {
      let data = JSON.parse(res.data);
      this.catalogue = data["body"]["Items"];
      console.log(data["body"]["Items"]);
    });
  }
  private initializeScanner(): Promise<void> {
    if (
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia != "function"
    ) {
      this.errorMessage =
        "getUserMedia is not supported. Please use Chrome on Android or Safari on iOS";
      this.started = false;
      return Promise.reject(this.errorMessage);
    }

    // enumerate devices and do some heuristics to find a suitable first camera
    return Quagga.CameraAccess.enumerateVideoDevices()
      .then(() => {
        return this.initializeScannerWithDevice();
      })
      .catch((error: any) => {
        this.errorMessage = `Failed to enumerate devices: ${error}`;
        this.started = false;
      });
  }

  private initializeScannerWithDevice(): Promise<void> {
    console.log(`Initializing Quagga scanner...`);

    const constraints: MediaTrackConstraints = {};

    constraints.facingMode = "environment";

    return Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints,
          area: {
            // defines rectangle of the detection/localization area
            top: "25%", // top offset
            right: "10%", // right offset
            left: "10%", // left offset
            bottom: "25%", // bottom offset
          },
          target: document.querySelector("#scanner-container") ?? undefined,
        },
        decoder: {
          readers: ["ean_reader"],
          multiple: false,
        },
        // See: https://github.com/ericblade/quagga2/blob/master/README.md#locate
        locate: false,
      },
      (err: any) => {
        if (err) {
          console.error(`Quagga initialization failed: ${err}`);
          this.errorMessage = `Initialization error: ${err}`;
          this.started = false;
        } else {
          console.log(`Quagga initialization succeeded`);
          Quagga.start();
          this.started = true;
          this.changeDetectorRef.detectChanges();
          Quagga.onDetected((res: any): void => {
            if (res.codeResult.code) {
              this.onBarcodeScanned(res.codeResult.code);
            }
          });
        }
      }
    );
  }

  deleteItem(article: any) {
    this.shoppingCart.removeArticle(article);
    this.items = this.shoppingCart.contents;
    this.totalPrice = this.shoppingCart.totalPrice;
    this.changeDetectorRef.detectChanges();
  }

  countItem(event: any) {
    this.shoppingCart.updateArticle(event.article, event.count);
    this.items = this.shoppingCart.contents;
    this.totalPrice = this.shoppingCart.totalPrice;
    this.changeDetectorRef.detectChanges();
  }

  onBarcodeScanned(code: string) {
    const now = new Date().getTime();
    if (
      code === this.lastScannedCode &&
      this.lastScannedCodeDate !== undefined &&
      now < this.lastScannedCodeDate + 1500
    ) {
      return;
    }

    // only accept articles from catalogue
    let article = this.catalogue.find((a) => a.productId === code);
    if (!article) {
      return;
    }
    this.shoppingCart.addArticle(article);
    this.items = this.shoppingCart.contents;
    this.totalPrice = this.shoppingCart.totalPrice;

    this.lastScannedCode = code;
    this.lastScannedCodeDate = now;

    this.changeDetectorRef.detectChanges();
  }

  clearCart() {
    this.shoppingCart.clear();
    this.items = this.shoppingCart.contents;
  }

  signOut() {
    localStorage.removeItem("isEmployee");
    this.router.navigate(["/login"]);
  }

  checkout() {
    // console.log(this.shoppingCart.contents);
    // "orderItems": [{"product":"623d2c34a73b1b563b39306e","quantity":1},
    // {"product":"6241f83bc56b943b2b8782e0","quantity":1}],
    const orderItem: any = [];
    this.shoppingCart.contents.map((item) => {
      orderItem.push({ product: item[0].productId, quantity: item[1],id:item[0].id });
    });

    this.httpService.placeOrder(orderItem).subscribe((res: any) => {
      console.log(res);
    });
  }
}
