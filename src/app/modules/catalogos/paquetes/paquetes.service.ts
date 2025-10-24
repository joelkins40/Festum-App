import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Paquete, PaquetesResponse } from './paquetes.model';

@Injectable({
  providedIn: 'root'
})
export class PaquetesService {

  private mockPaquetes: Paquete[] = [
    {
      id: 1,
      tipo: 'Paquete',
      nombre: 'Paquete Boda Clásico',
      descripcionCorta: 'Incluye mantelería, sillas chiavari y centro de mesa',
      muebles: [
        { id: 5, nombre: 'Silla Chiavari', cantidad: 100 },
        { id: 1, nombre: 'Mantel Rectangular Blanco', cantidad: 12 },
        { id: 10, nombre: 'Centro de Mesa Floral', cantidad: 12 }
      ],
      precioTotal: 48000,
      categoria: 'Boda',
      disponibilidad: 3,
      imagen: 'assets/images/paquete-boda.jpg',
      fechaCreacion: new Date(),
      activo: true
    },
    {
      id: 2,
      tipo: 'Servicio',
      nombre: 'Servicio Lounge Corporativo',
      descripcionCorta: 'Mobiliario lounge para eventos corporativos',
      muebles: [
        { id: 20, nombre: 'Sofa Modular', cantidad: 4 },
        { id: 21, nombre: 'Mesa Baja', cantidad: 4 }
      ],
      precioTotal: 25000,
      categoria: 'Corporativo',
      disponibilidad: 5,
      imagen: 'assets/images/paquete-lounge.jpg',
      fechaCreacion: new Date(),
      activo: true
    },
    {
      id: 3,
      tipo: 'Paquete',
      nombre: 'Paquete Fiesta Lounge',
      descripcionCorta: 'Combo pequeño para lounges y after parties',
      muebles: [
        { id: 5, nombre: 'Silla Chiavari', cantidad: 20 },
        { id: 22, nombre: 'Puff Redondo', cantidad: 10 }
      ],
      precioTotal: 15000,
      categoria: 'Lounge',
      disponibilidad: 8,
      imagen: 'assets/images/paquete-fiesta.jpg',
      fechaCreacion: new Date(),
      activo: true
    }
  ];

  private paquetesSubject = new BehaviorSubject<Paquete[]>(this.mockPaquetes);
  public paquetes$ = this.paquetesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor() {}

  getPaquetes(): Observable<PaquetesResponse> {
    this.loadingSubject.next(true);

    return of({ success: true, message: 'Paquetes cargados', data: [...this.mockPaquetes] }).pipe(
      delay(400),
      map(response => {
        this.loadingSubject.next(false);
        if (response.success && response.data) {
          this.paquetesSubject.next(response.data);
        }
        return response;
      })
    );
  }
}
