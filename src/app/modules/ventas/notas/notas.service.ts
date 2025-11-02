import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Nota, CrearNotaDto, ActualizarNotaDto, EstadisticasNotas, Cliente, Evento, EstadoNota, TipoNota } from './notas.models';

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  private notasSubject = new BehaviorSubject<Nota[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public notas$ = this.notasSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  // Mock data - Clientes
  private mockClientes: Cliente[] = [
    {
      id: 1,
      nombre: 'Juan Pérez García',
      informacionDeContacto: { telefono: '555-0101', email: 'juan.perez@email.com' },
      clientePreferente: true,
      activo: true
    },
    {
      id: 2,
      nombre: 'María López Hernández',
      informacionDeContacto: { telefono: '555-0102', email: 'maria.lopez@email.com' },
      clientePreferente: false,
      activo: true
    },
    {
      id: 3,
      nombre: 'Carlos Rodríguez Martínez',
      informacionDeContacto: { telefono: '555-0103', email: 'carlos.rodriguez@email.com' },
      clientePreferente: true,
      activo: true
    }
  ];

  // Mock data - Eventos
  private mockEventos: Evento[] = [
    { id: 1, nombre: 'Boda García-López', fecha: new Date('2025-12-15'), lugar: 'Salón Los Pinos' },
    { id: 2, nombre: 'XV Años Ana María', fecha: new Date('2025-11-20'), lugar: 'Jardín Las Rosas' },
    { id: 3, nombre: 'Bautizo Sofía', fecha: new Date('2025-11-10'), lugar: 'Salón San Miguel' },
    { id: 4, nombre: 'Graduación Empresarial', fecha: new Date('2025-12-01'), lugar: 'Hotel Plaza' },
    { id: 5, nombre: 'Aniversario 50 Años', fecha: new Date('2025-11-25'), lugar: 'Hacienda El Encanto' }
  ];

  // Mock data - Notas
  private mockNotas: Nota[] = [
    {
      id: 1,
      tipo: 'Paquete',
      folio: 'NT-2025-001',
      cliente: this.mockClientes[0],
      evento: this.mockEventos[0],
      fecha: new Date('2025-11-01'),
      total: 45000,
      estado: 'Pagada',
      descripcion: 'Paquete completo para boda'
    },
    {
      id: 2,
      tipo: 'Servicio',
      folio: 'NT-2025-002',
      cliente: this.mockClientes[1],
      evento: this.mockEventos[1],
      fecha: new Date('2025-11-02'),
      total: 28000,
      estado: 'Pendiente',
      descripcion: 'Servicios de decoración y catering'
    },
    {
      id: 3,
      tipo: 'Paquete',
      folio: 'NT-2025-003',
      cliente: this.mockClientes[2],
      evento: this.mockEventos[2],
      fecha: new Date('2025-11-03'),
      total: 15000,
      estado: 'Parcial',
      descripcion: 'Paquete básico para bautizo'
    },
    {
      id: 4,
      tipo: 'Servicio',
      folio: 'NT-2025-004',
      cliente: this.mockClientes[0],
      evento: this.mockEventos[3],
      fecha: new Date('2025-11-05'),
      total: 52000,
      estado: 'Pagada',
      descripcion: 'Servicios completos para evento empresarial'
    },
    {
      id: 5,
      tipo: 'Paquete',
      folio: 'NT-2025-005',
      cliente: this.mockClientes[1],
      evento: this.mockEventos[4],
      fecha: new Date('2025-11-06'),
      total: 38000,
      estado: 'Pendiente',
      descripcion: 'Paquete premium para aniversario'
    }
  ];

  private nextId = 6;

  constructor() {
    this.notasSubject.next(this.mockNotas);
  }

  // Obtener todas las notas
  getNotas(): Observable<Nota[]> {
    this.loadingSubject.next(true);
    return of(this.mockNotas).pipe(
      delay(500),
      map(notas => {
        this.loadingSubject.next(false);
        this.notasSubject.next(notas);
        return notas;
      })
    );
  }

  // Obtener nota por ID
  getNotaById(id: number): Observable<Nota | undefined> {
    return of(this.mockNotas.find(nota => nota.id === id)).pipe(delay(300));
  }

  // Crear nueva nota
  crearNota(dto: CrearNotaDto): Observable<{ success: boolean; message: string; data?: Nota }> {
    this.loadingSubject.next(true);

    const cliente = this.mockClientes.find(c => c.id === dto.clienteId);
    const evento = this.mockEventos.find(e => e.id === dto.eventoId);

    if (!cliente || !evento) {
      return of({
        success: false,
        message: 'Cliente o evento no encontrado'
      }).pipe(delay(300));
    }

    const nuevaNota: Nota = {
      id: this.nextId++,
      tipo: dto.tipo,
      folio: `NT-2025-${String(this.nextId - 1).padStart(3, '0')}`,
      cliente: cliente,
      evento: evento,
      fecha: dto.fecha,
      total: dto.total,
      estado: dto.estado,
      descripcion: dto.descripcion,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    };

    this.mockNotas.unshift(nuevaNota);
    this.notasSubject.next(this.mockNotas);
    this.loadingSubject.next(false);

    return of({
      success: true,
      message: 'Nota creada exitosamente',
      data: nuevaNota
    }).pipe(delay(500));
  }

  // Actualizar nota existente
  actualizarNota(dto: ActualizarNotaDto): Observable<{ success: boolean; message: string; data?: Nota }> {
    this.loadingSubject.next(true);

    const index = this.mockNotas.findIndex(n => n.id === dto.id);
    if (index === -1) {
      return of({
        success: false,
        message: 'Nota no encontrada'
      }).pipe(delay(300));
    }

    const notaActual = this.mockNotas[index];

    // Actualizar campos si se proporcionan
    if (dto.tipo) notaActual.tipo = dto.tipo;
    if (dto.total !== undefined) notaActual.total = dto.total;
    if (dto.estado) notaActual.estado = dto.estado;
    if (dto.fecha) notaActual.fecha = dto.fecha;
    if (dto.descripcion !== undefined) notaActual.descripcion = dto.descripcion;

    if (dto.clienteId) {
      const cliente = this.mockClientes.find(c => c.id === dto.clienteId);
      if (cliente) notaActual.cliente = cliente;
    }

    if (dto.eventoId) {
      const evento = this.mockEventos.find(e => e.id === dto.eventoId);
      if (evento) notaActual.evento = evento;
    }

    notaActual.fechaActualizacion = new Date();
    this.mockNotas[index] = notaActual;
    this.notasSubject.next(this.mockNotas);
    this.loadingSubject.next(false);

    return of({
      success: true,
      message: 'Nota actualizada exitosamente',
      data: notaActual
    }).pipe(delay(500));
  }

  // Eliminar nota
  eliminarNota(id: number): Observable<{ success: boolean; message: string }> {
    this.loadingSubject.next(true);

    const index = this.mockNotas.findIndex(n => n.id === id);
    if (index === -1) {
      return of({
        success: false,
        message: 'Nota no encontrada'
      }).pipe(delay(300));
    }

    this.mockNotas.splice(index, 1);
    this.notasSubject.next(this.mockNotas);
    this.loadingSubject.next(false);

    return of({
      success: true,
      message: 'Nota eliminada exitosamente'
    }).pipe(delay(500));
  }

  // Calcular estadísticas del mes actual
  getEstadisticas(): Observable<EstadisticasNotas> {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    // Filtrar notas del mes actual
    const notasMes = this.mockNotas.filter(nota => {
      const fechaNota = new Date(nota.fecha);
      return fechaNota.getMonth() === mesActual &&
             fechaNota.getFullYear() === anioActual;
    });

    const totalVentasMes = notasMes.length;
    const totalIngresos = notasMes.reduce((sum, nota) => {
      // Solo contar notas pagadas o parciales
      if (nota.estado === 'Pagada' || nota.estado === 'Parcial') {
        return sum + nota.total;
      }
      return sum;
    }, 0);

    const promedioVenta = totalVentasMes > 0 ? totalIngresos / totalVentasMes : 0;

    return of({
      totalVentasMes,
      totalIngresos,
      promedioVenta,
      cantidadNotas: this.mockNotas.length
    }).pipe(delay(300));
  }

  // Obtener lista de clientes para el selector
  getClientes(): Observable<Cliente[]> {
    return of(this.mockClientes).pipe(delay(200));
  }

  // Obtener lista de eventos para el selector
  getEventos(): Observable<Evento[]> {
    return of(this.mockEventos).pipe(delay(200));
  }

  // Exportar notas a CSV
  exportarACSV(): Observable<Blob> {
    const headers = ['ID', 'Tipo', 'Folio', 'Cliente', 'Evento', 'Fecha', 'Total', 'Estado', 'Descripción'];
    const rows = this.mockNotas.map(nota => [
      nota.id.toString(),
      nota.tipo,
      nota.folio,
      nota.cliente.nombre,
      nota.evento.nombre,
      new Date(nota.fecha).toLocaleDateString('es-MX'),
      nota.total.toString(),
      nota.estado,
      nota.descripcion || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return of(blob).pipe(delay(300));
  }

  // Importar notas desde CSV
  importarDesdeCSV(file: File): Observable<{ success: boolean; message: string }> {
    return new Observable<{ success: boolean; message: string }>(observer => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');

          // Saltar la primera línea (headers)
          const dataLines = lines.slice(1).filter((line: string) => line.trim());
          let importedCount = 0;

          dataLines.forEach((line: string) => {
            const values = line.split(',').map((v: string) => v.replace(/^"|"$/g, '').trim());

            if (values.length >= 8) {
              const tipo = values[1] as TipoNota;
              const clienteId = parseInt(values[3]) || 1;
              const eventoId = parseInt(values[4]) || 1;
              const total = parseFloat(values[6]) || 0;
              const estado = values[7] as EstadoNota;

              const cliente = this.mockClientes.find(c => c.id === clienteId) || this.mockClientes[0];
              const evento = this.mockEventos.find(e => e.id === eventoId) || this.mockEventos[0];

              const nuevaNota: Nota = {
                id: this.nextId++,
                tipo,
                folio: `NT-2025-${String(this.nextId - 1).padStart(3, '0')}`,
                cliente,
                evento,
                fecha: new Date(),
                total,
                estado,
                descripcion: values[8] || ''
              };

              this.mockNotas.unshift(nuevaNota);
              importedCount++;
            }
          });

          this.notasSubject.next(this.mockNotas);

          observer.next({
            success: true,
            message: `${importedCount} notas importadas exitosamente`
          });
          observer.complete();
        } catch (error) {
          observer.next({
            success: false,
            message: 'Error al procesar el archivo CSV'
          });
          observer.complete();
        }
      };

      reader.onerror = () => {
        observer.next({
          success: false,
          message: 'Error al leer el archivo'
        });
        observer.complete();
      };

      reader.readAsText(file);
    }).pipe(
      tap(r => console.log('Resultado CSV:', r.message)),
      delay(500)
    );
  }
}
