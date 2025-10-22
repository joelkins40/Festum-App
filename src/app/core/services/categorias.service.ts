import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { 
  Categoria, 
  CrearCategoriaDto, 
  ActualizarCategoriaDto, 
  CategoriaResponse, 
  CategoriaFiltros 
} from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  // URL de la API desde servicio de configuración
  private readonly API_URL: string;
  
  // Mock data para desarrollo - Categorías de productos y servicios para eventos
  private mockCategorias: Categoria[] = [
    { id: 1, descripcion: 'Manteles', fechaCreacion: new Date('2024-01-15'), activo: true },
    { id: 2, descripcion: 'Mesas', fechaCreacion: new Date('2024-01-16'), activo: true },
    { id: 3, descripcion: 'Sillas', fechaCreacion: new Date('2024-01-17'), activo: true },
    { id: 4, descripcion: 'Planos', fechaCreacion: new Date('2024-01-18'), activo: true },
    { id: 5, descripcion: 'Vajilla', fechaCreacion: new Date('2024-01-19'), activo: true },
    { id: 6, descripcion: 'Cristalería', fechaCreacion: new Date('2024-01-20'), activo: true },
    { id: 7, descripcion: 'Cubiertos', fechaCreacion: new Date('2024-01-21'), activo: true },
    { id: 8, descripcion: 'Decoración Floral', fechaCreacion: new Date('2024-01-22'), activo: true },
    { id: 9, descripcion: 'Iluminación', fechaCreacion: new Date('2024-01-23'), activo: true },
    { id: 10, descripcion: 'Mobiliario Lounge', fechaCreacion: new Date('2024-01-24'), activo: true },
    { id: 11, descripcion: 'Carpas', fechaCreacion: new Date('2024-01-25'), activo: true },
    { id: 12, descripcion: 'Sonido', fechaCreacion: new Date('2024-01-26'), activo: true }
  ];
  
  // Subject para mantener la lista actualizada en tiempo real
  private categoriasSubject = new BehaviorSubject<Categoria[]>(this.mockCategorias);
  public categorias$ = this.categoriasSubject.asObservable();
  
  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // Inicializar URL de la API
    this.API_URL = this.configService.getApiUrl('categorias');
  }

  /**
   * 📋 Obtener todas las categorías
   */
  getCategorias(filtros?: CategoriaFiltros): Observable<CategoriaResponse> {
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
            this.categoriasSubject.next(response.data as Categoria[]);
          }
        })
      );
    */
    
    // 🎭 Mock implementation (remover cuando tengas API real)
    let categoriasFiltradas = [...this.mockCategorias];
    
    if (filtros?.busqueda) {
      categoriasFiltradas = categoriasFiltradas.filter(cat => 
        cat.descripcion.toLowerCase().includes(filtros.busqueda!.toLowerCase())
      );
    }
    
    if (filtros?.activo !== undefined) {
      categoriasFiltradas = categoriasFiltradas.filter(cat => cat.activo === filtros.activo);
    }
    
    // Ordenamiento
    if (filtros?.ordenarPor) {
      categoriasFiltradas.sort((a, b) => {
        const aValue = a[filtros.ordenarPor as keyof Categoria];
        const bValue = b[filtros.ordenarPor as keyof Categoria];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return filtros.direccion === 'desc' ? -result : result;
      });
    }
    
    return of({
      success: true,
      message: 'Categorías obtenidas exitosamente',
      data: categoriasFiltradas,
      totalRecords: categoriasFiltradas.length
    }).pipe(
      delay(500), // Simular latencia de red
      map(response => {
        this.loadingSubject.next(false);
        this.categoriasSubject.next(categoriasFiltradas);
        return response;
      })
    );
  }

  /**
   * ➕ Agregar nueva categoría
   */
  crearCategoria(categoria: CrearCategoriaDto): Observable<CategoriaResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.post<CategoriaResponse>(`${this.API_URL}`, categoria)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getCategorias().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const nuevaCategoria: Categoria = {
      id: Math.max(...this.mockCategorias.map(c => c.id)) + 1,
      descripcion: categoria.descripcion,
      fechaCreacion: new Date(),
      activo: true
    };
    
    this.mockCategorias.push(nuevaCategoria);
    this.categoriasSubject.next([...this.mockCategorias]);
    
    return of({
      success: true,
      message: 'Categoría creada exitosamente',
      data: nuevaCategoria
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
  actualizarCategoria(categoria: ActualizarCategoriaDto): Observable<CategoriaResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.put<CategoriaResponse>(`${this.API_URL}/${categoria.id}`, categoria)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getCategorias().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const index = this.mockCategorias.findIndex(c => c.id === categoria.id);
    if (index !== -1) {
      this.mockCategorias[index] = {
        ...this.mockCategorias[index],
        descripcion: categoria.descripcion,
        fechaActualizacion: new Date()
      };
      this.categoriasSubject.next([...this.mockCategorias]);
    }
    
    return of({
      success: index !== -1,
      message: index !== -1 ? 'Categoría actualizada exitosamente' : 'Categoría no encontrada',
      data: index !== -1 ? this.mockCategorias[index] : undefined
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
  eliminarCategoria(id: number): Observable<CategoriaResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.delete<CategoriaResponse>(`${this.API_URL}/${id}`)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getCategorias().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const index = this.mockCategorias.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCategorias.splice(index, 1);
      this.categoriasSubject.next([...this.mockCategorias]);
    }
    
    return of({
      success: index !== -1,
      message: index !== -1 ? 'Categoría eliminada exitosamente' : 'Categoría no encontrada'
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
  importarDesdeCSV(archivo: File): Observable<CategoriaResponse> {
    this.loadingSubject.next(true);
    
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const nuevasCategorias: Categoria[] = [];
          
          // Saltar header (primera línea)
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const columns = line.split(',');
              if (columns.length >= 1) {
                const descripcion = columns[0].replace(/"/g, '').trim();
                if (descripcion) {
                  const nuevaCategoria: Categoria = {
                    id: Math.max(...this.mockCategorias.map(c => c.id), 0) + i,
                    descripcion,
                    fechaCreacion: new Date(),
                    activo: true
                  };
                  nuevasCategorias.push(nuevaCategoria);
                }
              }
            }
          }
          
          // Agregar a la lista existente
          this.mockCategorias.push(...nuevasCategorias);
          this.categoriasSubject.next([...this.mockCategorias]);
          
          setTimeout(() => {
            this.loadingSubject.next(false);
            observer.next({
              success: true,
              message: `${nuevasCategorias.length} categorías importadas exitosamente`,
              data: nuevasCategorias
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
   * 📤 Exportar categorías a CSV
   */
  exportarACSV(): Observable<Blob> {
    const csvContent = this.convertirACSV(this.mockCategorias);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return of(blob);
  }

  /**
   * 🔄 Convertir datos a formato CSV
   */
  private convertirACSV(categorias: Categoria[]): string {
    const header = 'ID,Descripcion,Fecha Creacion,Activo\n';
    const rows = categorias.map(cat => 
      `${cat.id},"${cat.descripcion}","${cat.fechaCreacion?.toLocaleDateString() || ''}","${cat.activo ? 'Si' : 'No'}"`
    ).join('\n');
    return header + rows;
  }

  /**
   * 🔍 Obtener categoría por ID
   */
  obtenerCategoriaPorId(id: number): Observable<CategoriaResponse> {
    // 🔗 API real: return this.http.get<CategoriaResponse>(`${this.API_URL}/${id}`);
    
    const categoria = this.mockCategorias.find(c => c.id === id);
    return of({
      success: !!categoria,
      message: categoria ? 'Categoría encontrada' : 'Categoría no encontrada',
      data: categoria
    });
  }
}