import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() totalPrice: number = 0;
  @Output() orderValidated = new EventEmitter<void>();

  validateOrder() {
    this.orderValidated.emit();
  }
}
