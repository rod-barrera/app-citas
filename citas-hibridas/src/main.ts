import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CITAS_STORE } from './app/services/citas-store';
import { CitasStorePrefs } from './app/services/citas-store.prefs';
import { CitasStoreSQLite } from './app/services/citas-store.sqlite';

// (Opcional) registrar iconos para evitar warnings de Ionicons
import { addIcons } from 'ionicons';
import { add, settingsOutline, trashOutline, chevronBack } from 'ionicons/icons';
addIcons({ add, settingsOutline, trashOutline, chevronBack });

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    CitasStorePrefs,
    CitasStoreSQLite,

    {
      provide: CITAS_STORE,
      useFactory: () => {
        const platform = Capacitor.getPlatform();
        const prefs = inject(CitasStorePrefs);
        const sqlite = inject(CitasStoreSQLite);
        return platform === 'android' ? sqlite : prefs;
      }
    },
  ],
});