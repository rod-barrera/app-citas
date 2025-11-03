import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CitasStore } from './citas-store';
import { Cita } from './cita';
import { CapacitorSQLite } from '@capacitor-community/sqlite';

@Injectable({ providedIn: 'root' })
export class CitasStoreSQLite implements CitasStore {
  private db: any | null = null;
  private readonly dbName = 'citas_db';
  private initP: Promise<void> | null = null;

  private async ensureReady(): Promise<void> {
    if (this.initP) { await this.initP; return; }
    this.initP = (async () => {
      if (Capacitor.getPlatform() !== 'android') {
        // Este driver es solo para Android; en web no se invoca.
        return;
      }
      const sqliteAny: any = CapacitorSQLite as any;

      // Firma clásica del plugin (evita incompatibilidades de tipos)
      const conn = await sqliteAny.createConnection(
        this.dbName, false, 'no-encryption', 1, false
      );
      this.db = conn;

      await this.db.open();
      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS citas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          frase TEXT NOT NULL,
          autor TEXT NOT NULL
        );
      `);
    })();
    await this.initP;
  }

  async add(frase: string, autor: string): Promise<void> {
    await this.ensureReady();
    await this.db!.run('INSERT INTO citas (frase, autor) VALUES (?, ?)', [frase, autor]);
  }

  async listAll(): Promise<Cita[]> {
    await this.ensureReady();
    const res = await this.db!.query('SELECT id, frase, autor FROM citas ORDER BY id DESC');
    return (res.values as Cita[]) ?? [];
  }

  async randomOne(): Promise<Cita | undefined> {
    const all = await this.listAll();
    if (!all.length) return undefined;
    return all[Math.floor(Math.random() * all.length)];
  }

  async remove(id: number): Promise<void> {
    await this.ensureReady();
    await this.db!.run('DELETE FROM citas WHERE id = ?', [id]);
  }

  async clear(): Promise<void> {
    await this.ensureReady();
    await this.db!.execute('DELETE FROM citas');
  }
}