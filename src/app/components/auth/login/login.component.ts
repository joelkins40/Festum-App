import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  loginForm: FormGroup;
  hide = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@festum.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      recordarme: [false]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      
      // Simular autenticación
      setTimeout(() => {
        const { email, password } = this.loginForm.value;
        
        // Credenciales demo
        if (email === 'admin@festum.com' && password === '123456') {
          this.snackBar.open('¡Bienvenido a Festum Admin!', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          // Simular guardado de token
          localStorage.setItem('auth_token', 'demo_token_123');
          
          this.router.navigate(['/dashboard']);
        } else {
          this.snackBar.open('Credenciales incorrectas', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
        
        this.loading = false;
      }, 1500);
    } else {
      this.snackBar.open('Por favor, completa todos los campos correctamente', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  loginDemo() {
    this.loginForm.patchValue({
      email: 'admin@festum.com',
      password: '123456'
    });
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }
}