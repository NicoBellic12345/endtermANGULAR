import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService, CartItem } from '../../services/menu.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  constructor(public menuService: MenuService) {}

  removeFromCart(itemId: number) {
    this.menuService.removeFromCart(itemId);
  }

  updateQuantity(itemId: number, quantity: number) {
    this.menuService.updateQuantity(itemId, quantity);
  }

  clearCart() {
    this.menuService.clearCart();
  }
  checkout() {
  const total = this.menuService.getCartTotal();
  alert(`Вы заказали фильм на сумму: ${total} ₸`);
  this.menuService.clearCart();
  }
}