import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PaquetesService } from './paquetes.service';
import type { Paquete } from './paquetes.model';

@Component({
	selector: 'app-paquetes',
	imports: [
		CommonModule,
		MatCardModule,
		MatTableModule,
		MatPaginatorModule,
		MatSortModule,
		MatProgressSpinnerModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatChipsModule,
		MatDividerModule,
		MatTooltipModule,
	],
	templateUrl: './paquetes.component.html',
	styleUrl: './paquetes.component.scss',
})
export class PaquetesComponent implements OnInit {
	dataSource = new MatTableDataSource<Paquete>([]);
	columnasDisplayed: string[] = [
		'id',
		'tipo',
		'nombre',
		'categoria',
		'stock',
		'precio',
		'acciones',
	];
	loading = false;
	paquetes: Paquete[] = [];

	@ViewChild(MatPaginator) paginator!: MatPaginator;
	@ViewChild(MatSort) sort!: MatSort;

	constructor(private paquetesService: PaquetesService) {}

	ngOnInit(): void {
		this.configurarTabla();
		this.suscribirAServicio();
		this.cargarPaquetes();
	}

	private configurarTabla(): void {
		setTimeout(() => {
			if (this.paginator) this.dataSource.paginator = this.paginator;
			if (this.sort) this.dataSource.sort = this.sort;
		});
	}

	private suscribirAServicio(): void {
		this.paquetesService.paquetes$.subscribe((items: Paquete[]) => {
			this.paquetes = items;
			this.dataSource.data = items;
		});

		this.paquetesService.loading$.subscribe((l: boolean) => {
			this.loading = l;
		});
	}

	cargarPaquetes(): void {
		this.paquetesService.getPaquetes().subscribe();
	}

	// Placeholder para futuras acciones (editar/ver)
	verPaquete(paquete: Paquete): void {
		// TODO: abrir detalle/diálogo
		console.log('Ver paquete', paquete);
	}
}
