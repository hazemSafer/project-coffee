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
  @Input() products: { name: string; price: number; image?: string; supplements?: string[], showSupplements?: boolean }[] = [];
  @Output() addToBasket = new EventEmitter<{ name: string; price: number; supplements?: string[] }>();

  // ✅ Toggle supplements dropdown
  toggleSupplements(product: any): void {
    product.showSupplements = !product.showSupplements;
  }

  // ✅ Add supplement to an item
  addSupplement(product: any, supplement: string): void {
    if (!product.supplements) {
      product.supplements = [];
    }
    if (!product.supplements.includes(supplement)) {
      product.supplements.push(supplement);
    }
  }

  // ✅ Add product to basket
  addProductToBasket(product: { name: string; price: number; supplements?: string[] }) {
    this.addToBasket.emit(product);
  }
}
