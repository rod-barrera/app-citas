import { InjectionToken } from '@angular/core';
import { Cita } from './cita';

export interface CitasStore {
  add(frase: string, autor: string): Promise<void>;
  listAll(): Promise<Cita[]>;
  randomOne(): Promise<Cita | undefined>;
  remove(id: number): Promise<void>;
  clear(): Promise<void>;
}

export const CITAS_STORE = new InjectionToken<CitasStore>('CITAS_STORE');