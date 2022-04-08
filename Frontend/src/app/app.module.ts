import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { LoginComponent } from "./login/login.component";
import { SalesOrderComponent } from "./sales-order/sales-order.component";
import { RegisterComponent } from "./register/register.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

import { HttpServiceService } from "./services/http/http-service.service";

import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { InputNumberModule } from "primeng/inputnumber";
import { HttpClientModule } from "@angular/common/http";
@NgModule({
  declarations: [
    AppComponent,
    ShoppingCartComponent,
    LoginComponent,
    SalesOrderComponent,
    RegisterComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    InputNumberModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [HttpServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}
