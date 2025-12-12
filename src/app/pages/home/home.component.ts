import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalMovies: number = 0;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    // Load initial data to get total count
    this.menuService.getItems().subscribe({
      next: (items) => {
        this.totalMovies = items.length;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
      }
    });
  }
}