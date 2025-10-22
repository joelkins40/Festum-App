import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { 
  TipoEvento, 
  CrearTipoEventoDto, 
  ActualizarTipoEventoDto, 
  TipoEventoResponse, 
  TipoEventoFiltros 
} from '../models/tipo-evento.model';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  // URL de la API desde servicio de configuración
  private readonly API_URL: string;
  
  // Mock data para desarrollo - Tipos de eventos
  private mockTiposEvento: TipoEvento[] = [
    { id: 1, descripcion: 'Boda', fechaCreacion: new Date('2024-01-15'), activo: true },
    { id: 2, descripcion: 'Quinceaños', fechaCreacion: new Date('2024-01-16'), activo: true },
    { id: 3, descripcion: 'Graduación', fechaCreacion: new Date('2024-01-17'), activo: true },
    { id: 4, descripcion: 'Baby Shower', fechaCreacion: new Date('2024-01-18'), activo: true },
    { id: 5, descripcion: 'Bautizo', fechaCreacion: new Date('2024-01-19'), activo: true },
    { id: 6, descripcion: 'Primera Comunión', fechaCreacion: new Date('2024-01-20'), activo: true },
    { id: 7, descripcion: 'Aniversario', fechaCreacion: new Date('2024-01-21'), activo: true },
    { id: 8, descripcion: 'Cumpleaños Infantil', fechaCreacion: new Date('2024-01-22'), activo: true },
    { id: 9, descripcion: 'Evento Corporativo', fechaCreacion: new Date('2024-01-23'), activo: true },
    { id: 10, descripcion: 'Conferencia', fechaCreacion: new Date('2024-01-24'), activo: true },
    { id: 11, descripcion: 'Despedida de Soltero/a', fechaCreacion: new Date('2024-01-25'), activo: true },
    { id: 12, descripcion: 'Reunión Familiar', fechaCreacion: new Date('2024-01-26'), activo: true }
  ];
  
  // Subject para mantener la lista actualizada en tiempo real
  private tiposEventoSubject = new BehaviorSubject<TipoEvento[]>(this.mockTiposEvento);
  public tiposEvento$ = this.tiposEventoSubject.asObservable();
  
  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // Inicializar URL de la API
    this.API_URL = this.configService.getApiUrl('tiposEvento');
  }

  /**
   * 📋 Obtener todas las categorías
   */
  getTiposEvento(filtros?: TipoEventoFiltros): Observable<TipoEventoResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real (descomenta cuando tengas el backend):
    /*
    let params = new HttpParams();
    if (filtros) {
      if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
      if (filtros.activo !== undefined) params = params.set('activo', filtros.activo.toString());
      if (filtros.ordenarPor) params = params.set('ordenarPor', filtros.ordenarPor);
      if (filtros.direccion) params = params.set('direccion', filtros.direccion);
      if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
      if (filtros.limite) params = params.set('limite', filtros.limite.toString());
    }
    
    return this.http.get<CategoriaResponse>(`${this.API_URL}`, { params })
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success && response.data) {
            this.TipoEventoSubject.next(response.data as Categoria[]);
          }
        })
      );
    */
    
    // 🎭 Mock implementation (remover cuando tengas API real)
    let tiposEventoFiltrados = [...this.mockTiposEvento];
    
    if (filtros?.busqueda) {
      tiposEventoFiltrados = tiposEventoFiltrados.filter(tipoEvento => 
        tipoEvento.descripcion.toLowerCase().includes(filtros.busqueda!.toLowerCase())
      );
    }
    
    if (filtros?.activo !== undefined) {
      tiposEventoFiltrados = tiposEventoFiltrados.filter(tipoEvento => tipoEvento.activo === filtros.activo);
    }
    
    // Ordenamiento
    if (filtros?.ordenarPor) {
      tiposEventoFiltrados.sort((a, b) => {
        const aValue = a[filtros.ordenarPor as keyof TipoEvento];
        const bValue = b[filtros.ordenarPor as keyof TipoEvento];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return filtros.direccion === 'desc' ? -result : result;
      });
    }
    
    return of({
      success: true,
      message: 'Tipos de evento obtenidos exitosamente',
      data: tiposEventoFiltrados,
      totalRecords: tiposEventoFiltrados.length
    }).pipe(
      delay(500), // Simular latencia de red
      map(response => {
        this.loadingSubject.next(false);
        this.tiposEventoSubject.next(tiposEventoFiltrados);
        return response;
      })
    );
  }

  /**
   * ➕ Agregar nueva categoría
   */
  crearTipoEvento(tipoEvento: CrearTipoEventoDto): Observable<TipoEventoResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.post<CategoriaResponse>(`${this.API_URL}`, categoria)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getTipoEvento().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const nuevoTipoEvento: TipoEvento = {
      id: Math.max(...this.mockTiposEvento.map(t => t.id)) + 1,
      descripcion: tipoEvento.descripcion,
      fechaCreacion: new Date(),
      activo: true
    };
    
    this.mockTiposEvento.push(nuevoTipoEvento);
    this.tiposEventoSubject.next([...this.mockTiposEvento]);
    
    return of({
      success: true,
      message: 'Tipo de evento creado exitosamente',
      data: nuevoTipoEvento
    }).pipe(
      delay(300),
      map(response => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  /**
   * ✏️ Actualizar categoría
   */
  actualizarTipoEvento(tipoEvento: ActualizarTipoEventoDto): Observable<TipoEventoResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.put<CategoriaResponse>(`${this.API_URL}/${categoria.id}`, categoria)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getTipoEvento().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const index = this.mockTiposEvento.findIndex(t => t.id === tipoEvento.id);
    if (index !== -1) {
      this.mockTiposEvento[index] = {
        ...this.mockTiposEvento[index],
        descripcion: tipoEvento.descripcion,
        fechaActualizacion: new Date()
      };
      this.tiposEventoSubject.next([...this.mockTiposEvento]);
    }
    
    return of({
      success: index !== -1,
      message: index !== -1 ? 'Tipo de evento actualizado exitosamente' : 'Tipo de evento no encontrado',
      data: index !== -1 ? this.mockTiposEvento[index] : undefined
    }).pipe(
      delay(300),
      map(response => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  /**
   * 🗑️ Eliminar categoría
   */
  eliminarTipoEvento(id: number): Observable<TipoEventoResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.delete<CategoriaResponse>(`${this.API_URL}/${id}`)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getTipoEvento().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const index = this.mockTiposEvento.findIndex(t => t.id === id);
    if (index !== -1) {
      this.mockTiposEvento.splice(index, 1);
      this.tiposEventoSubject.next([...this.mockTiposEvento]);
    }
    
    return of({
      success: index !== -1,
      message: index !== -1 ? 'Tipo de evento eliminado exitosamente' : 'Tipo de evento no encontrado'
    }).pipe(
      delay(300),
      map(response => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  /**
   * 📥 Importar categorías desde CSV
   */
  importarDesdeCSV(archivo: File): Observable<TipoEventoResponse> {
    this.loadingSubject.next(true);
    
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const nuevasTipoEvento: TipoEvento[] = [];
          
          // Saltar header (primera línea)
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const columns = line.split(',');
              if (columns.length >= 1) {
                const descripcion = columns[0].replace(/"/g, '').trim();
                if (descripcion) {
                  const nuevaTipoEvento: TipoEvento = {
                    id: Math.max(...this.mockTiposEvento.map(te => te.id), 0) + i,
                    descripcion,
                    fechaCreacion: new Date(),
                    activo: true
                  };
                  nuevasTipoEvento.push(nuevaTipoEvento);
                }
              }
            }
          }
          
          // Agregar a la lista existente
          this.mockTiposEvento.push(...nuevasTipoEvento);
          this.tiposEventoSubject.next([...this.mockTiposEvento]);
          
          setTimeout(() => {
            this.loadingSubject.next(false);
            observer.next({
              success: true,
              message: `${nuevasTipoEvento.length} tipos de evento importados exitosamente`,
              data: nuevasTipoEvento
            });
            observer.complete();
          }, 1000);
          
        } catch (error) {
          this.loadingSubject.next(false);
          observer.next({
            success: false,
            message: 'Error al procesar el archivo CSV'
          });
          observer.complete();
        }
      };
      
      reader.readAsText(archivo);
    });
  }

  /**
   * 📤 Exportar tipos de evento a CSV
   */
  exportarACSV(): Observable<Blob> {
    const csvContent = this.convertirACSV(this.mockTiposEvento);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return of(blob);
  }

  /**
   * 🔄 Convertir datos a formato CSV
   */
  private convertirACSV(tiposEvento: TipoEvento[]): string {
    const header = 'ID,Descripcion,Fecha Creacion,Activo\n';
    const rows = tiposEvento.map(te => 
      `${te.id},"${te.descripcion}","${te.fechaCreacion?.toLocaleDateString() || ''}","${te.activo ? 'Si' : 'No'}"`
    ).join('\n');
    return header + rows;
  }

  /**
   * 🔍 Obtener tipo de evento por ID
   */
  obtenerTipoEventoPorId(id: number): Observable<TipoEventoResponse> {
    // 🔗 API real: return this.http.get<TipoEventoResponse>(`${this.API_URL}/${id}`);
    
    const tipoEvento = this.mockTiposEvento.find(te => te.id === id);
    return of({
      success: !!tipoEvento,
      message: tipoEvento ? 'Tipo de evento encontrado' : 'Tipo de evento no encontrado',
      data: tipoEvento
    });
  }
}