import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="confirm-dialog">
      <!-- Header con icono y título -->
      <div class="dialog-header">
        <div class="icon-container" [ngClass]="'icon-' + data.type">
          <mat-icon class="dialog-icon">{{ getIconName() }}</mat-icon>
        </div>
        <h2 class="dialog-title">{{ data.title }}</h2>
      </div>
      
      <!-- Contenido del mensaje -->
      <div class="dialog-content">
        <p class="dialog-message">{{ data.message }}</p>
      </div>
      
      <!-- Botones de acción -->
      <div class="dialog-actions">
        <button mat-stroked-button 
                (click)="onCancel()" 
                class="cancel-button">
          <mat-icon>close</mat-icon>
          {{ data.cancelText || 'Cancelar' }}
        </button>
        
        <button mat-raised-button 
                (click)="onConfirm()" 
                class="confirm-button"
                [ngClass]="'confirm-' + data.type">
          <mat-icon>{{ getConfirmIcon() }}</mat-icon>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 400px;
      max-width: 500px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    .dialog-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 24px 24px 16px;
      border-bottom: 1px solid #f1f3f4;
      
      .icon-container {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        
        &.icon-danger {
          background-color: rgba(244, 67, 54, 0.1);
          border: 2px solid rgba(244, 67, 54, 0.3);
          
          .dialog-icon {
            color: #f44336;
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }
        
        &.icon-warning {
          background-color: rgba(255, 152, 0, 0.1);
          border: 2px solid rgba(255, 152, 0, 0.3);
          
          .dialog-icon {
            color: #ff9800;
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }
        
        &.icon-info {
          background-color: rgba(33, 150, 243, 0.1);
          border: 2px solid rgba(33, 150, 243, 0.3);
          
          .dialog-icon {
            color: #2196f3;
            font-size: 32px;
            width: 32px;
            height: 32px;
          }
        }
      }
      
      .dialog-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #2d3436;
        letter-spacing: -0.5px;
      }
    }

    .dialog-content {
      padding: 24px;
      text-align: center;
      
      .dialog-message {
        margin: 0;
        font-size: 16px;
        line-height: 1.6;
        color: #636e72;
      }
    }

    .dialog-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding: 16px 24px 24px;
      border-top: 1px solid #f1f3f4;
      
      button {
        min-width: 120px;
        font-weight: 500;
        border-radius: 8px;
        
        mat-icon {
          margin-right: 8px;
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
      
      .cancel-button {
        color: #636e72;
        border-color: #e9ecef;
        
        &:hover {
          background-color: #f8f9fa;
          border-color: #636e72;
        }
      }
      
      .confirm-button {
        &.confirm-danger {
          background-color: #f44336;
          color: white;
          
          &:hover {
            background-color: #d32f2f;
            transform: translateY(-1px);
          }
        }
        
        &.confirm-warning {
          background-color: #ff9800;
          color: white;
          
          &:hover {
            background-color: #f57c00;
            transform: translateY(-1px);
          }
        }
        
        &.confirm-info {
          background-color: #2196f3;
          color: white;
          
          &:hover {
            background-color: #1976d2;
            transform: translateY(-1px);
          }
        }
      }
    }
  `]
})
export class ConfirmDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // Valores por defecto
    this.data.type = this.data.type || 'info';
    this.data.confirmText = this.data.confirmText || 'Confirmar';
    this.data.cancelText = this.data.cancelText || 'Cancelar';
  }

  /**
   * 🎯 Obtener nombre del icono según el tipo
   */
  getIconName(): string {
    switch (this.data.type) {
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      default:
        return 'info';
    }
  }

  /**
   * 🎯 Obtener icono de confirmación según el tipo
   */
  getConfirmIcon(): string {
    switch (this.data.type) {
      case 'danger':
        return 'delete_forever';
      case 'warning':
        return 'warning';
      default:
        return 'check';
    }
  }

  /**
   *  Obtener color del botón según el tipo (mantenido por compatibilidad)
   */
  getButtonColor(): string {
    switch (this.data.type) {
      case 'warning':
        return 'accent';
      case 'danger':
        return 'warn';
      default:
        return 'primary';
    }
  }

  /**
   * ✅ Confirmar acción
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * ❌ Cancelar acción
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}