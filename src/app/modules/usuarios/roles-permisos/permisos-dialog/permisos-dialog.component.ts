import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { Rol, Permiso } from '../roles-permisos.component';

export interface PermisosDialogData {
	rol: Rol;
	todosLosPermisos: Permiso[];
}

/**
 * 🧩 Componente Modal para Gestionar Permisos de un Rol
 * Permite seleccionar/deseleccionar permisos mediante checkboxes
 */
@Component({
	selector: 'app-permisos-dialog',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatCheckboxModule,
		MatDividerModule,
		MatChipsModule,
	],
	templateUrl: './permisos-dialog.component.html',
	styleUrl: './permisos-dialog.component.scss',
})
export class PermisosDialogComponent implements OnInit {
	rol: Rol;
	permisos: Permiso[] = [];
	permisosSeleccionados: Set<string> = new Set();
	guardando = false;

	// Categorías de permisos
	categorias: string[] = [];

	constructor(
		public dialogRef: MatDialogRef<PermisosDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: PermisosDialogData,
	) {
		this.rol = data.rol;
		this.permisos = data.todosLosPermisos;
	}

	ngOnInit(): void {
		// Inicializar permisos seleccionados desde el rol
		if (this.rol.permisos) {
			this.rol.permisos.forEach((permiso) => {
				this.permisosSeleccionados.add(permiso);
			});
		}

		// Extraer categorías únicas
		this.categorias = [
			...new Set(this.permisos.map((p) => p.categoria)),
		].sort();
	}

	/**
	 * 🔄 Toggle de permiso individual
	 */
	togglePermiso(permisoId: string): void {
		if (this.permisosSeleccionados.has(permisoId)) {
			this.permisosSeleccionados.delete(permisoId);
		} else {
			this.permisosSeleccionados.add(permisoId);
		}
	}

	/**
	 * 📋 Verifica si un permiso está seleccionado
	 */
	isPermisoSeleccionado(permisoId: string): boolean {
		return this.permisosSeleccionados.has(permisoId);
	}

	/**
	 * 🎯 Filtra permisos por categoría
	 */
	getPermisosPorCategoria(categoria: string): Permiso[] {
		return this.permisos.filter((p) => p.categoria === categoria);
	}

	/**
	 * ✅ Seleccionar todos los permisos de una categoría
	 */
	seleccionarTodosCategoria(categoria: string): void {
		const permisosCategoria = this.getPermisosPorCategoria(categoria);
		permisosCategoria.forEach((p) => {
			this.permisosSeleccionados.add(p.id);
		});
	}

	/**
	 * ❌ Deseleccionar todos los permisos de una categoría
	 */
	deseleccionarTodosCategoria(categoria: string): void {
		const permisosCategoria = this.getPermisosPorCategoria(categoria);
		permisosCategoria.forEach((p) => {
			this.permisosSeleccionados.delete(p.id);
		});
	}

	/**
	 * 📊 Cuenta permisos seleccionados en una categoría
	 */
	contarSeleccionadosCategoria(categoria: string): number {
		return this.getPermisosPorCategoria(categoria).filter((p) =>
			this.permisosSeleccionados.has(p.id),
		).length;
	}

	/**
	 * 💾 Guarda los cambios
	 */
	onSave(): void {
		if (!this.guardando) {
			this.guardando = true;

			const result = {
				rolId: this.rol.id,
				permisos: Array.from(this.permisosSeleccionados),
			};

			// Simular delay de guardado para UX
			setTimeout(() => {
				this.dialogRef.close(result);
			}, 800);
		}
	}

	/**
	 * ❌ Cancela y cierra el modal
	 */
	onCancel(): void {
		this.dialogRef.close();
	}

	/**
	 * 📈 Obtiene el total de permisos seleccionados
	 */
	getTotalSeleccionados(): number {
		return this.permisosSeleccionados.size;
	}
}
