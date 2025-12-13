import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-contactos-section',
	standalone: true,
	imports: [CommonModule, MatIconModule, MatButtonModule, MatCardModule],
	template: `
    <div class="section-content">
      <div class="section-header">
        <div class="header-left">
          <mat-icon class="section-icon">contacts</mat-icon>
          <h3 class="section-title">Contactos Frecuentes</h3>
        </div>
        <button mat-raised-button color="primary" (click)="agregarContacto()">
          <mat-icon>add</mat-icon>
          Agregar Contacto
        </button>
      </div>

      <div class="empty-state">
        <mat-icon>contact_phone</mat-icon>
        <p>Esta funcionalidad estará disponible próximamente</p>
        <p class="subtitle">Aquí podrás gestionar los contactos frecuentes del cliente</p>
      </div>
    </div>
  `,
	styles: [`
    .section-content {
      padding: var(--spacing-lg);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-lg);
      border-bottom: 2px solid var(--border-light);

      .header-left {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);

        .section-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
          color: var(--color-primary);
        }

        .section-title {
          margin: 0;
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-3xl);
      text-align: center;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--text-muted);
        margin-bottom: var(--spacing-lg);
      }

      p {
        color: var(--text-secondary);
        font-size: var(--font-size-md);
        margin: 0;
      }

      .subtitle {
        color: var(--text-muted);
        font-size: var(--font-size-sm);
        margin-top: var(--spacing-sm);
      }
    }
  `],
})
export class ContactosSectionComponent {
	@Input({ required: true }) clienteId!: number;

	agregarContacto(): void {
		console.log('Agregar contacto para cliente:', this.clienteId);
	}
}
