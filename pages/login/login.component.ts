import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService) {}

  async login() {
    this.loading = true;
    this.error = '';

    try {
      await this.authService.login(this.email, this.password);
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}