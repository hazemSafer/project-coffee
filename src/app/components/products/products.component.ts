// products.component.ts
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
  @Input() products: { 
    name: string; 
    price: number; 
    image?: string; 
    supplements?: { name: string; price: number }[] 
  }[] = [];

  @Output() addToBasket = new EventEmitter<{ 
    name: string; 
    price: number; 
    supplements?: { name: string; price: number }[]; 
    quantity: number;
  }>();

  selectedSupplements: { [key: string]: { name: string; price: number }[] } = {};
  productQuantities: { [key: string]: number } = {}; // Stores the quantity for each product

  toggleSupplements(productName: string): void {
    this.selectedSupplements[productName] = this.selectedSupplements[productName] || [];
  }

  addSupplement(productName: string, supplement: { name: string; price: number }): void {
    if (!this.selectedSupplements[productName]) {
      this.selectedSupplements[productName] = [];
    }
    if (!this.selectedSupplements[productName].find(s => s.name === supplement.name)) {
      this.selectedSupplements[productName].push(supplement);
    }
  }

  increaseQuantity(productName: string): void {
    if (!this.productQuantities[productName]) {
      this.productQuantities[productName] = 1;
    } else {
      this.productQuantities[productName]++;
    }
  }

  decreaseQuantity(productName: string): void {
    if (this.productQuantities[productName] > 1) {
      this.productQuantities[productName]--;
    }
  }

  addProductToBasket(product: { name: string; price: number; supplements?: { name: string; price: number }[] }) {
    const quantity = this.productQuantities[product.name] || 1;
    const selectedSupps = this.selectedSupplements[product.name] ? [...this.selectedSupplements[product.name]] : [];
    
    this.addToBasket.emit({
      name: product.name,
      price: product.price,
      supplements: selectedSupps,
      quantity: quantity
    });
    
    this.selectedSupplements[product.name] = []; // Reset selection
    this.productQuantities[product.name] = 1;
  }
}
