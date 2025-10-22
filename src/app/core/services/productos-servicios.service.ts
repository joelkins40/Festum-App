import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { 
  ProductoServicio, 
  CrearProductoServicioDto, 
  ActualizarProductoServicioDto, 
  ProductoServicioResponse, 
  ProductoServicioFiltros 
} from '../models/productos-servicios.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosServiciosService {
  // URL de la API desde servicio de configuración
  private readonly API_URL: string;
  
  // Mock data para desarrollo - Productos y servicios para eventos
  private mockProductosServicios: ProductoServicio[] = [
    // PRODUCTOS
    { 
      id: 1, 
      tipo: 'Producto', 
      categoriaId: 1, 
      categoria: { id: 1, descripcion: 'Manteles' },
      clave: 'MNT001', 
      cantidadStock: 50, 
      nombre: 'Mantel Rectangular Blanco 2.5x1.5m', 
      descripcion: 'Mantel rectangular de tela fina color blanco para mesas de 8 personas',
      precioPublico: 180.00, 
      precioEspecial: 150.00,
      fechaCreacion: new Date('2024-01-15'), 
      activo: true 
    },
    { 
      id: 2, 
      tipo: 'Producto', 
      categoriaId: 1, 
      categoria: { id: 1, descripcion: 'Manteles' },
      clave: 'MNT002', 
      cantidadStock: 30, 
      nombre: 'Mantel Redondo Marfil Ø2.5m', 
      descripcion: 'Mantel redondo elegante color marfil para mesas circulares',
      precioPublico: 220.00, 
      precioEspecial: 185.00,
      fechaCreacion: new Date('2024-01-16'), 
      activo: true 
    },
    { 
      id: 3, 
      tipo: 'Producto', 
      categoriaId: 2, 
      categoria: { id: 2, descripcion: 'Mesas' },
      clave: 'MSA001', 
      cantidadStock: 25, 
      nombre: 'Mesa Rectangular Cristal 2.5x1.2m', 
      descripcion: 'Mesa rectangular con cubierta de cristal templado y base metálica',
      precioPublico: 450.00, 
      precioEspecial: 380.00,
      fechaCreacion: new Date('2024-01-17'), 
      activo: true 
    },
    { 
      id: 4, 
      tipo: 'Producto', 
      categoriaId: 2, 
      categoria: { id: 2, descripcion: 'Mesas' },
      clave: 'MSA002', 
      cantidadStock: 20, 
      nombre: 'Mesa Redonda Madera Ø1.8m', 
      descripcion: 'Mesa redonda de madera fina con acabado natural para 10 personas',
      precioPublico: 380.00, 
      precioEspecial: 320.00,
      fechaCreacion: new Date('2024-01-18'), 
      activo: true 
    },
    { 
      id: 5, 
      tipo: 'Producto', 
      categoriaId: 3, 
      categoria: { id: 3, descripcion: 'Sillas' },
      clave: 'SLL001', 
      cantidadStock: 150, 
      nombre: 'Silla Chiavari Dorada', 
      descripcion: 'Silla Chiavari clásica color dorado con cojín beige',
      precioPublico: 95.00, 
      precioEspecial: 75.00,
      fechaCreacion: new Date('2024-01-19'), 
      activo: true 
    },
    { 
      id: 6, 
      tipo: 'Producto', 
      categoriaId: 5, 
      categoria: { id: 5, descripcion: 'Vajilla' },
      clave: 'VAJ001', 
      cantidadStock: 200, 
      nombre: 'Plato Principal Porcelana Blanca', 
      descripcion: 'Plato principal de porcelana blanca con borde dorado, 28cm diámetro',
      precioPublico: 25.00, 
      precioEspecial: 20.00,
      fechaCreacion: new Date('2024-01-20'), 
      activo: true 
    },
    
    // SERVICIOS
    { 
      id: 7, 
      tipo: 'Servicio', 
      categoriaId: 8, 
      categoria: { id: 8, descripcion: 'Decoración Floral' },
      clave: 'SRV001', 
      cantidadStock: 0, 
      nombre: 'Arreglo Floral Central Grande', 
      descripcion: 'Arreglo floral central con flores de temporada, diseño personalizado',
      precioPublico: 850.00, 
      precioEspecial: 720.00,
      fechaCreacion: new Date('2024-01-21'), 
      activo: true 
    },
    { 
      id: 8, 
      tipo: 'Servicio', 
      categoriaId: 9, 
      categoria: { id: 9, descripcion: 'Iluminación' },
      clave: 'SRV002', 
      cantidadStock: 0, 
      nombre: 'Montaje Iluminación Ambiental', 
      descripcion: 'Servicio completo de iluminación ambiental con luces LED y control dimmer',
      precioPublico: 1200.00, 
      precioEspecial: 1000.00,
      fechaCreacion: new Date('2024-01-22'), 
      activo: true 
    },
    { 
      id: 9, 
      tipo: 'Servicio', 
      categoriaId: 12, 
      categoria: { id: 12, descripcion: 'Sonido' },
      clave: 'SRV003', 
      cantidadStock: 0, 
      nombre: 'Sistema de Audio Profesional', 
      descripcion: 'Servicio de sonido profesional con micrófonos inalámbricos y mezcladora',
      precioPublico: 980.00, 
      precioEspecial: 850.00,
      fechaCreacion: new Date('2024-01-23'), 
      activo: true 
    }
  ];
  
  // Subject para mantener la lista actualizada en tiempo real
  private productosServiciosSubject = new BehaviorSubject<ProductoServicio[]>(this.mockProductosServicios);
  public productosServicios$ = this.productosServiciosSubject.asObservable();
  
  // Loading state
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    // Inicializar URL de la API
    this.API_URL = this.configService.getApiUrl('productos');
  }

  /**
   * 📋 Obtener todos los productos y servicios
   */
  getProductosServicios(filtros?: ProductoServicioFiltros): Observable<ProductoServicioResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real (descomenta cuando tengas el backend):
    /*
    let params = new HttpParams();
    if (filtros) {
      if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
      if (filtros.tipo) params = params.set('tipo', filtros.tipo);
      if (filtros.categoriaId) params = params.set('categoriaId', filtros.categoriaId.toString());
      if (filtros.activo !== undefined) params = params.set('activo', filtros.activo.toString());
      if (filtros.ordenarPor) params = params.set('ordenarPor', filtros.ordenarPor);
      if (filtros.direccion) params = params.set('direccion', filtros.direccion);
      if (filtros.pagina) params = params.set('pagina', filtros.pagina.toString());
      if (filtros.limite) params = params.set('limite', filtros.limite.toString());
    }
    
    return this.http.get<ProductoServicioResponse>(`${this.API_URL}`, { params })
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success && response.data) {
            this.productosServiciosSubject.next(response.data as ProductoServicio[]);
          }
        })
      );
    */
    
    // 🎭 Mock implementation (remover cuando tengas API real)
    let itemsFiltrados = [...this.mockProductosServicios];
    
    if (filtros?.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      itemsFiltrados = itemsFiltrados.filter(item => 
        item.nombre.toLowerCase().includes(busqueda) ||
        item.clave.toLowerCase().includes(busqueda) ||
        item.descripcion.toLowerCase().includes(busqueda) ||
        (item.categoria?.descripcion.toLowerCase().includes(busqueda))
      );
    }
    
    if (filtros?.tipo) {
      itemsFiltrados = itemsFiltrados.filter(item => item.tipo === filtros.tipo);
    }
    
    if (filtros?.categoriaId) {
      itemsFiltrados = itemsFiltrados.filter(item => item.categoriaId === filtros.categoriaId);
    }
    
    if (filtros?.activo !== undefined) {
      itemsFiltrados = itemsFiltrados.filter(item => item.activo === filtros.activo);
    }
    
    // Ordenamiento
    if (filtros?.ordenarPor) {
      itemsFiltrados.sort((a, b) => {
        const aValue = a[filtros.ordenarPor as keyof ProductoServicio];
        const bValue = b[filtros.ordenarPor as keyof ProductoServicio];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        const result = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return filtros.direccion === 'desc' ? -result : result;
      });
    }
    
    return of({
      success: true,
      message: 'Productos y servicios obtenidos exitosamente',
      data: itemsFiltrados,
      totalRecords: itemsFiltrados.length
    }).pipe(
      delay(500), // Simular latencia de red
      map(response => {
        this.loadingSubject.next(false);
        this.productosServiciosSubject.next(itemsFiltrados);
        return response;
      })
    );
  }

  /**
   * ➕ Agregar nuevo producto o servicio
   */
  crearProductoServicio(item: CrearProductoServicioDto): Observable<ProductoServicioResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.post<ProductoServicioResponse>(`${this.API_URL}`, item)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getProductosServicios().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const nuevoItem: ProductoServicio = {
      id: Math.max(...this.mockProductosServicios.map(c => c.id)) + 1,
      ...item,
      fechaCreacion: new Date(),
      activo: true
    };
    
    this.mockProductosServicios.push(nuevoItem);
    this.productosServiciosSubject.next([...this.mockProductosServicios]);
    
    return of({
      success: true,
      message: `${item.tipo} creado exitosamente`,
      data: nuevoItem
    }).pipe(
      delay(300),
      map(response => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  /**
   * ✏️ Actualizar producto o servicio
   */
  actualizarProductoServicio(item: ActualizarProductoServicioDto): Observable<ProductoServicioResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.put<ProductoServicioResponse>(`${this.API_URL}/${item.id}`, item)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getProductosServicios().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const index = this.mockProductosServicios.findIndex(c => c.id === item.id);
    if (index !== -1) {
      this.mockProductosServicios[index] = {
        ...this.mockProductosServicios[index],
        ...item,
        fechaActualizacion: new Date()
      };
      this.productosServiciosSubject.next([...this.mockProductosServicios]);
    }
    
    return of({
      success: index !== -1,
      message: index !== -1 ? `${item.tipo} actualizado exitosamente` : 'Elemento no encontrado',
      data: index !== -1 ? this.mockProductosServicios[index] : undefined
    }).pipe(
      delay(300),
      map(response => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  /**
   * 🗑️ Eliminar producto o servicio
   */
  eliminarProductoServicio(id: number): Observable<ProductoServicioResponse> {
    this.loadingSubject.next(true);
    
    // 🔗 Implementación para API real:
    /*
    return this.http.delete<ProductoServicioResponse>(`${this.API_URL}/${id}`)
      .pipe(
        tap(response => {
          this.loadingSubject.next(false);
          if (response.success) {
            this.getProductosServicios().subscribe(); // Refrescar lista
          }
        })
      );
    */
    
    // 🎭 Mock implementation
    const index = this.mockProductosServicios.findIndex(c => c.id === id);
    const item = this.mockProductosServicios[index];
    
    if (index !== -1) {
      this.mockProductosServicios.splice(index, 1);
      this.productosServiciosSubject.next([...this.mockProductosServicios]);
    }
    
    return of({
      success: index !== -1,
      message: index !== -1 ? `${item?.tipo || 'Elemento'} eliminado exitosamente` : 'Elemento no encontrado'
    }).pipe(
      delay(300),
      map(response => {
        this.loadingSubject.next(false);
        return response;
      })
    );
  }

  /**
   * 📥 Importar productos/servicios desde CSV
   */
  importarDesdeCSV(archivo: File): Observable<ProductoServicioResponse> {
    this.loadingSubject.next(true);
    
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const nuevosItems: ProductoServicio[] = [];
          
          // Saltar header (primera línea)
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const columns = line.split(',');
              if (columns.length >= 8) {
                const nuevoItem: ProductoServicio = {
                  id: Math.max(...this.mockProductosServicios.map(c => c.id), 0) + i,
                  tipo: columns[0].replace(/"/g, '').trim() as 'Producto' | 'Servicio',
                  categoriaId: parseInt(columns[1].replace(/"/g, '').trim()),
                  clave: columns[2].replace(/"/g, '').trim(),
                  cantidadStock: parseInt(columns[3].replace(/"/g, '').trim()) || 0,
                  nombre: columns[4].replace(/"/g, '').trim(),
                  descripcion: columns[5].replace(/"/g, '').trim(),
                  precioPublico: parseFloat(columns[6].replace(/"/g, '').trim()) || 0,
                  precioEspecial: parseFloat(columns[7].replace(/"/g, '').trim()) || 0,
                  fechaCreacion: new Date(),
                  activo: true
                };
                nuevosItems.push(nuevoItem);
              }
            }
          }
          
          // Agregar a la lista existente
          this.mockProductosServicios.push(...nuevosItems);
          this.productosServiciosSubject.next([...this.mockProductosServicios]);
          
          setTimeout(() => {
            this.loadingSubject.next(false);
            observer.next({
              success: true,
              message: `${nuevosItems.length} elementos importados exitosamente`,
              data: nuevosItems
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
   * 📤 Exportar productos/servicios a CSV
   */
  exportarACSV(): Observable<Blob> {
    const csvContent = this.convertirACSV(this.mockProductosServicios);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return of(blob);
  }

  /**
   * 🔄 Convertir datos a formato CSV
   */
  private convertirACSV(items: ProductoServicio[]): string {
    const header = 'Tipo,Categoria ID,Clave,Stock,Nombre,Descripcion,Precio Publico,Precio Especial,Fecha Creacion,Activo\n';
    const rows = items.map(item => 
      `"${item.tipo}","${item.categoriaId}","${item.clave}","${item.cantidadStock}","${item.nombre}","${item.descripcion}","${item.precioPublico}","${item.precioEspecial}","${item.fechaCreacion?.toLocaleDateString() || ''}","${item.activo ? 'Si' : 'No'}"`
    ).join('\n');
    return header + rows;
  }

  /**
   * 🔍 Obtener producto/servicio por ID
   */
  obtenerPorId(id: number): Observable<ProductoServicioResponse> {
    // 🔗 API real: return this.http.get<ProductoServicioResponse>(`${this.API_URL}/${id}`);
    
    const item = this.mockProductosServicios.find(c => c.id === id);
    return of({
      success: !!item,
      message: item ? 'Elemento encontrado' : 'Elemento no encontrado',
      data: item
    });
  }
}