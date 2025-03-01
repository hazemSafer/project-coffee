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
  orderItems: { name: string; price: number; supplements?: string[], quantity: number }[] = [];
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

  addToOrder(item: { name: string; price: number, supplements?: string[] }) {
    // ✅ Check if the item is already in the basket
    const existingItem = this.orderItems.find(orderItem => orderItem.name === item.name);
    
    if (existingItem) {
      existingItem.quantity += 1;  // Increase quantity if item exists
    } else {
      this.orderItems.push({ ...item, quantity: 1 }); // Otherwise, add a new entry
    }
    
    this.calculateTotal();
  }

  toggleSupplements(product: any) {
    product.showSupplements = !product.showSupplements;
  }

  addSupplement(product: any, supplement: string) {
    if (!product.supplements) {
      product.supplements = [];
    }
    if (!product.supplements.includes(supplement)) {
      product.supplements.push(supplement);
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalPrice = this.orderItems.reduce((sum, item) => {
      let supplementCost = item.supplements ? item.supplements.length * 0.50 : 0;
      return sum + (item.price + supplementCost) * item.quantity;
    }, 0);
  }
}
