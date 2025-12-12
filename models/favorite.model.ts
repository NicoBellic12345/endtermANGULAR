export interface Favorite {
  id: string;
  mealId: string;
  userId?: string;
  addedAt: Date;
  mealData?: {
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
  };
}

export interface LocalFavorite {
  mealId: string;
  addedAt: string;
}