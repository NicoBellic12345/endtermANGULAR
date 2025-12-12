import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItems: any[] = [];

  getMenuItems() {
    return this.menuItems;
  }

  addMenuItem(item: any) {
    this.menuItems.push(item);
  }
}
