import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <nav class="nav-container">
        <div class="logo">
          <a routerLink="/">🍽️ MenuProject</a>
        </div>
        
        <div class="nav-links">
          <a routerLink="/meals" routerLinkActive="active">Рецепты</a>
          <a routerLink="/favorites" routerLinkActive="active">Избранное</a>
          <a *ngIf="(isAuthenticated$ | async)" 
             routerLink="/profile" 
             routerLinkActive="active">
            Профиль
          </a>
        </div>
        
        <div class="auth-section">
          <div *ngIf="(isAuthenticated$ | async); else loginSection" class="user-info">
            <div class="user-photo" (click)="goToProfile()">
              <img 
                *ngIf="(profilePhotoUrl$ | async); else defaultPhoto"
                [src]="profilePhotoUrl$ | async" 
                alt="Фото профиля"
              />
              <ng-template #defaultPhoto>
                <div class="default-avatar">👤</div>
              </ng-template>
            </div>
            <span class="user-email">{{ (userEmail$ | async) }}</span>
            <button class="logout-btn" (click)="logout()">Выйти</button>
          </div>
          
          <ng-template #loginSection>
            <a routerLink="/login" class="auth-btn">Войти</a>
            <a routerLink="/signup" class="auth-btn signup">Регистрация</a>
          </ng-template>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
    }
    
    .logo a {
      font-size: 24px;
      font-weight: bold;
      color: #1976d2;
      text-decoration: none;
    }
    
    .nav-links {
      display: flex;
      gap: 30px;
    }
    
    .nav-links a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    
    .nav-links a:hover,
    .nav-links a.active {
      color: #1976d2;
    }
    
    .auth-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-photo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid #1976d2;
    }
    
    .user-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .default-avatar {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }
    
    .user-email {
      font-size: 14px;
      color: #666;
    }
    
    .logout-btn {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 5px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .logout-btn:hover {
      background: #ff6b6b;
      color: white;
      border-color: #ff6b6b;
    }
    
    .auth-btn {
      padding: 8px 20px;
      border-radius: 5px;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.3s;
    }
    
    .auth-btn.signup {
      background: #1976d2;
      color: white;
    }
    
    .auth-btn:not(.signup) {
      color: #1976d2;
      border: 1px solid #1976d2;
    }
    
    .auth-btn:hover {
      opacity: 0.9;
    }
    
    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        height: auto;
        padding: 15px;
      }
      
      .nav-links {
        margin: 15px 0;
      }
      
      .user-email {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  userEmail$: Observable<string>;
  profilePhotoUrl$: Observable<string | null>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.userEmail$ = this.authService.user$.pipe(
      map(user => user?.email || '')
    );
    this.profilePhotoUrl$ = this.authService.user$.pipe(
      map(user => user?.profilePhoto || null)
    );
  }

  ngOnInit(): void {}

  logout(): void {
    this.authService.logout();
  }

  goToProfile(): void {
    // Навигация через routerLink в шаблоне
  }
}