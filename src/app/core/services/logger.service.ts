import { Injectable, isDevMode } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private enabled = isDevMode(); // true en dev, false en prod

  log(...msg: any[]) {
    if (this.enabled) console.log(...msg);
  }

  info(...msg: any[]) {
    if (this.enabled) console.info(...msg);
  }

  warn(...msg: any[]) {
    if (this.enabled) console.warn(...msg);
  }

  error(...msg: any[]) {
    // normalmente sí quieres ver errores también en prod,
    // pero si quieres ocultarlos, mueve el if dentro.
    console.error(...msg);
  }
}
