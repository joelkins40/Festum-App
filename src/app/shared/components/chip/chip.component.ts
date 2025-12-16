import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Variantes disponibles para el componente Chip.
 * Cada variante aplica un esquema de color específico basado en los tokens de diseño globales.
 */
export type ChipVariant =
  | 'default'
  | 'primary'
  | 'accent'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'secondary';

/**
 * Tamaños disponibles para el componente Chip.
 * - sm: 20px de altura
 * - md: 28px de altura
 * - lg: 36px de altura
 */
export type ChipSize = 'sm' | 'md' | 'lg';

/**
 * Componente reutilizable para mostrar chips/badges informativos.
 *
 * @description
 * UI Chip es un componente standalone que permite mostrar información compacta
 * con diferentes variantes semánticas, tamaños e iconos opcionales.
 * Utiliza los tokens de diseño globales de `_variables.scss` para mantener
 * consistencia visual en toda la aplicación.
 *
 * @example
 * ```html
 * <!-- Chip básico -->
 * <ui-chip>Default Chip</ui-chip>
 *
 * <!-- Chip con variante y icono -->
 * <ui-chip variant="success" icon="check_circle">Activo</ui-chip>
 *
 * <!-- Chip con tamaño personalizado -->
 * <ui-chip size="sm" variant="primary">Pequeño</ui-chip>
 *
 * <!-- Chip con texto en mayúsculas -->
 * <ui-chip variant="error" [uppercase]="true">alerta</ui-chip>
 * ```
 *
 * @see {@link ChipVariant} Para las variantes disponibles
 * @see {@link ChipSize} Para los tamaños disponibles
 */
@Component({
  selector: 'ui-chip',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipComponent {
  /**
   * Variante visual del chip que determina el esquema de colores.
   * @default 'default'
   * @example
   * ```html
   * <ui-chip variant="success">Éxito</ui-chip>
   * <ui-chip variant="error">Error</ui-chip>
   * ```
   */
  @Input() variant: ChipVariant = 'default';

  /**
   * Tamaño del chip.
   * @default 'md'
   * @example
   * ```html
   * <ui-chip size="sm">Pequeño</ui-chip>
   * <ui-chip size="lg">Grande</ui-chip>
   * ```
   */
  @Input() size: ChipSize = 'md';

  /**
   * Nombre del icono de Material Icons a mostrar antes del texto.
   * Si se proporciona, el icono se renderizará automáticamente.
   * @optional
   * @example
   * ```html
   * <ui-chip icon="star">Favorito</ui-chip>
   * <ui-chip icon="check_circle" variant="success">Completado</ui-chip>
   * ```
   */
  @Input() icon?: string;

  /**
   * Convierte el texto del chip a mayúsculas.
   * @default false
   * @example
   * ```html
   * <ui-chip [uppercase]="true">texto en mayúsculas</ui-chip>
   * ```
   */
  @Input() uppercase = false;

  /**
   * Deshabilita el chip aplicando opacidad reducida y cursor not-allowed.
   * @default false
   * @example
   * ```html
   * <ui-chip [disabled]="true">Deshabilitado</ui-chip>
   * ```
   */
  @Input() disabled = false;
}
