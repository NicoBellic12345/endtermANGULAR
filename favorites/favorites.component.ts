import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Favorite } from '../../models/favorite.model';
import { Meal } from '../../models/meal.model';
import { FavoritesService } from '../../core/favorites.service';
import { MealService } from '../../services/meal.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-favorites',
  template: `
    <div class="favorites-container">
      <div class="favorites-header">
        <h1>📋 Мои избранные рецепты</h1>
        <p *ngIf="(favorites$ | async)?.length === 0" class="empty-message">
          У вас пока нет избранных рецептов. Добавляйте их со знаком ❤️
        </p>
        <div *ngIf="mergeMessage$ | async" class="merge-notification">
          ✅ Ваши локальные избранные синхронизированы с аккаунтом
        </div>
      </div>

      <div class="favorites-grid" *ngIf="(favoritesWithDetails$ | async) as favorites">
        <div class="favorite-card" *ngFor="let favorite of favorites">
          <div class="card-image">
            <img [src]="favorite.mealData?.strMealThumb || 'assets/default-meal.jpg'" 
                 [alt]="favorite.mealData?.strMeal">
            <button class="remove-btn" (click)="removeFavorite(favorite.mealId)">
              ❌
            </button>
          </div>
          <div class="card-content">
            <h3>{{ favorite.mealData?.strMeal || 'Загрузка...' }}</h3>
            <p class="category">{{ favorite.mealData?.strCategory || '' }}</p>
            <p class="added-date">
              Добавлено: {{ favorite.addedAt | date:'dd.MM.yyyy' }}
            </p>
            <a [routerLink]="['/meal', favorite.mealId]" class="details-link">
              Перейти к рецепту →
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .favorites-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .favorites-header h1 {
      color: #333;
      margin-bottom: 10px;
    }
    
    .empty-message {
      color: #666;
      font-size: 18px;
      padding: 40px;
      background: #f9f9f9;
      border-radius: 10px;
    }
    
    .merge-notification {
      background: #d4edda;
      color: #155724;
      padding: 10px 15px;
      border-radius: 5px;
      margin-top: 15px;
      display: inline-block;
    }
    
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }
    
    .favorite-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .favorite-card:hover {
      transform: translateY(-5px);
    }
    
    .card-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .remove-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }
    
    .remove-btn:hover {
      background: white;
    }
    
    .card-content {
      padding: 20px;
    }
    
    .card-content h3 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 18px;
    }
    
    .category {
      color: #666;
      font-size: 14px;
      margin-bottom: 10px;
    }
    
    .added-date {
      color: #999;
      font-size: 12px;
      margin-bottom: 15px;
    }
    
    .details-link {
      display: inline-block;
      color: #1976d2;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    
    .details-link:hover {
      color: #0d47a1;
      text-decoration: underline;
    }
    
    @media (max-width: 768px) {
      .favorites-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
      }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites$: Observable<Favorite[]>;
  favoritesWithDetails$: Observable<any[]>;
  mergeMessage$: Observable<boolean>;

  constructor(
    private favoritesService: FavoritesService,
    private mealService: MealService,
    private authService: AuthService
  ) {
    this.favorites$ = this.favoritesService.favorites$;
    this.mergeMessage$ = this.favoritesService.mergeMessage$;
  }

  ngOnInit(): void {
    this.favoritesWithDetails$ = this.favorites$.pipe(
      switchMap(favorites => {
        if (favorites.length === 0) {
          return of([]);
        }
        
        const detailsObservables = favorites.map(fav =>
          this.mealService.getMealById(fav.mealId).pipe(
            map(meal => ({
              ...fav,
              mealData: meal ? {
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb,
                strCategory: meal.strCategory
              } : null
            }))
          )
        );
        
        return combineLatest(detailsObservables);
      })
    );
  }

  removeFavorite(mealId: string): void {
    if (confirm('Удалить рецепт из избранного?')) {
      this.favoritesService.removeFavorite(mealId).subscribe();
    }
  }
}