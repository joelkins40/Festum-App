import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

/**
 * Colores disponibles para el botón de icono
 */
export type ButtonIconColor = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';

/**
 * Botón de icono reutilizable para acciones rápidas
 *
 * @example
 * ```html
 * <ui-button-icon
 *   icon="edit"
 *   color="primary"
 *   tooltip="Editar"
 *   (pressed)="onEdit()">
 * </ui-button-icon>
 * ```
 *
 * @example
 * ```html
 * <ui-button-icon
 *   icon="delete"
 *   color="error"
 *   [disabled]="loading"
 *   (pressed)="onDelete()">
 * </ui-button-icon>
 * ```
 */
@Component({
	selector: 'ui-button-icon',
	standalone: true,
	imports: [MatIconModule, MatButtonModule, MatTooltipModule],
	templateUrl: './button-icon.component.html',
	styleUrl: './button-icon.component.scss',
})
export class ButtonIconComponent {
	/**
	 * Nombre del icono de Material Icons
	 * @example "edit", "delete", "visibility"
	 */
	@Input() icon = '';

	/**
	 * Color del botón según el sistema de diseño
	 * @default undefined (color por defecto del tema)
	 */
	@Input() color?: ButtonIconColor;

	/**
	 * Texto descriptivo que aparece al hacer hover
	 * @default null
	 */
	@Input() tooltip: string | null = null;

	/**
	 * Deshabilita el botón
	 * @default false
	 */
	@Input() disabled = false;

	/**
	 * Evento emitido al hacer clic en el botón
	 */
	@Output() pressed = new EventEmitter<void>();

	/**
	 * Maneja el clic del botón
	 */
	onClick(): void {
		this.pressed.emit();
	}

	/**
	 * Genera el aria-label para accesibilidad
	 */
	get ariaLabel(): string {
		return this.tooltip || this.icon || 'Botón';
	}
}
