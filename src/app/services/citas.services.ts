import { Inject, Injectable } from '@angular/core';
import { CITAS_STORE, CitasStore } from './citas-store';
import { Cita } from './cita';

@Injectable({ providedIn: 'root' })
export class CitasService {
  constructor(@Inject(CITAS_STORE) private store: CitasStore) {}

  // ----- API básica -----
  agregar(frase: string, autor: string): Promise<void> {
    return this.store.add(frase, autor);
  }

  listar(): Promise<Cita[]> {
    return this.store.listAll();
  }

  aleatoria(): Promise<Cita | undefined> {
    return this.store.randomOne();
  }

  eliminar(id: number): Promise<void> {
    return this.store.remove(id);
  }

  limpiar(): Promise<void> {
    return this.store.clear();
  }

  private readonly EJEMPLOS: ReadonlyArray<Pick<Cita, 'frase' | 'autor'>> = [
    { frase: 'La disciplina tarde o temprano vencerá a la inteligencia.', autor: 'Anónimo' },
    { frase: 'Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto, sino un hábito.', autor: 'Aristóteles' },
    { frase: 'El éxito es la suma de pequeños esfuerzos repetidos día tras día.', autor: 'Robert Collier' },
  ];

  async ensureExamplesAlways(): Promise<void> {
    const existentes = await this.listar();
    const tiene = (f: string, a: string) =>
      existentes.some(c => c.frase === f && c.autor === a);

    for (const ej of this.EJEMPLOS) {
      if (!tiene(ej.frase, ej.autor)) {
        await this.agregar(ej.frase, ej.autor);
      }
    }
  }
}