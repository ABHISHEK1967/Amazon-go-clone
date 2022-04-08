import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Article } from "../IArticle";

@Component({
  selector: "app-shopping-cart",
  templateUrl: "./shopping-cart.component.html",
  styleUrls: ["./shopping-cart.component.scss"],
})
export class ShoppingCartComponent implements OnInit {
  @Input()
  article: any | undefined;

  @Input()
  count: number | undefined;

  @Output() deleteItem: EventEmitter<any> = new EventEmitter();
  @Output() countItem: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  deleteObject() {
    this.deleteItem.emit(this.article);
  }

  countChanges() {
    this.countItem.emit({
      article: this.article,
      count: this.count
    });
  }

}
