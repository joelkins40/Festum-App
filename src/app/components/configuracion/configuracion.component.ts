import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
  
  configuracionForm: FormGroup;
  
  temas = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
    { value: 'auto', label: 'Automático' }
  ];

  idiomas = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.configuracionForm = this.fb.group({
      nombreSistema: ['Festum Admin', [Validators.required, Validators.minLength(3)]],
      descripcion: ['Sistema de gestión de eventos y usuarios'],
      tema: ['light', Validators.required],
      idioma: ['es', Validators.required],
      notificaciones: [true],
      sonidos: [false],
      autoGuardado: [true],
      emailNotificaciones: ['admin@festum.com', [Validators.email]],
      tiempoSesion: [60, [Validators.min(30), Validators.max(480)]]
    });
  }

  ngOnInit() {
    this.cargarConfiguracion();
  }

  cargarConfiguracion() {
    // Simular carga de configuración desde API o localStorage
    if (typeof localStorage !== 'undefined') {
      const configuracion = localStorage.getItem('configuracion');
      if (configuracion) {
        this.configuracionForm.patchValue(JSON.parse(configuracion));
      }
    }
  }

  guardarConfiguracion() {
    if (this.configuracionForm.valid) {
      const configuracion = this.configuracionForm.value;
      
      // Simular guardado
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('configuracion', JSON.stringify(configuracion));
      }
      
      this.snackBar.open('Configuración guardada correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      
      console.log('Configuración guardada:', configuracion);
    } else {
      this.snackBar.open('Por favor, revisa los campos del formulario', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  resetearConfiguracion() {
    this.configuracionForm.reset();
    this.configuracionForm.patchValue({
      nombreSistema: 'Festum Admin',
      tema: 'light',
      idioma: 'es',
      notificaciones: true,
      sonidos: false,
      autoGuardado: true,
      tiempoSesion: 60
    });
    
    this.snackBar.open('Configuración restablecida', 'Cerrar', {
      duration: 3000
    });
  }

  exportarConfiguracion() {
    const configuracion = this.configuracionForm.value;
    const dataStr = JSON.stringify(configuracion, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'configuracion-festum.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.snackBar.open('Configuración exportada', 'Cerrar', {
      duration: 3000
    });
  }
}