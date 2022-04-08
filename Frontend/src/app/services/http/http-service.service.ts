import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  private url: string = environment.url;
  constructor(private http: HttpClient) { }

  getDetails(){
    return this.http.get(this.url+'/');
  }

  placeOrder(body:any){
    let obj = {
      'orderItems': body,
      'user': localStorage.getItem('email')
    };
    return this.http.post(this.url+'/placeOrder',obj);
  }

  uploadToS3(file: File[]){
    const formData: FormData = new FormData();
    file.forEach((file) => formData.append("picture", file, file.name));
    return this.http.post(
      this.url+  "/storeFile",
      formData
    );
  }
}
