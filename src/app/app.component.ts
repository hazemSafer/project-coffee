import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { BasketComponent } from './components/basket/basket.component';
import { ProductsComponent } from './components/products/products.component';
import { CategorySelectionComponent } from './components/category-selection/category-selection.component'; // ✅ Import here


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BasketComponent, ProductsComponent, CategorySelectionComponent], // ✅ Add it here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = 'cafe-ordering-app';
  totalPrice: number = 0;
  orderItems: { 
    name: string; 
    price: number; 
    quantity: number;
    supplements?: { name: string; price: number }[]; 
  }[] = [];
  categories: any[] = [];
  products: any[] = [];

  constructor(private dataService: DataService) {}

  async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    try {
      const data = await this.dataService.getCategories();
      this.categories = data;
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
    }
  }

  handleOrderValidation() {
    this.orderItems = [];
    this.totalPrice = 0;
  }

  onCategoryClick(category: string): void {
    console.log("🛑 Category Clicked:", category); // Debugging log
    const selectedCategory = this.categories.find(cat => cat.category === category);
    this.products = selectedCategory ? selectedCategory.products : [];
    console.log("✅ Products Loaded for Category:", this.products); // Debugging log
  }


  addToOrder(item: { name: string; price: number; supplements?: { name: string; price: number }[]; quantity: number }) {
    const existingItem = this.orderItems.find(orderItem => 
      orderItem.name === item.name && 
      JSON.stringify(orderItem.supplements) === JSON.stringify(item.supplements)
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.orderItems.push(item);
    }

    this.getTotalPrice();
  }

  getTotalPrice(): void {
    this.totalPrice = this.orderItems.reduce((sum, item) => {
      let basePrice = item.price * item.quantity;
      let supplementCost = item.supplements?.reduce((s, supp) => s + supp.price, 0) || 0;
      return sum + basePrice + (supplementCost * item.quantity);
    }, 0);
  }

  // ✅ FIX: Define the getCategoryImage method
  getCategoryImage(category: string): string {
    const imageMap: { [key: string]: string } = {
        'Food': 'assets/images/burger.jpg',
        'Boissons Chaudes': 'assets/images/boissons-chaude.webp',
        'Boissons Froides': 'assets/images/boissons-froides.jpg',
        'Petit Déjeuner': 'assets/images/petit-dejeuner.jpg',
    };
    return imageMap[category] || 'assets/images/default.jpg';
  }
}
