import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = '/assets/data/products.json'; // ✅ Use only products.json

  async getCategories(): Promise<any[]> {
    try {
        const response = await fetch('./assets/products.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('❌ Failed to load JSON. Status: ${response.status}');
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



  // ✅ Extract supplements from products.json
  async getSupplementPrices(): Promise<{ name: string; price: number }[]> {
    try {
        const categories: { 
            category: string; 
            products: { 
                name: string; 
                price: number; 
                supplements?: { name: string; price: number }[] 
            }[] 
        }[] = await this.getCategories();
        
        let supplementsList: { name: string; price: number }[] = [];

        // ✅ Ensure category.products exists before looping
        categories.forEach((category) => {
            if (category.products && Array.isArray(category.products)) { // ✅ Check if products exists and is an array
                category.products.forEach((product: { name: string; price: number; supplements?: { name: string; price: number }[] }) => {
                    if (product.supplements && product.supplements.length > 0) {
                        product.supplements.forEach((supplement: { name: string; price: number }) => {
                            if (!supplementsList.some(s => s.name === supplement.name)) {
                                supplementsList.push(supplement);
                            }
                        });
                    }
                });
            }
        });

        console.log('✅ Extracted Supplements:', supplementsList);
        return supplementsList;
    } catch (error) {
        console.error('❌ Error extracting supplement prices:', error);
        return [];
    }
}


}