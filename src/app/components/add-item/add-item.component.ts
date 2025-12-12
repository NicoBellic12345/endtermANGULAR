import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  newItem = {
    name: '',
    price: 0,
    description: '',
    image: '',
    category: 'action',
    actors: [''],
    rating: 4.0
  };

  previewImage: string | ArrayBuffer | null = null;
  isSubmitting: boolean = false;

  categories = [
    { id: 'action', name: 'Боевик' },
    { id: 'comedy', name: 'Комедия' },
    { id: 'drama', name: 'Драма' },
    { id: 'fantasy', name: 'Фэнтези' },
    { id: 'horror', name: 'Ужасы' },
    { id: 'sci-fi', name: 'Научная фантастика' },
    { id: 'romance', name: 'Романтика' },
    { id: 'thriller', name: 'Триллер' },
    { id: 'animation', name: 'Анимация' }
  ];

  constructor(private menuService: MenuService) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        this.newItem.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addItem() {
    if (!this.newItem.name.trim() || this.newItem.price <= 0) {
      alert('Пожалуйста, заполните название и стоимость аренды корректно');
      return;
    }

    this.isSubmitting = true;

    const itemToAdd = {
      ...this.newItem,
      image: this.newItem.image || this.getDefaultImage(this.newItem.category),
      actors: this.newItem.actors.filter(ing => ing.trim() !== ''),
      rating: this.newItem.rating
    };

    // Call the API to add the movie
    this.menuService.addMenuItem(itemToAdd).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        alert('🎬 Фильм успешно добавлен в каталог!');
        this.resetForm();
      },
      error: (error) => {
        this.isSubmitting = false;
        alert('Ошибка при добавлении фильма. Попробуйте еще раз.');
        console.error('Error adding movie:', error);
      }
    });
  }

  addIngredient() {
    this.newItem.actors.push('');
  }

  removeIngredient(index: number) {
    this.newItem.actors.splice(index, 1);
  }

  private getDefaultImage(category: string): string {
    const defaultImages: { [key: string]: string } = {
      action: 'https://images.unsplash.com/photo-1489599809505-7c8e1c869cc2?w=300&h=450&fit=crop',
      comedy: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop',
      drama: 'https://images.unsplash.com/photo-1489599809505-7c8e1c869cc2?w=300&h=450&fit=crop',
      fantasy: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
      horror: 'https://images.unsplash.com/photo-1509248961154-411f6c4d36c9?w=300&h=450&fit=crop',
      'sci-fi': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop',
      romance: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
      thriller: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop',
      animation: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=300&h=450&fit=crop'
    };
    return defaultImages[category] || defaultImages['action'];
  }

  private resetForm(): void {
    this.newItem = { 
      name: '', 
      price: 0, 
      description: '', 
      image: '',
      category: 'action',
      actors: [''],
      rating: 4.0
    };
    this.previewImage = null;
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}