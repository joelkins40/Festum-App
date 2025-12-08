import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { MatButtonModule } from '@angular/material/button';

export const BUTTON_VARIANTS = ['primary', 'secondary', 'danger', 'ghost'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

export type ButtonVariant = typeof BUTTON_VARIANTS[number];
export type ButtonSize = typeof BUTTON_SIZES[number];

/**
 * Returns a button component with customizable variant, size, and icon.
 *
 * @param variant - The visual style of the button (primary, secondary, danger, ghost).
 * @param size - The size of the button (sm, md, lg). Default is 'md'.
 * @param disabled - Whether the button is disabled.
 * @param icon - Optional icon name to display inside the button.
 * @param fullWidth - Whether the button should take the full width of its container.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.variant]': 'variant',
    '[attr.size]': 'size',
    '[attr.full-width]': 'fullWidth ? "" : null'
  }
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() icon?: string;
  @Input() fullWidth: boolean = false;
}
