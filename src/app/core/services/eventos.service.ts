import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Evento,
  CrearEventoDto,
  EstadoEvento,
  FiltroEventos
} from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = `${environment.apiUrl}/eventos`;

  // Colores por tipo de evento
  private coloresTipoEvento: { [key: string]: string } = {
    'boda': '#e91e63',
    'quinceanos': '#9c27b0',
    'cumpleanos': '#ff9800',
    'corporativo': '#2196f3',
    'social': '#4caf50',
    'graduacion': '#ff5722',
    'baby-shower': '#ffc107',
    'aniversario': '#795548',
    'otros': '#607d8b'
  };

  // Colores por estado
  private coloresEstado: { [key: string]: string } = {
    [EstadoEvento.COTIZACION]: '#ffc107',
    [EstadoEvento.CONFIRMADO]: '#4caf50',
    [EstadoEvento.EN_PROCESO]: '#2196f3',
    [EstadoEvento.COMPLETADO]: '#8bc34a',
    [EstadoEvento.CANCELADO]: '#f44336'
  };

  constructor(private http: HttpClient) {}

  // Métodos principales del servicio
  obtenerEventos(filtros?: FiltroEventos): Observable<Evento[]> {
    // Por ahora retornamos datos mock, después se conectará con la API
    return of(this.obtenerEventosMock());
  }

  obtenerEventoPorId(id: string): Observable<Evento> {
    const evento = this.obtenerEventosMock().find(e => e.id === id);
    return of(evento!);
  }

  crearEvento(evento: CrearEventoDto): Observable<Evento> {
    const nuevoEvento: Evento = {
      ...evento,
      id: this.generarId(),
      estado: EstadoEvento.COTIZACION,
      color: evento.color || this.obtenerColorPorTipo(evento.tipoEvento),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    return of(nuevoEvento);
  }

  actualizarEvento(id: string, evento: Partial<Evento>): Observable<Evento> {
    const eventoExistente = this.obtenerEventosMock().find(e => e.id === id);
    const eventoActualizado = {
      ...eventoExistente!,
      ...evento,
      fechaActualizacion: new Date()
    };

    return of(eventoActualizado);
  }

  eliminarEvento(id: string): Observable<void> {
    return of(void 0);
  }

  obtenerEventosPorMes(mes: number, anio: number): Observable<Evento[]> {
    const eventos = this.obtenerEventosMock().filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio);
      return fechaEvento.getMonth() === mes - 1 && fechaEvento.getFullYear() === anio;
    });

    return of(eventos);
  }

  obtenerEventosPorDia(fecha: Date): Observable<Evento[]> {
    const eventos = this.obtenerEventosMock().filter(evento => {
      const fechaEvento = new Date(evento.fechaInicio);
      return fechaEvento.toDateString() === fecha.toDateString();
    });

    return of(eventos);
  }

  // Métodos utilitarios
  obtenerColorPorTipo(tipoEvento: string): string {
    return this.coloresTipoEvento[tipoEvento] || this.coloresTipoEvento['otros'];
  }

  obtenerColorPorEstado(estado: EstadoEvento): string {
    return this.coloresEstado[estado];
  }

  obtenerTiposEvento(): string[] {
    return Object.keys(this.coloresTipoEvento);
  }

  private generarId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Datos mock para desarrollo - después se eliminará
  private obtenerEventosMock(): Evento[] {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    return [
      {
        id: '1',
        titulo: 'Boda María & Carlos',
        descripcion: 'Boda en jardín con 150 invitados',
        fechaInicio: new Date(anioActual, mesActual, 15),
        fechaFin: new Date(anioActual, mesActual, 15),
        horaInicio: '18:00',
        horaFin: '02:00',
        tipoEvento: 'boda',
        cliente: 'María González',
        estado: EstadoEvento.CONFIRMADO,
        color: '#e91e63',
        ubicacion: 'Jardín Villa Rosa',
        numeroInvitados: 150,
        presupuesto: 25000,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        id: '2',
        titulo: 'XV Años Sofía',
        descripcion: 'Fiesta de quinceaños temática',
        fechaInicio: new Date(anioActual, mesActual, 8),
        fechaFin: new Date(anioActual, mesActual, 8),
        horaInicio: '19:00',
        horaFin: '01:00',
        tipoEvento: 'quinceanos',
        cliente: 'Ana Rodríguez',
        estado: EstadoEvento.EN_PROCESO,
        color: '#9c27b0',
        ubicacion: 'Salón Imperial',
        numeroInvitados: 80,
        presupuesto: 15000,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        id: '3',
        titulo: 'Cumpleaños Corporativo',
        descripcion: 'Celebración aniversario empresa',
        fechaInicio: new Date(anioActual, mesActual, 22),
        fechaFin: new Date(anioActual, mesActual, 22),
        horaInicio: '12:00',
        horaFin: '16:00',
        tipoEvento: 'corporativo',
        cliente: 'Empresa Tech Solutions',
        estado: EstadoEvento.COTIZACION,
        color: '#2196f3',
        ubicacion: 'Hotel Plaza',
        numeroInvitados: 200,
        presupuesto: 30000,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        id: '4',
        titulo: 'Baby Shower',
        descripcion: 'Celebración para bebé en camino',
        fechaInicio: new Date(anioActual, mesActual, 5),
        fechaFin: new Date(anioActual, mesActual, 5),
        horaInicio: '15:00',
        horaFin: '18:00',
        tipoEvento: 'baby-shower',
        cliente: 'Laura Martínez',
        estado: EstadoEvento.COMPLETADO,
        color: '#ffc107',
        ubicacion: 'Casa particular',
        numeroInvitados: 25,
        presupuesto: 5000,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        id: '5',
        titulo: 'Graduación Universitaria',
        descripcion: 'Fiesta de graduación',
        fechaInicio: new Date(anioActual, mesActual, 28),
        fechaFin: new Date(anioActual, mesActual, 28),
        horaInicio: '20:00',
        horaFin: '03:00',
        tipoEvento: 'graduacion',
        cliente: 'Roberto Silva',
        estado: EstadoEvento.CONFIRMADO,
        color: '#ff5722',
        ubicacion: 'Club Social',
        numeroInvitados: 100,
        presupuesto: 18000,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
    ];
  }
}
