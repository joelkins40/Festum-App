import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { ProductosServiciosService } from '../../../../core/services/productos-servicios.service';
import { ProductoServicio } from '../../../../core/models/productos-servicios.model';
import { ButtonComponent } from "../../../../shared/components/button";

interface ProductoSeleccionado extends ProductoServicio {
	seleccionado?: boolean;
	cantidad?: number;
}

@Component({
	selector: 'app-producto-selector-dialog',
	standalone: true,
	imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDividerModule,
    ButtonComponent
],
	templateUrl: './producto-selector-dialog.component.html',
	styleUrl: './producto-selector-dialog.component.scss',
})
export class ProductoSelectorDialogComponent implements OnInit {
	private dialogRef = inject(MatDialogRef<ProductoSelectorDialogComponent>);
	private productosService = inject(ProductosServiciosService);

	productos: ProductoSeleccionado[] = [];
	productosFiltrados: ProductoSeleccionado[] = [];
	busqueda = '';

	ngOnInit(): void {
		this.cargarProductos();
	}

	cargarProductos(): void {
		this.productosService.getProductosServicios({}).subscribe({
			next: (response) => {
				if (response.success && response.data) {
					const data = Array.isArray(response.data)
						? response.data
						: [response.data];
					this.productos = data.map((p) => ({
						...p,
						seleccionado: false,
						cantidad: 1,
					}));
					this.productosFiltrados = [...this.productos];
				}
			},
			error: (error) => {
				console.error('Error al cargar productos:', error);
			},
		});
	}

	filtrarProductos(): void {
		const termino = this.busqueda.toLowerCase().trim();

		if (!termino) {
			this.productosFiltrados = [...this.productos];
			return;
		}

		this.productosFiltrados = this.productos.filter(
			(p) =>
				p.nombre.toLowerCase().includes(termino) ||
				p.descripcion?.toLowerCase().includes(termino) ||
				p.tipo.toLowerCase().includes(termino),
		);
	}

	toggleSeleccion(producto: ProductoSeleccionado): void {
		producto.seleccionado = !producto.seleccionado;
		if (!producto.seleccionado) {
			producto.cantidad = 1; // Resetear cantidad si se deselecciona
		}
	}

	get productosSeleccionados(): ProductoSeleccionado[] {
		return this.productos.filter((p) => p.seleccionado);
	}

	get totalSeleccionados(): number {
		return this.productosSeleccionados.length;
	}

	onCancelar(): void {
		this.dialogRef.close();
	}

	onAgregar(): void {
		const seleccionados = this.productosSeleccionados.map((p) => {
			const precio = p.precioPublico || 0;
			const cantidad = p.cantidad || 1;
			return {
				id: crypto.randomUUID(), // ID temporal para la tabla
				productoServicioId: p.id,
				tipo: p.tipo,
				nombre: p.nombre,
				descripcion: p.descripcion || '',
				cantidad: cantidad,
				precioUnitario: precio,
				subtotal: cantidad * precio,
			};
		});

		this.dialogRef.close(seleccionados);
	}
}
