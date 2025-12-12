import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-offline-message',
  template: `
    <div *ngIf="(isOffline$ | async)" class="offline-message">
      <div class="offline-content">
        <span class="offline-icon">📶</span>
        <p>Вы сейчас в офлайн-режиме. Некоторые функции могут быть недоступны.</p>
      </div>
    </div>
  `,
  styles: [`
    .offline-message {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      padding: 12px 20px;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      animation: slideDown 0.3s ease-out;
    }
    
    .offline-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .offline-icon {
      font-size: 20px;
    }
    
    p {
      margin: 0;
      font-size: 14px;
      text-align: center;
    }
    
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @media (max-width: 768px) {
      .offline-content {
        flex-direction: column;
        gap: 5px;
        text-align: center;
      }
      
      p {
        font-size: 12px;
      }
    }
  `]
})
export class OfflineMessageComponent implements OnInit, OnDestroy {
  isOffline$: Observable<boolean>;

  ngOnInit(): void {
    this.isOffline$ = merge(
      fromEvent(window, 'online').pipe(map(() => false)),
      fromEvent(window, 'offline').pipe(map(() => true)),
      of(!navigator.onLine)
    ).pipe(
      startWith(!navigator.onLine)
    );
  }

  ngOnDestroy(): void {}
}