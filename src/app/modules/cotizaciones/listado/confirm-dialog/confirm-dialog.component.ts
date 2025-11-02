import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	MatDialogModule,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	type?: 'warning' | 'danger' | 'info';
}

@Component({
	selector: 'app-confirm-dialog',
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
	template: `
    <div class="confirm-dialog" [class]="'confirm-dialog-' + data.type">
      <div class="dialog-icon">
        <mat-icon>{{ getIcon() }}</mat-icon>
      </div>

      <h2 mat-dialog-title>{{ data.title }}</h2>

      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button
          mat-raised-button
          [color]="data.type === 'danger' ? 'warn' : 'primary'"
          (click)="onConfirm()"
        >
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
	styles: [
		`
    .confirm-dialog {
      padding: 1rem;
      min-width: 400px;

      .dialog-icon {
        text-align: center;
        margin-bottom: 1rem;

        mat-icon {
          font-size: 4rem;
          width: 4rem;
          height: 4rem;
        }
      }

      &.confirm-dialog-warning .dialog-icon mat-icon {
        color: #ffc107;
      }

      &.confirm-dialog-danger .dialog-icon mat-icon {
        color: #dc3545;
      }

      &.confirm-dialog-info .dialog-icon mat-icon {
        color: #667eea;
      }

      h2 {
        text-align: center;
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
      }

      mat-dialog-content {
        text-align: center;
        padding: 1rem 0;

        p {
          margin: 0;
          font-size: 1.1rem;
          color: rgba(0, 0, 0, 0.7);
        }
      }

      mat-dialog-actions {
        padding: 1rem 0 0 0;
        gap: 1rem;
      }
    }

    @media (max-width: 500px) {
      .confirm-dialog {
        min-width: 100%;

        mat-dialog-actions {
          flex-direction: column;

          button {
            width: 100%;
          }
        }
      }
    }
  `,
	],
})
export class ConfirmDialogComponent {
	private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
	public data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

	getIcon(): string {
		switch (this.data.type) {
			case 'warning':
				return 'warning';
			case 'danger':
				return 'error';
			case 'info':
				return 'info';
			default:
				return 'help_outline';
		}
	}

	onCancel(): void {
		this.dialogRef.close(false);
	}

	onConfirm(): void {
		this.dialogRef.close(true);
	}
}
