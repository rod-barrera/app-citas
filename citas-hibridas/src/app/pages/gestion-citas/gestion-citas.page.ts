import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
  IonContent, IonItem, IonLabel, IonInput, IonButton,
  IonText
} from '@ionic/angular/standalone';

import { CitasService } from '../../services/citas.services';
import { Cita } from '../../services/cita';
import { QuoteCardComponent } from '../../components/quote-card/quote-card.component';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton,
    IonContent, IonItem, IonLabel, IonInput, IonButton, IonText,
    QuoteCardComponent,
  ],
})
export class GestionCitasPage {

  citas: Cita[] = [];

  form = this.fb.group({
    frase: ['', [Validators.required, Validators.minLength(5)]],
    autor: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(private fb: FormBuilder, private citasSrv: CitasService) {}

  async ionViewWillEnter() {
    await this.refrescar();
  }

  private async refrescar() {
    this.citas = await this.citasSrv.listar();
  }

  async agregar() {
    if (this.form.invalid) return;
    const { frase, autor } = this.form.value;
    await this.citasSrv.agregar(frase!, autor!);
    this.form.reset();
    await this.refrescar();
  }

  async eliminar(id?: number) {
    if (!id) return;
    await this.citasSrv.eliminar(id);
    await this.refrescar();
  }
}