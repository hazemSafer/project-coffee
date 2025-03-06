import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-category-selection',
  standalone: true,
  imports: [CommonModule], // ✅ Add CommonModule here
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.css']
})
export class CategorySelectionComponent {
  @Input() categories: { category: string; products: any[] }[] = []; // Receives categories from parent
  @Output() categorySelected = new EventEmitter<string>(); // Emits selected category

  selectCategory(category: string): void {
    console.log("📌 Category Selected:", category);
    this.categorySelected.emit(category); // Send selected category to parent
  }
}
