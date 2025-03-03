import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../data.service';


@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnChanges {
  @Input() orderItems: { 
    name: string; 
    price: number; 
    supplements?: { name: string, price: number }[]; 
    showSupplements?: boolean; 
    quantity: number 
  }[] = [];

  @Output() orderUpdated = new EventEmitter<typeof this.orderItems>();
  @Output() orderValidated = new EventEmitter<void>();

  @Output() addToBasket = new EventEmitter<{ name: string; price: number; supplements?: { name: string; price: number }[]; quantity: number }>(); // Add this emitter
  
  availableSupplements: { name: string; price: number }[] = []; // ✅ Dynamically populated
  supplementPrices: { name: string; price: number }[] = []; // ✅ Stores supplement prices

  constructor(private dataService: DataService) {}

  async ngOnInit(): Promise<void> {
    this.supplementPrices = await this.dataService.getSupplementPrices();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderItems']) {
      this.updateAvailableSupplements();
    }
  }
  addProductToBasket(product: { name: string; price: number; supplements?: string[] }) {
    // 🛒 Create a new product entry with supplements formatted as { name: string, price: number }
    const newProduct = { 
      name: product.name, 
      price: product.price, 
      supplements: product.supplements?.map(s => ({ name: s, price: 0 })) || [],  // Convert string[] to { name, price }
      quantity: 1 
    };
  
    // Emit the new product entry to the parent component (if needed)
    this.addToBasket.emit(newProduct);
  
    this.getTotalPrice();  // Recalculate the total price after adding the product
  }


  // ✅ Extract unique supplements from products in the basket
  
  updateAvailableSupplements(): void {
    this.availableSupplements = this.supplementPrices.map(supplement => ({
      name: supplement.name,
      price: supplement.price
    }));
    console.log('✅ Available Supplements:', this.availableSupplements);
  }
  

  // ✅ Toggle supplements dropdown
  toggleSupplements(index: number): void {
    this.orderItems[index].showSupplements   = !this.orderItems[index].showSupplements;
  }

  // ✅ Add supplement and fetch its price
  // Add supplement to an item in the basket
  addSupplement(index: number, supplement: { name: string; price: number }): void {
    const product = this.orderItems[index];
  
    if (!product.supplements) {
      product.supplements = []; // Ensure it starts empty
    }
  
    // Check if the supplement already exists
    if (!product.supplements.find(s => s.name === supplement.name)) {
      product.supplements.push(supplement); // Add the supplement
    }
  
    // Emit the order updated event with the new supplement
    this.orderUpdated.emit([...this.orderItems]);
  }
  



  // ✅ Increase item quantity
  increaseQuantity(index: number): void {
    this.orderItems[index].quantity += 1;
    this.orderUpdated.emit([...this.orderItems]); // ✅ UI will recalculate automatically
}


  // ✅ Decrease item quantity (remove item if it reaches 0)
  decreaseQuantity(index: number): void {
    if (this.orderItems[index].quantity > 1) {
        this.orderItems[index].quantity -= 1;
    } else {
        this.orderItems.splice(index, 1);
    }
    this.orderUpdated.emit([...this.orderItems]); // ✅ UI will recalculate total
}


  // ✅ Calculate total price (including quantity and supplements)
  // ✅ Ensure the total price includes supplements ONLY if they are selected
  
  


  // ✅ Validate order
  validateOrder(): void {
    alert('✅ Commande validée avec succès !');
    this.orderValidated.emit();
  }

  // ✅ Ensure total price is calculated correctly
  getTotalPrice(): number {
    return this.orderItems.reduce((total, item) => {
        // Base price of the item (multiplied by the quantity)
        let basePrice = item.price * item.quantity;

        // Add supplement cost only if supplements are selected
        let supplementCost = 0;
        if (item.supplements && item.supplements.length > 0) {
            supplementCost = item.supplements.reduce((subTotal, s) => subTotal + s.price, 0);
        }

        // Return total sum with base price + supplement cost
        return total + basePrice + supplementCost;
    }, 0);
}

}