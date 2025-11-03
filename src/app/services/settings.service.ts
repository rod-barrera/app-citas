import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
const KEY_BORRAR_AL_INICIO = 'borrar_al_inicio';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  async setBorrarAlInicio(value: boolean): Promise<void> {
    await Preferences.set({ key: KEY_BORRAR_AL_INICIO, value: String(value) });
  }

  async getBorrarAlInicio(): Promise<boolean> {
    const { value } = await Preferences.get({ key: KEY_BORRAR_AL_INICIO });
    return value === 'true';
  }
}
