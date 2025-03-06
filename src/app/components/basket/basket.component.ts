// basket.component.ts
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
  @Input() orderItems: { 
    name: string; 
    price: number; 
    supplements?: { name: string; price: number }[]; 
    quantity: number 
  }[] = [];

  @Output() orderUpdated = new EventEmitter<typeof this.orderItems>();
  @Output() orderValidated = new EventEmitter<void>();

  removeItem(index: number): void {
    this.orderItems.splice(index, 1);
    this.orderUpdated.emit([...this.orderItems]);
  }

  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => {
      let basePrice = item.price * item.quantity;
      let supplementCost = item.supplements?.reduce((sum, s) => sum + s.price, 0) || 0;
      return total + basePrice + (supplementCost * item.quantity);
    }, 0);
  }

  validateOrder(): void {
    alert('✅ Commande validée avec succès !');
    this.orderValidated.emit();
  }
}