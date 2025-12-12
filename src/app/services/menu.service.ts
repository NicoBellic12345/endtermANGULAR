import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  actors: string[];
  rating: number; 
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  // API base URL - change this to your backend URL
  private apiUrl = 'http://localhost:3000/api';
  
  public menuItems = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItems.asObservable();
  
  public cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();
  
  private categories = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categories.asObservable();

  private selectedCategory = new BehaviorSubject<string>('all');
  public selectedCategory$ = this.selectedCategory.asObservable();

  private loading = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
    this.loadCartFromStorage();
  }

  // Load categories from API
  loadCategories(): void {
    this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`)
      .pipe(
        catchError(error => {
          console.error('Error loading categories:', error);
          // Use default categories if API fails
          this.categories.next(this.getDefaultCategories());
          return of({ success: false, data: this.getDefaultCategories() });
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.categories.next(response.data);
          }
        }
      });
  }

  // Get all movies with optional search query and category filter
  getItems(query?: string, category?: string): Observable<MenuItem[]> {
    this.loading.next(true);
    let url = `${this.apiUrl}/movies`;
    const params: string[] = [];
    
    if (query && query.trim()) {
      params.push(`q=${encodeURIComponent(query.trim())}`);
    }
    
    if (category && category !== 'all') {
      params.push(`category=${encodeURIComponent(category)}`);
    }
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return this.http.get<ApiResponse<MenuItem[]>>(url).pipe(
      tap(() => this.loading.next(false)),
      map(response => {
        if (response.success && response.data) {
          this.menuItems.next(response.data);
          return response.data;
        }
        return [];
      }),
      catchError(error => {
        this.loading.next(false);
        console.error('Error loading movies:', error);
        return of([]);
      })
    );
  }

  // Get single movie by ID
  getItemById(id: number): Observable<MenuItem | undefined> {
    this.loading.next(true);
    return this.http.get<ApiResponse<MenuItem>>(`${this.apiUrl}/movies/${id}`).pipe(
      tap(() => this.loading.next(false)),
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return undefined;
      }),
      catchError(error => {
        this.loading.next(false);
        console.error(`Error loading movie ${id}:`, error);
        return of(undefined);
      })
    );
  }

  // Add new movie
  addMenuItem(item: Omit<MenuItem, 'id'>): Observable<MenuItem> {
    this.loading.next(true);
    return this.http.post<ApiResponse<MenuItem>>(`${this.apiUrl}/movies`, item).pipe(
      tap(() => this.loading.next(false)),
      map(response => {
        if (response.success && response.data) {
          // Reload movies after adding
          this.loadMenuItems();
          return response.data;
        }
        throw new Error(response.error || 'Failed to add movie');
      }),
      catchError(error => {
        this.loading.next(false);
        console.error('Error adding movie:', error);
        return throwError(() => error);
      })
    );
  }

  // Update movie
  updateMenuItem(id: number, item: Partial<MenuItem>): Observable<MenuItem> {
    this.loading.next(true);
    return this.http.put<ApiResponse<MenuItem>>(`${this.apiUrl}/movies/${id}`, item).pipe(
      tap(() => this.loading.next(false)),
      map(response => {
        if (response.success && response.data) {
          this.loadMenuItems();
          return response.data;
        }
        throw new Error(response.error || 'Failed to update movie');
      }),
      catchError(error => {
        this.loading.next(false);
        console.error('Error updating movie:', error);
        return throwError(() => error);
      })
    );
  }

  // Delete movie
  deleteMenuItem(id: number): Observable<boolean> {
    this.loading.next(true);
    return this.http.delete<ApiResponse<MenuItem>>(`${this.apiUrl}/movies/${id}`).pipe(
      tap(() => this.loading.next(false)),
      map(response => {
        if (response.success) {
          this.loadMenuItems();
          return true;
        }
        return false;
      }),
      catchError(error => {
        this.loading.next(false);
        console.error('Error deleting movie:', error);
        return of(false);
      })
    );
  }

  // Load all movies
  loadMenuItems(category?: string): void {
    this.getItems('', category).subscribe({
      error: (error) => {
        console.error('Error loading menu items:', error);
      }
    });
  }

  // Set selected category
  setSelectedCategory(category: string): void {
    this.selectedCategory.next(category);
    this.loadMenuItems(category);
  }

  // Cart management methods (these work locally with localStorage)
  addToCart(item: MenuItem): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(cartItem => cartItem.menuItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({ menuItem: item, quantity: 1 });
    }
    
    this.cartItems.next([...currentCart]);
    this.saveCartToStorage();
  }

  removeFromCart(itemId: number): void {
    const currentCart = this.cartItems.value.filter(item => item.menuItem.id !== itemId);
    this.cartItems.next(currentCart);
    this.saveCartToStorage();
  }

  updateQuantity(itemId: number, quantity: number): void {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(cartItem => cartItem.menuItem.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentCart]);
        this.saveCartToStorage();
      }
    }
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => 
      total + (item.menuItem.price * item.quantity), 0
    );
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage();
  }

  getCartItemCount(): number {
    return this.cartItems.value.reduce((total, item) => total + item.quantity, 0);
  }

  // Local storage for cart persistence
  private saveCartToStorage(): void {
    try {
      localStorage.setItem('eyemovie_cart', JSON.stringify(this.cartItems.value));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      const savedCart = localStorage.getItem('eyemovie_cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        this.cartItems.next(cart);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }

  // Default categories fallback
  private getDefaultCategories(): Category[] {
    return [
      { id: 'all', name: 'Все фильмы' },
      { id: 'action', name: 'Боевики' },
      { id: 'comedy', name: 'Комедии' },
      { id: 'drama', name: 'Драмы' },
      { id: 'fantasy', name: 'Фэнтези' },
      { id: 'horror', name: 'Ужасы' },
      { id: 'sci-fi', name: 'Фантастика' },
      { id: 'romance', name: 'Мелодрамы' }
    ];
  }

  // Check API health
  checkHealth(): Observable<boolean> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/health`).pipe(
      map(response => response.success),
      catchError(() => of(false))
    );
  }
}