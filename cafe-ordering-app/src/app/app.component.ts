import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { BasketComponent } from './components/basket/basket.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, BasketComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  totalPrice: number = 0;
  orderItems: { name: string; price: number }[] = [];
  categories: any[] = [];
  products: any[] = [];
  title: string = 'Cafe Ordering App';

  constructor(private dataService: DataService) {}

  // ✅ Load categories when the app initializes
  async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  // ✅ Fetch categories from JSON
  async loadCategories(): Promise<void> {
    try {
      const data = await this.dataService.getCategories();
      this.categories = data.map((cat: any) => ({
        ...cat,
        image: this.getCategoryImage(cat.category), // Attach image path
      }));
      console.log('✅ Categories loaded:', this.categories);
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
    }
  }
  handleOrderValidation() {
    // Reset the basket after order validation
    this.orderItems = [];
    this.totalPrice = 0;
    console.log('🧹 Panier vidé après validation.');
  }  
  // ✅ Function to get category image paths
  getCategoryImage(category: string): string {
    const imageMap: { [key: string]: string } = {
      'Food': 'assets/images/burger.jpg',
      'Boissons Chaudes': 'assets/images/boissons-chaude.webp',
      'Boissons Froides': 'assets/images/boissons-froides.jpg',
      'Petit Déjeuner': 'assets/images/petit-dejeuner.jpg',
    };
    return imageMap[category] || 'assets/images/default.jpg';
  }

  // ✅ Display products for the selected category
  onCategoryClick(category: string): void {
    const selectedCategory = this.categories.find(cat => cat.category === category);
    this.products = selectedCategory ? selectedCategory.products : [];
    console.log(`✅ Products for ${category}:`, this.products);
  }

  // ✅ Add product to order
  addToOrder(item: { name: string; price: number }) {
    this.orderItems.push(item);
    this.calculateTotal();
  }

  // ✅ Calculate total price
  calculateTotal() {
    this.totalPrice = this.orderItems.reduce((sum, item) => sum + item.price, 0);
  }
  
}


