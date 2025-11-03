import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonItem, IonLabel, IonToggle
} from '@ionic/angular/standalone';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonBackButton,
    IonItem, IonLabel, IonToggle
  ],
})
export class ConfiguracionPage implements OnInit {
  borrarAlInicio = false;

  constructor(private settings: SettingsService) {}

  async ngOnInit() {
    this.borrarAlInicio = await this.settings.getBorrarAlInicio();
  }

  async onToggleChange(ev: CustomEvent) {
    const checked = (ev.detail as any).checked as boolean;
    this.borrarAlInicio = checked;
    await this.settings.setBorrarAlInicio(checked);
  }
}