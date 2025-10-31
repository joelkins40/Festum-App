import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Models y Services
import { Evento, EstadoEvento, EventoCalendario } from '../../../core/models/evento.model';
import { EventosService } from '../../../core/services/eventos.service';

interface DiaCalendario {
  fecha: Date;
  esMesActual: boolean;
  esHoy: boolean;
  eventos: Evento[];
  numeroEventos: number;
}

interface MesAnio {
  mes: number;
  anio: number;
  nombre: string;
  numeroEventos?: number;
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {
  // Propiedades del calendario
  fechaActual = new Date();
  mesActual = this.fechaActual.getMonth();
  anioActual = this.fechaActual.getFullYear();
  diaHoy = this.fechaActual.getDate();

  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Datos del calendario
  diasCalendario: DiaCalendario[] = [];
  eventosDelMes: Evento[] = [];
  eventoSeleccionado: Evento | null = null;
  cargando = false;

  // Filtros
  tipoEventoSeleccionado: string = '';
  estadoSeleccionado: EstadoEvento | '' = '';
  tiposEvento: string[] = [];
  estadosEvento = Object.values(EstadoEvento);

  // Vista
  vistaActual: 'mes' | 'anio' = 'mes';
  mesesDelAnio: MesAnio[] = [];

  constructor(
    private eventosService: EventosService,
    private snackBar: MatSnackBar
  ) {
    this.tiposEvento = this.eventosService.obtenerTiposEvento();
    this.inicializarMesesDelAnio();
  }

  ngOnInit(): void {
    this.cargarEventosDelMes();
    this.generarCalendario();
  }

  // Navegación del calendario
  mesAnterior(): void {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }
    this.cargarEventosDelMes();
    this.generarCalendario();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.cargarEventosDelMes();
    this.generarCalendario();
  }

  irAHoy(): void {
    const hoy = new Date();
    this.mesActual = hoy.getMonth();
    this.anioActual = hoy.getFullYear();
    this.cargarEventosDelMes();
    this.generarCalendario();
  }

  cambiarVista(vista: 'mes' | 'anio'): void {
    this.vistaActual = vista;
    if (vista === 'anio') {
      this.cargarEventosDelAnio();
    }
  }

  seleccionarMes(mes: number): void {
    this.mesActual = mes;
    this.vistaActual = 'mes';
    this.cargarEventosDelMes();
    this.generarCalendario();
  }

  // Carga de datos
  cargarEventosDelMes(): void {
    this.cargando = true;
    this.eventosService.obtenerEventosPorMes(this.mesActual + 1, this.anioActual)
      .subscribe({
        next: (eventos) => {
          this.eventosDelMes = this.filtrarEventos(eventos);
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar eventos:', error);
          this.snackBar.open('Error al cargar eventos', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
  }

  cargarEventosDelAnio(): void {
    this.cargando = true;
    // Simulamos la carga de eventos del año
    this.eventosService.obtenerEventos({ anio: this.anioActual })
      .subscribe({
        next: (eventos) => {
          this.calcularEventosPorMes(eventos);
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar eventos del año:', error);
          this.cargando = false;
        }
      });
  }

  // Generación del calendario
  generarCalendario(): void {
    this.diasCalendario = [];

    const primerDiaMes = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDiaMes = new Date(this.anioActual, this.mesActual + 1, 0);
    const primerDiaSemana = primerDiaMes.getDay();

    // Días del mes anterior
    const ultimoDiaMesAnterior = new Date(this.anioActual, this.mesActual, 0);
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const fecha = new Date(this.anioActual, this.mesActual - 1, ultimoDiaMesAnterior.getDate() - i);
      this.diasCalendario.push({
        fecha,
        esMesActual: false,
        esHoy: this.esMismodia(fecha, new Date()),
        eventos: this.obtenerEventosDelDia(fecha),
        numeroEventos: 0
      });
    }

    // Días del mes actual
    for (let dia = 1; dia <= ultimoDiaMes.getDate(); dia++) {
      const fecha = new Date(this.anioActual, this.mesActual, dia);
      const eventosDelDia = this.obtenerEventosDelDia(fecha);
      this.diasCalendario.push({
        fecha,
        esMesActual: true,
        esHoy: this.esMismodia(fecha, new Date()),
        eventos: eventosDelDia,
        numeroEventos: eventosDelDia.length
      });
    }

    // Días del mes siguiente
    const diasRestantes = 42 - this.diasCalendario.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual + 1, dia);
      this.diasCalendario.push({
        fecha,
        esMesActual: false,
        esHoy: this.esMismodia(fecha, new Date()),
        eventos: this.obtenerEventosDelDia(fecha),
        numeroEventos: 0
      });
    }
  }

  private inicializarMesesDelAnio(): void {
    this.mesesDelAnio = this.nombresMeses.map((nombre, index) => ({
      mes: index,
      anio: this.anioActual,
      nombre
    }));
  }

  private calcularEventosPorMes(eventos: Evento[]): void {
    this.mesesDelAnio.forEach(mes => {
      const eventosDelMes = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fechaInicio);
        return fechaEvento.getMonth() === mes.mes && fechaEvento.getFullYear() === mes.anio;
      });
      mes.numeroEventos = eventosDelMes.length;
    });
  }

  // Utilidades
  private esMismodia(fecha1: Date, fecha2: Date): boolean {
    return fecha1.toDateString() === fecha2.toDateString();
  }

  private obtenerEventosDelDia(fecha: Date): Evento[] {
    return this.eventosDelMes.filter(evento => {
      const fechaInicio = new Date(evento.fechaInicio);
      const fechaFin = new Date(evento.fechaFin);
      return fecha >= fechaInicio && fecha <= fechaFin;
    });
  }

  private filtrarEventos(eventos: Evento[]): Evento[] {
    return eventos.filter(evento => {
      let cumpleFiltros = true;

      if (this.tipoEventoSeleccionado && evento.tipoEvento !== this.tipoEventoSeleccionado) {
        cumpleFiltros = false;
      }

      if (this.estadoSeleccionado && evento.estado !== this.estadoSeleccionado) {
        cumpleFiltros = false;
      }

      return cumpleFiltros;
    });
  }

  // Manejo de eventos
  seleccionarEvento(evento: Evento, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.eventoSeleccionado = evento;
  }

  aplicarFiltros(): void {
    this.cargarEventosDelMes();
    this.generarCalendario();
  }

  limpiarFiltros(): void {
    this.tipoEventoSeleccionado = '';
    this.estadoSeleccionado = '';
    this.aplicarFiltros();
  }

  // Getters para el template
  get nombreMesActual(): string {
    return this.nombresMeses[this.mesActual];
  }

  get totalEventosDelMes(): number {
    return this.eventosDelMes.length;
  }

  obtenerColorEstado(estado: EstadoEvento): string {
    return this.eventosService.obtenerColorPorEstado(estado);
  }

  obtenerColorTipo(tipo: string): string {
    return this.eventosService.obtenerColorPorTipo(tipo);
  }

  formatearHora(hora: string): string {
    return hora.substring(0, 5);
  }

  obtenerNombreEstado(estado: EstadoEvento): string {
    const nombres = {
      [EstadoEvento.COTIZACION]: 'Cotización',
      [EstadoEvento.CONFIRMADO]: 'Confirmado',
      [EstadoEvento.EN_PROCESO]: 'En Proceso',
      [EstadoEvento.COMPLETADO]: 'Completado',
      [EstadoEvento.CANCELADO]: 'Cancelado'
    };
    return nombres[estado];
  }

  obtenerNombreTipo(tipo: string): string {
    const nombres: { [key: string]: string } = {
      'boda': 'Boda',
      'quinceanos': 'XV Años',
      'cumpleanos': 'Cumpleaños',
      'corporativo': 'Corporativo',
      'social': 'Social',
      'graduacion': 'Graduación',
      'baby-shower': 'Baby Shower',
      'aniversario': 'Aniversario',
      'otros': 'Otros'
    };
    return nombres[tipo] || tipo;
  }
}
