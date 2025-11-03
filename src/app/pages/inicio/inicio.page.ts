import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonCard, IonCardContent, IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { CitasService } from '../../services/citas.services';
import { QuoteCardComponent } from '../../components/quote-card/quote-card.component';
import { Cita } from '../../services/cita';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  imports: [
    CommonModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonCard, IonCardContent, IonFab, IonFabButton,
    QuoteCardComponent
  ],
})
export class InicioPage {
  cita?: Cita;

  constructor(private citasSrv: CitasService) {}

  async ionViewWillEnter() {
    await this.citasSrv.ensureExamplesAlways();

    this.cita = await this.citasSrv.aleatoria();
  }
}