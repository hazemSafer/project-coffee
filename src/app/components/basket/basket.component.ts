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
  @Input() orderItems: { name: string; price: number; supplements?: string[], showSupplements?: boolean, quantity: number }[] = [];
  @Output() orderUpdated = new EventEmitter<{ name: string; price: number; supplements?: string[], showSupplements?: boolean, quantity: number }[]>();
  @Output() orderValidated = new EventEmitter<void>();

  availableSupplements: string[] = ['Fromage', 'Sauce', 'Salade', 'Oignons'];

  // ✅ Toggle supplements dropdown
  toggleSupplements(index: number): void {
    if (this.orderItems[index].showSupplements === undefined) {
      this.orderItems[index].showSupplements = false;
    }
    this.orderItems[index].showSupplements = !this.orderItems[index].showSupplements;
  }

  // ✅ Add supplement to an item
  addSupplement(index: number, supplement: string): void {
    if (!this.orderItems[index].supplements) {
      this.orderItems[index].supplements = [];
    }
    if (!this.orderItems[index].supplements.includes(supplement)) {
      this.orderItems[index].supplements.push(supplement);
    }
    this.orderUpdated.emit([...this.orderItems]);
  }

  // ✅ Increase item quantity
  increaseQuantity(index: number): void {
    this.orderItems[index].quantity += 1;
    this.orderUpdated.emit([...this.orderItems]);
  }

  // ✅ Decrease item quantity (remove item if it reaches 0)
  decreaseQuantity(index: number): void {
    if (this.orderItems[index].quantity > 1) {
      this.orderItems[index].quantity -= 1;
    } else {
      this.orderItems.splice(index, 1);
    }
    this.orderUpdated.emit([...this.orderItems]);
  }

  // ✅ Calculate total price (including quantity and supplements)
  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => {
      let supplementCost = (item.supplements ? item.supplements.length * 0.50 : 0);
      return total + (item.price + supplementCost) * item.quantity;
    }, 0);
  }

  // ✅ Validate order
  validateOrder(): void {
    alert('✅ Commande validée avec succès !');
    this.orderValidated.emit();
  }
}
