import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection, capSQLiteOptions } from '@capacitor-community/sqlite';

export interface Cita { id?: number; frase: string; autor: string; }

@Injectable({ providedIn: 'root' })
export class CitasDbService {
  private db: SQLiteDBConnection | null = null;
  private readonly dbName = 'citas_db';
  private initPromise: Promise<void> | null = null;

  private async ensureReady(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const opts: capSQLiteOptions = {
        database: this.dbName,
        readonly: false,          // usa solo propiedades válidas
      };

      const sqliteAny = CapacitorSQLite as any;
      const conn: SQLiteDBConnection = await sqliteAny.createConnection(opts);
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

    return this.initPromise;
  }

  async add(frase: string, autor: string): Promise<void> {
    await this.ensureReady();
    await this.db!.run('INSERT INTO citas (frase, autor) VALUES (?, ?)', [frase, autor]);

    if (Capacitor.getPlatform() === 'web') {
      await CapacitorSQLite.saveToStore({ database: this.dbName });
    }
  }

  async listAll(): Promise<Cita[]> {
    await this.ensureReady();
    const res = await this.db!.query('SELECT id, frase, autor FROM citas ORDER BY id DESC');
    return (res.values as Cita[]) ?? [];
  }

  async randomOne(): Promise<Cita | undefined> {
    const all = await this.listAll();
    return all.length ? all[Math.floor(Math.random() * all.length)] : undefined;
  }

  async remove(id: number): Promise<void> {
    await this.ensureReady();
    await this.db!.run('DELETE FROM citas WHERE id = ?', [id]);

    if (Capacitor.getPlatform() === 'web') {
      await CapacitorSQLite.saveToStore({ database: this.dbName });
    }
  }

  async clear(): Promise<void> {
  await this.ensureReady();
  await this.db!.execute('DELETE FROM citas;');

  // En web, persistimos el cambio en IndexedDB
  if (Capacitor.getPlatform() === 'web') {
    await CapacitorSQLite.saveToStore({ database: this.dbName });
  }
}
}