import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ReportesService, ReportesData, EventFilter } from './reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    NgxChartsModule
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent implements OnInit {
  // Datos del reporte
  reportesData: ReportesData | null = null;

  // Configuración de gráficos
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Mes';
  yAxisLabel = 'Ventas ($)';

  // Colores personalizados
  // TODO: Replace 'any' with a proper 'Color' type from ngx-charts for stronger typing and future compatibility.
  // Current simple object works fine for now, but defining as:
  // import { Color, ScaleType } from '@swimlane/ngx-charts';
  // colorScheme: Color = { name: 'default', selectable: true, group: ScaleType.Ordinal, domain: [...] };
  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  pieColorScheme: any = {
    domain: ['#4CAF50', '#2196F3', '#F44336']
  };

  // Filtros
  selectedFilter: EventFilter = 'todos';
  filterOptions = [
    { value: 'todos', label: 'Todos los eventos' },
    { value: 'completados', label: 'Completados' },
    { value: 'proximos', label: 'Próximos' },
    { value: 'cancelados', label: 'Cancelados' }
  ];

  selectedMonthRange = 'all';
  monthRangeOptions = [
    { value: 'all', label: 'Todo el año' },
    { value: 'q1', label: 'Q1 (Ene-Mar)' },
    { value: 'q2', label: 'Q2 (Abr-Jun)' },
    { value: 'q3', label: 'Q3 (Jul-Sep)' },
    { value: 'q4', label: 'Q4 (Oct-Dic)' }
  ];

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reportesService.getReportesData().subscribe(data => {
      this.reportesData = data;
    });
  }

  // Actualizar datos cuando cambia el filtro de tipo de evento
  onFilterChange(filter: EventFilter): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  // Actualizar datos cuando cambia el rango de meses
  onMonthRangeChange(range: string): void {
    this.selectedMonthRange = range;
    this.applyFilters();
  }

  // Aplicar filtros combinados
  applyFilters(): void {
    if (this.selectedMonthRange === 'all') {
      this.reportesService.getFilteredData(this.selectedFilter).subscribe(data => {
        this.reportesData = data;
      });
    } else {
      const [start, end] = this.getMonthRange(this.selectedMonthRange);
      this.reportesService.getDataByDateRange(start, end).subscribe(data => {
        // Aplicar también el filtro de tipo de evento
        if (this.selectedFilter !== 'todos') {
          this.reportesService.getFilteredData(this.selectedFilter).subscribe(filteredData => {
            this.reportesData = {
              ...filteredData,
              totalVentasPorMes: data.totalVentasPorMes
            };
          });
        } else {
          this.reportesData = data;
        }
      });
    }
  }

  // Obtener rango de meses según el trimestre seleccionado
  private getMonthRange(range: string): [number, number] {
    switch (range) {
      case 'q1': return [0, 2];
      case 'q2': return [3, 5];
      case 'q3': return [6, 8];
      case 'q4': return [9, 11];
      default: return [0, 11];
    }
  }

  // Formatear valores para mostrar en las gráficas
  formatCurrency(value: number): string {
    return `$${value.toLocaleString('es-MX')}`;
  }

  // Evento cuando se selecciona un elemento del gráfico
  onSelect(event: any): void {
    console.log('Item clicked', event);
  }
}
