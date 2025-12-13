import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClientesService } from '../../../../core/services/clientes.service';
import { Direccion } from '../../../../core/models/cliente.model';
import { ButtonIconComponent } from '../../../../shared/components/button-icon';

@Component({
	selector: 'app-direcciones-section',
	standalone: true,
	imports: [
		CommonModule,
		MatTableModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatChipsModule,
		MatTooltipModule,
		ButtonIconComponent,
	],
	template: `
    <div class="section-content">
      <div class="section-header">
        <div class="header-left">
          <mat-icon class="section-icon">place</mat-icon>
          <h3 class="section-title">Direcciones Registradas</h3>
          <mat-chip class="count-badge">{{ direcciones().length }}</mat-chip>
        </div>
        <button mat-raised-button color="primary" (click)="agregarDireccion()">
          <mat-icon>add</mat-icon>
          Agregar Dirección
        </button>
      </div>

      @if (direcciones().length === 0) {
      <div class="empty-state">
        <mat-icon>location_off</mat-icon>
        <p>No hay direcciones registradas para este cliente</p>
        <button mat-raised-button color="primary" (click)="agregarDireccion()">
          <mat-icon>add</mat-icon>
          Agregar Primera Dirección
        </button>
      </div>
      } @else {
      <div class="direcciones-grid">
        @for (direccion of direcciones(); track $index) {
        <mat-card class="direccion-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>place</mat-icon>
              Dirección {{ $index + 1 }}
            </mat-card-title>
            <div class="card-actions">
              <ui-button-icon
                icon="edit"
                color="primary"
                tooltip="Editar dirección"
                (pressed)="editarDireccion(direccion)"
              />
              <ui-button-icon
                icon="delete"
                color="error"
                tooltip="Eliminar dirección"
                (pressed)="eliminarDireccion($index)"
              />
            </div>
          </mat-card-header>
          <mat-card-content>
            <div class="direccion-info">
              <div class="info-row">
                <mat-icon class="info-icon">home</mat-icon>
                <span class="direccion-principal">{{ direccion.formatted.line1 }}</span>
              </div>
              <div class="info-row">
                <mat-icon class="info-icon">location_city</mat-icon>
                <span>{{ direccion.city }}, {{ direccion.state }}</span>
              </div>
              <div class="info-row">
                <mat-icon class="info-icon">markunread_mailbox</mat-icon>
                <span>CP: {{ direccion.postalCode }}</span>
              </div>
              <div class="info-row">
                <mat-icon class="info-icon">public</mat-icon>
                <span>{{ direccion.country }}</span>
              </div>
            </div>
            @if (direccion.confidence) {
            <mat-chip class="confidence-chip">
              Precisión: {{ direccion.confidence * 100 | number:'1.0-0' }}%
            </mat-chip>
            }
          </mat-card-content>
        </mat-card>
        }
      </div>
      }
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

        .count-badge {
          background: var(--color-primary-alpha-15);
          color: var(--color-primary);
          font-weight: var(--font-weight-bold);
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
        margin-bottom: var(--spacing-xl);
      }
    }

    .direcciones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--spacing-xl);
    }

    .direccion-card {
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);

      &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-2px);
      }

      mat-card-header {
        background: linear-gradient(135deg, var(--color-primary-alpha-10), var(--color-primary-alpha-15));
        padding: var(--spacing-lg);
        display: flex;
        justify-content: space-between;
        align-items: center;

        mat-card-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin: 0;

          mat-icon {
            color: var(--color-primary);
          }
        }

        .card-actions {
          display: flex;
          gap: var(--spacing-sm);
        }
      }

      mat-card-content {
        padding: var(--spacing-lg);

        .direccion-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);

          .info-row {
            display: flex;
            align-items: flex-start;
            gap: var(--spacing-sm);

            .info-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: var(--color-primary);
              flex-shrink: 0;
              margin-top: 2px;
            }

            span {
              color: var(--text-primary);
              font-size: var(--font-size-sm);
              line-height: var(--line-height-relaxed);
            }

            .direccion-principal {
              font-weight: var(--font-weight-semibold);
              font-size: var(--font-size-md);
            }
          }
        }

        .confidence-chip {
          margin-top: var(--spacing-md);
          background: var(--color-success-alpha-15);
          color: var(--color-success);
          font-size: var(--font-size-xs);
        }
      }
    }

    @media (max-width: 768px) {
      .direcciones-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);

        button {
          width: 100%;
        }
      }
    }
  `],
})
export class DireccionesSectionComponent implements OnInit {
	@Input({ required: true }) clienteId!: number;

	private clientesService = inject(ClientesService);

	direcciones = signal<Direccion[]>([]);

	ngOnInit(): void {
		this.loadDirecciones();
	}

	private loadDirecciones(): void {
		this.clientesService.getClienteById(this.clienteId).subscribe({
			next: (response) => {
				if (response.success && response.data && !Array.isArray(response.data)) {
					this.direcciones.set(response.data.direcciones);
				}
			},
			error: (err) => {
				console.error('Error al cargar direcciones:', err);
			},
		});
	}

	agregarDireccion(): void {
		console.log('Agregar dirección para cliente:', this.clienteId);
		// TODO: Implementar dialog para agregar dirección
	}

	editarDireccion(direccion: Direccion): void {
		console.log('Editar dirección:', direccion);
		// TODO: Implementar dialog para editar dirección
	}

	eliminarDireccion(index: number): void {
		console.log('Eliminar dirección en índice:', index);
		// TODO: Implementar confirmación y eliminación
	}
}
