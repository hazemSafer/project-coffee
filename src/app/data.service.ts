import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private jsonUrl = '/assets/products.json';

  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(this.jsonUrl);
      if (!response.ok) {
        console.warn(`⚠️ Failed to load JSON. Status: ${response.status}`);
        return [];
      }
      const data = await response.json();
      console.log('✅ Fetched Categories:', data);
      return data;
    } catch (error) {
      console.warn('⚠️ Error loading categories. Returning empty array.');
      return [];
    }
  }
}
