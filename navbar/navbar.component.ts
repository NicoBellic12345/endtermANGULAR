import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cartItemCount = 0;
  user: any = null;

  constructor(
    public menuService: MenuService,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.menuService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });


    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  getCartItemCount(): number {
    return this.cartItemCount;
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}