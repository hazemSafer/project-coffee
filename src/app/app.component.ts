import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { BasketComponent } from './components/basket/basket.component';
import { ProductsComponent } from './components/products/products.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BasketComponent, ProductsComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  totalPrice: number = 0;
  orderItems: { 
    name: string; 
    price: number; 
    quantity: number;
    supplements?: { name: string; price: number }[]; 
  }[] = [];
  categories: any[] = [];
  products: any[] = [];
  title: string = 'Cafe Ordering App';

  constructor(private dataService: DataService) {}

  async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    try {
      const data = await this.dataService.getCategories();
      this.categories = data.map((cat: any) => ({
        ...cat,
        image: this.getCategoryImage(cat.category),
      }));
      console.log('✅ Categories loaded:', this.categories);
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
    }
  }

  handleOrderValidation() {
    this.orderItems = [];
    this.totalPrice = 0;
  }

  getCategoryImage(category: string): string {
    const imageMap: { [key: string]: string } = {
      'Food': 'assets/images/burger.jpg',
      'Boissons Chaudes': 'assets/images/boissons-chaude.webp',
      'Boissons Froides': 'assets/images/boissons-froides.jpg',
      'Petit Déjeuner': 'assets/images/petit-dejeuner.jpg',
    };
    return imageMap[category] || 'assets/images/default.jpg';
  }

  onCategoryClick(category: string): void {
    const selectedCategory = this.categories.find(cat => cat.category === category);
    this.products = selectedCategory ? selectedCategory.products : [];
  }

  /**
   * ✅ Add product to the basket
   */
  addToOrder(item: { name: string; price: number; supplements?: { name: string; price: number }[] }) {
    const newItem = { 
      name: item.name, 
      price: item.price, 
      supplements: item.supplements ? [...item.supplements] : [], 
      quantity: 1 
    };

    const existingItem = this.orderItems.find(orderItem => orderItem.name === item.name);

    if (existingItem) {
      existingItem.quantity += 1;
      item.supplements?.forEach(supplement => {
        const existingSupplement = existingItem.supplements.find(s => s.name === supplement.name);
        if (!existingSupplement) {
          existingItem.supplements.push(supplement);
        }
      });
    } else {
      this.orderItems.push(newItem);
    }

    this.getTotalPrice();  // Update total price after adding the item
  }

  /**
   * ✅ Add a supplement to an item in the basket
   */
  addSupplement(index: number, supplement: { name: string; price: number }): void {
    const product = this.orderItems[index];

    if (!product.supplements) {
      product.supplements = [];  // Ensure the supplements array exists
    }

    if (!product.supplements.some(s => s.name === supplement.name)) {
      product.supplements.push(supplement);
    }

    this.getTotalPrice();  // Update the total price when supplement is added
  }

  /**
   * ✅ Correct total price calculation (only adds supplement cost when selected)
   */
  getTotalPrice(): void {
    this.totalPrice = this.orderItems.reduce((sum, item) => {
      let basePrice = item.price * item.quantity;  // Base price with quantity

      let supplementCost = 0;
      if (item.supplements && item.supplements.length > 0) {
        supplementCost = item.supplements.reduce((sum, s) => sum + s.price, 0) * item.quantity;  // Add supplement cost
      }

      return sum + basePrice + supplementCost;  // Add base price + supplement cost
    }, 0);
  }

  /**
   * ✅ Toggle Supplements Visibility
   */
  toggleSupplements(product: any) {
    product.showSupplements = !product.showSupplements;
  }

}