import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * 🔧 Servicio de configuración centralizada
 * Maneja todas las URLs y configuraciones de la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  // Configuración base de la API
  private readonly baseApiUrl = environment.apiUrl;
  
  // Endpoints de la aplicación
  private readonly endpoints = {
    categorias: '/categorias',
    tiposEvento: '/tipos-evento',
    eventos: '/eventos',
    clientes: '/clientes',
    proveedores: '/proveedores',
    productos: '/productos',
    servicios: '/servicios',
    reservas: '/reservas',
    facturacion: '/facturacion',
    reportes: '/reportes',
    usuarios: '/usuarios',
    auth: '/auth'
  };

  constructor() {}

  /**
   * 🔗 Obtiene la URL completa para un endpoint específico
   * @param endpoint - Nombre del endpoint
   * @returns URL completa del endpoint
   */
  getApiUrl(endpoint: keyof typeof this.endpoints): string {
    return `${this.baseApiUrl}${this.endpoints[endpoint]}`;
  }

  /**
   * 🔗 Obtiene la URL base de la API
   * @returns URL base de la API
   */
  getBaseApiUrl(): string {
    return this.baseApiUrl;
  }

  /**
   * 🔗 Obtiene una URL personalizada
   * @param customEndpoint - Endpoint personalizado
   * @returns URL completa personalizada
   */
  getCustomApiUrl(customEndpoint: string): string {
    return `${this.baseApiUrl}${customEndpoint}`;
  }

  /**
   * 🏗️ Construye una URL con parámetros
   * @param endpoint - Nombre del endpoint
   * @param id - ID opcional para el recurso
   * @param action - Acción opcional (ej: 'activate', 'deactivate')
   * @returns URL construida
   */
  buildUrl(endpoint: keyof typeof this.endpoints, id?: number | string, action?: string): string {
    let url = this.getApiUrl(endpoint);
    
    if (id) {
      url += `/${id}`;
    }
    
    if (action) {
      url += `/${action}`;
    }
    
    return url;
  }

  /**
   * 🔧 Obtiene configuración de la aplicación
   * @returns Objeto con configuración del entorno
   */
  getAppConfig() {
    return {
      production: environment.production,
      appName: environment.appName,
      version: environment.version,
      apiUrl: this.baseApiUrl
    };
  }

  /**
   * 📋 Lista todos los endpoints disponibles
   * @returns Objeto con todos los endpoints y sus URLs
   */
  getAllEndpoints(): Record<string, string> {
    const result: Record<string, string> = {};
    
    Object.keys(this.endpoints).forEach(key => {
      result[key] = this.getApiUrl(key as keyof typeof this.endpoints);
    });
    
    return result;
  }
}