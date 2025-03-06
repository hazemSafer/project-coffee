import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = '/assets/products.json'; // Ensure this matches the correct path

  async getCategories(): Promise<{ 
    category: string; 
    products: { 
      name: string; 
      price: number; 
      supplements?: { name: string; price: number }[] 
    }[] 
  }[]> {
    try {
        const response = await fetch(this.jsonUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error(`❌ Failed to load JSON. Status: ${response.status}`);
            return [];
        }

        const data = await response.json();

        // ✅ Ensure the data is correctly structured
        if (!Array.isArray(data)) {
            console.error("❌ Invalid JSON format. Expected an array.");
            return [];
        }

        console.log("✅ Successfully fetched categories:", data);
        return data;
        
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        return [];
    }
  }

  // ✅ Extract unique supplements from products.json
  async getSupplementPrices(): Promise<{ name: string; price: number }[]> {
    try {
        const categories = await this.getCategories();
        const supplementsSet = new Set<string>(); // Using a Set to store unique supplement names
        const supplementsList: { name: string; price: number }[] = [];

        categories.forEach(category => {
            category.products?.forEach((product: { 
                name: string; 
                price: number; 
                supplements?: { name: string; price: number }[] 
            }) => {
                product.supplements?.forEach((supplement: { name: string; price: number }) => {
                    if (!supplementsSet.has(supplement.name)) {
                        supplementsSet.add(supplement.name);
                        supplementsList.push(supplement);
                    }
                });
            });
        });

        console.log('✅ Extracted Supplements:', supplementsList);
        return supplementsList;
    } catch (error) {
        console.error('❌ Error extracting supplement prices:', error);
        return [];
    }
  }
}
