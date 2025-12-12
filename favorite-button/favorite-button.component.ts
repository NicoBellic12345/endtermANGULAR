import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoritesService } from '../../core/favorites.service';

@Component({
  selector: 'app-favorite-button',
  template: `
    <button 
      class="favorite-btn"
      [class.favorited]="isFavorite$ | async"
      (click)="toggleFavorite()"
      [title]="(isFavorite$ | async) ? 'Удалить из избранного' : 'Добавить в избранное'"
    >
      {{ (isFavorite$ | async) ? '❤️' : '🤍' }}
    </button>
  `,
  styles: [`
    .favorite-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 5px;
      transition: transform 0.2s ease;
    }
    
    .favorite-btn:hover {
      transform: scale(1.1);
    }
    
    .favorite-btn.favorited {
      animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `]
})
export class FavoriteButtonComponent implements OnInit {
  @Input() mealId!: string;
  @Input() mealData: any;
  
  isFavorite$!: Observable<boolean>;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.isFavorite$ = this.favoritesService.isFavorite(this.mealId);
  }

  toggleFavorite(): void {
    this.favoritesService.toggleFavorite(this.mealId, this.mealData).subscribe();
  }
}