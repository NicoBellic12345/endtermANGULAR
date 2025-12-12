import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, from, of, combineLatest } from 'rxjs';
import { 
  map, 
  switchMap, 
  take, 
  tap, 
  distinctUntilChanged,
  catchError
} from 'rxjs/operators';
import { Favorite, LocalFavorite } from '../models/favorite.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly LOCAL_STORAGE_KEY = 'menuapp_favorites';
  private favoritesSubject = new BehaviorSubject<Favorite[]>([]);
  private mergeMessageShown = new BehaviorSubject<boolean>(false);

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
    this.initializeFavorites();
  }

  private initializeFavorites(): void {
    this.authService.user$
      .pipe(
        switchMap(user => {
          if (user) {
            return this.loadUserFavorites(user.uid).pipe(
              switchMap(serverFavorites => {
                const localFavorites = this.getLocalFavorites();
                
                if (localFavorites.length > 0 && !this.mergeMessageShown.value) {
                  return this.mergeFavorites(user.uid, localFavorites, serverFavorites);
                }
                
                return of(serverFavorites);
              })
            );
          } else {
            return of(this.getLocalFavorites().map(lf => this.mapLocalToFavorite(lf)));
          }
        }),
        catchError(error => {
          console.error('Error loading favorites:', error);
          return of(this.getLocalFavorites().map(lf => this.mapLocalToFavorite(lf)));
        })
      )
      .subscribe(favorites => {
        this.favoritesSubject.next(favorites);
      });
  }

  get favorites$(): Observable<Favorite[]> {
    return this.favoritesSubject.asObservable();
  }

  get mergeMessage$(): Observable<boolean> {
    return this.mergeMessageShown.asObservable();
  }

  isFavorite(mealId: string): Observable<boolean> {
    return this.favorites$.pipe(
      map(favorites => favorites.some(fav => fav.mealId === mealId)),
      distinctUntilChanged()
    );
  }

  addFavorite(mealId: string, mealData?: any): Observable<void> {
    return this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        const favorite: Favorite = {
          id: this.generateId(),
          mealId,
          addedAt: new Date(),
          mealData
        };

        if (user) {
          return this.addToFirestore(user.uid, favorite);
        } else {
          this.addToLocalStorage(favorite);
          return of(undefined);
        }
      })
    );
  }

  removeFavorite(mealId: string): Observable<void> {
    return this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this.removeFromFirestore(user.uid, mealId);
        } else {
          this.removeFromLocalStorage(mealId);
          return of(undefined);
        }
      })
    );
  }

  toggleFavorite(mealId: string, mealData?: any): Observable<boolean> {
    return this.isFavorite(mealId).pipe(
      take(1),
      switchMap(isFavorite => {
        if (isFavorite) {
          return this.removeFavorite(mealId).pipe(map(() => false));
        } else {
          return this.addFavorite(mealId, mealData).pipe(map(() => true));
        }
      })
    );
  }

  private loadUserFavorites(userId: string): Observable<Favorite[]> {
    return this.firestore
      .collection('users')
      .doc(userId)
      .collection<Favorite>('favorites', ref => ref.orderBy('addedAt', 'desc'))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(favorites => favorites || []),
        catchError(() => of([]))
      );
  }

  private addToFirestore(userId: string, favorite: Favorite): Observable<void> {
    return from(
      this.firestore
        .collection('users')
        .doc(userId)
        .collection('favorites')
        .doc(favorite.id)
        .set({
          ...favorite,
          userId,
          addedAt: new Date()
        })
    ).pipe(
      tap(() => {
        const current = this.favoritesSubject.value;
        this.favoritesSubject.next([favorite, ...current]);
      })
    );
  }

  private removeFromFirestore(userId: string, mealId: string): Observable<void> {
    return from(
      this.firestore
        .collection('users')
        .doc(userId)
        .collection('favorites', ref => ref.where('mealId', '==', mealId))
        .get()
    ).pipe(
      switchMap(snapshot => {
        const batch = this.firestore.firestore.batch();
        snapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        return from(batch.commit());
      }),
      tap(() => {
        const updated = this.favoritesSubject.value.filter(fav => fav.mealId !== mealId);
        this.favoritesSubject.next(updated);
      })
    );
  }

  private addToLocalStorage(favorite: Favorite): void {
    const favorites = this.getLocalFavorites();
    const localFavorite: LocalFavorite = {
      mealId: favorite.mealId,
      addedAt: favorite.addedAt.toISOString()
    };

    if (!favorites.some(f => f.mealId === favorite.mealId)) {
      favorites.push(localFavorite);
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(favorites));
      
      const current = this.favoritesSubject.value;
      this.favoritesSubject.next([favorite, ...current]);
    }
  }

  private removeFromLocalStorage(mealId: string): void {
    const favorites = this.getLocalFavorites();
    const updated = favorites.filter(f => f.mealId !== mealId);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(updated));
    
    const currentFavorites = this.favoritesSubject.value;
    const updatedFavorites = currentFavorites.filter(fav => fav.mealId !== mealId);
    this.favoritesSubject.next(updatedFavorites);
  }

  private getLocalFavorites(): LocalFavorite[] {
    const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private mapLocalToFavorite(local: LocalFavorite): Favorite {
    return {
      id: `local_${local.mealId}`,
      mealId: local.mealId,
      addedAt: new Date(local.addedAt)
    };
  }

  private mergeFavorites(
    userId: string, 
    localFavorites: LocalFavorite[], 
    serverFavorites: Favorite[]
  ): Observable<Favorite[]> {
    const localIds = localFavorites.map(lf => lf.mealId);
    const serverIds = serverFavorites.map(sf => sf.mealId);
    
    const uniqueLocalIds = localIds.filter(id => !serverIds.includes(id));
    
    if (uniqueLocalIds.length === 0) {
      return of(serverFavorites);
    }

    const batch = this.firestore.firestore.batch();
    const mergedFavorites = [...serverFavorites];

    uniqueLocalIds.forEach(mealId => {
      const localFavorite = localFavorites.find(lf => lf.mealId === mealId);
      if (localFavorite) {
        const favorite: Favorite = {
          id: this.generateId(),
          mealId,
          userId,
          addedAt: new Date(localFavorite.addedAt)
        };
        
        const favoriteRef = this.firestore
          .collection('users')
          .doc(userId)
          .collection('favorites')
          .doc(favorite.id).ref;
        
        batch.set(favoriteRef, favorite);
        mergedFavorites.push(favorite);
      }
    });

    return from(batch.commit()).pipe(
      tap(() => {
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
        this.mergeMessageShown.next(true);
        this.favoritesSubject.next(mergedFavorites);
        
        setTimeout(() => {
          alert('✅ Ваши локальные избранные рецепты были синхронизированы с аккаунтом!');
        }, 1000);
      }),
      map(() => mergedFavorites),
      catchError(error => {
        console.error('Merge error:', error);
        return of(serverFavorites);
      })
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}