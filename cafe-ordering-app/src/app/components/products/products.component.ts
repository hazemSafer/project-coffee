import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  @Input() products: any[] = [];  // Receive product list from parent
  @Output() addToBasket = new EventEmitter<any>();  // Emit when product is added

  // Emit event to parent when adding to basket
  addProductToBasket(product: any): void {
    this.addToBasket.emit(product);
  }
}
