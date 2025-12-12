import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item: MenuItem | undefined;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadItem();
  }

  loadItem() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.error = '';
    
    this.menuService.getItemById(id).subscribe({
      next: (item) => {
        this.item = item;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ошибка загрузки фильма';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }

  addToCart() {
    if (this.item) {
      this.menuService.addToCart(this.item);
    }
  }
}