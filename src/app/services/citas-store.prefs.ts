import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { CitasStore } from './citas-store';
import { Cita } from './cita';

const KEY = 'citas';

@Injectable({ providedIn: 'root' })
export class CitasStorePrefs implements CitasStore {

  private async getAll(): Promise<Cita[]> {
    const { value } = await Preferences.get({ key: KEY });
    if (!value) return [];
    try { return JSON.parse(value) as Cita[]; }
    catch { return []; }
  }

  private async saveAll(arr: Cita[]): Promise<void> {
    await Preferences.set({ key: KEY, value: JSON.stringify(arr) });
  }

  async add(frase: string, autor: string): Promise<void> {
    const all = await this.getAll();
    const nextId = all.length ? Math.max(...all.map(c => c.id)) + 1 : 1;
    all.unshift({ id: nextId, frase, autor });
    await this.saveAll(all);
  }

  async listAll(): Promise<Cita[]> {
    return this.getAll();
  }

  async randomOne(): Promise<Cita | undefined> {
    const all = await this.getAll();
    if (!all.length) return undefined;
    return all[Math.floor(Math.random() * all.length)];
  }

  async remove(id: number): Promise<void> {
    const all = await this.getAll();
    await this.saveAll(all.filter(c => c.id !== id));
  }

  async clear(): Promise<void> {
    await Preferences.remove({ key: KEY });
  }
}