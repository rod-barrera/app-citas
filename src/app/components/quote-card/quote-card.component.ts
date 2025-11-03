import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonButtons, IonButton, IonIcon
} from '@ionic/angular/standalone';

export type Cita = { id?: number; frase: string; autor: string };

@Component({
  selector: 'app-quote-card',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonButtons, IonButton, IonIcon],
  template: `
    <ion-card class="quote">
      <ion-card-content>
        <p class="frase">“{{ cita.frase }}”</p>
        <div class="footer">
          <span class="autor">{{ cita.autor }}</span>

          <ion-buttons *ngIf="showDelete" slot="end">
            <ion-button fill="clear" color="danger" (click)="onDelete()">
              <ion-icon name="trash-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </div>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .quote { margin: 12px 8px; }
    .frase { font-size: 1.05rem; font-style: italic; opacity: .9; }
    .footer { display:flex; align-items:center; justify-content:space-between; }
    .autor { font-weight: 600; opacity:.85; }
  `]
})
export class QuoteCardComponent {
  @Input() cita!: Cita;
  @Input() showDelete = false;
  @Output() delete = new EventEmitter<void>();
  onDelete() { this.delete.emit(); }
}