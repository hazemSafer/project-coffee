import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent {
  @Input() orderItems: { name: string; price: number }[] = [];
  @Output() orderValidated = new EventEmitter<void>();
  @Output() orderUpdated = new EventEmitter<{ name: string; price: number }[]>(); // Notify parent when items are removed

  // Remove an item from the basket
  removeItem(index: number): void {
    this.orderItems.splice(index, 1); // Remove item at the given index
    this.orderUpdated.emit(this.orderItems); // Notify parent of update
  }

  // Calculate total price
  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price, 0);
  }

  // Validate order
  validateOrder(): void {
    alert('✅ Commande validée avec succès !');
    this.orderValidated.emit(); // Notify parent to reset basket
  }
}
