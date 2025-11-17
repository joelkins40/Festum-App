import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ChartData {
  name: string;
  value: number;
}

export interface ReporteSummary {
  totalEventos: number;
  totalVentas: number;
}

export interface ReportesData {
  totalVentasPorMes: ChartData[];
  estadoEventos: ChartData[];
  resumen: ReporteSummary;
}

export type EventFilter = 'todos' | 'completados' | 'proximos' | 'cancelados';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  // Datos mock completos
  private mockData: ReportesData = {
    totalVentasPorMes: [
      { name: 'Enero', value: 12000 },
      { name: 'Febrero', value: 18000 },
      { name: 'Marzo', value: 9500 },
      { name: 'Abril', value: 15000 },
      { name: 'Mayo', value: 22000 },
      { name: 'Junio', value: 19500 },
      { name: 'Julio', value: 17000 },
      { name: 'Agosto', value: 21000 },
      { name: 'Septiembre', value: 16500 },
      { name: 'Octubre', value: 23000 },
      { name: 'Noviembre', value: 20000 },
      { name: 'Diciembre', value: 25000 }
    ],
    estadoEventos: [
      { name: 'Completados', value: 15 },
      { name: 'Próximos', value: 8 },
      { name: 'Cancelados', value: 2 }
    ],
    resumen: {
      totalEventos: 25,
      totalVentas: 218500
    }
  };

  constructor() {}

  getReportesData(): Observable<ReportesData> {
    return of(this.mockData);
  }

  // Filtrar datos por tipo de evento
  getFilteredData(filter: EventFilter): Observable<ReportesData> {
    if (filter === 'todos') {
      return of(this.mockData);
    }

    // Simular filtrado de datos según el estado del evento
    const filteredData: ReportesData = {
      ...this.mockData,
      totalVentasPorMes: this.mockData.totalVentasPorMes.map(item => ({
        ...item,
        value: Math.floor(item.value * this.getFilterMultiplier(filter))
      })),
      estadoEventos: this.mockData.estadoEventos.filter(item => 
        item.name.toLowerCase().includes(this.getFilterName(filter))
      ),
      resumen: {
        totalEventos: this.getFilteredEventCount(filter),
        totalVentas: Math.floor(this.mockData.resumen.totalVentas * this.getFilterMultiplier(filter))
      }
    };

    return of(filteredData);
  }

  // Obtener datos filtrados por rango de fechas (simulado)
  getDataByDateRange(startMonth: number, endMonth: number): Observable<ReportesData> {
    const filteredMonths = this.mockData.totalVentasPorMes.slice(startMonth, endMonth + 1);
    const totalVentas = filteredMonths.reduce((sum, item) => sum + item.value, 0);

    const filteredData: ReportesData = {
      totalVentasPorMes: filteredMonths,
      estadoEventos: this.mockData.estadoEventos,
      resumen: {
        totalEventos: this.mockData.resumen.totalEventos,
        totalVentas: totalVentas
      }
    };

    return of(filteredData);
  }

  private getFilterMultiplier(filter: EventFilter): number {
    switch (filter) {
      case 'completados': return 0.6;
      case 'proximos': return 0.32;
      case 'cancelados': return 0.08;
      default: return 1;
    }
  }

  private getFilterName(filter: EventFilter): string {
    switch (filter) {
      case 'completados': return 'completados';
      case 'proximos': return 'próximos';
      case 'cancelados': return 'cancelados';
      default: return '';
    }
  }

  private getFilteredEventCount(filter: EventFilter): number {
    const event = this.mockData.estadoEventos.find(e => 
      e.name.toLowerCase().includes(this.getFilterName(filter))
    );
    return event ? event.value : 0;
  }
}
