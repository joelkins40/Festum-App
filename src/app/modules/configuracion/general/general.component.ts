import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface CompanyConfig {
	companyName: string;
	commercialName: string;
	rfc: string;
	email: string;
	phone: string;
	enableSystemNotifications: boolean;
	allowNewUserRegistration: boolean;
}

@Component({
	selector: 'app-general',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatDividerModule,
		MatCheckboxModule,
		MatSnackBarModule,
	],
	templateUrl: './general.component.html',
	styleUrl: './general.component.scss',
})
export class GeneralComponent implements OnInit {
	private fb = inject(FormBuilder);
	private snackBar = inject(MatSnackBar);

	configForm!: FormGroup;

	// Mock company configuration data
	companyConfig: CompanyConfig = {
		companyName: 'Festum S.A. de C.V.',
		commercialName: 'Festum',
		rfc: 'FSTM900101XX1',
		email: 'contacto@festum.mx',
		phone: '+52 222 123 4567',
		enableSystemNotifications: true,
		allowNewUserRegistration: false,
	};

	ngOnInit(): void {
		this.initializeForm();
	}

	private initializeForm(): void {
		this.configForm = this.fb.group({
			enableSystemNotifications: [this.companyConfig.enableSystemNotifications],
			allowNewUserRegistration: [this.companyConfig.allowNewUserRegistration],
		});
	}

	onUpdateConfiguration(): void {
		if (this.configForm.valid) {
			// Mock save operation - simulate backend call
			const updatedConfig = {
				...this.companyConfig,
				enableSystemNotifications:
					this.configForm.value.enableSystemNotifications,
				allowNewUserRegistration:
					this.configForm.value.allowNewUserRegistration,
			};

			// Simulate a delay for the save operation
			setTimeout(() => {
				this.companyConfig = updatedConfig;

				this.snackBar.open('Configuración actualizada exitosamente', 'Cerrar', {
					duration: 3000,
					horizontalPosition: 'end',
					verticalPosition: 'top',
					panelClass: ['success-snackbar'],
				});
			}, 500);
		}
	}

	onResetForm(): void {
		this.configForm.patchValue({
			enableSystemNotifications: this.companyConfig.enableSystemNotifications,
			allowNewUserRegistration: this.companyConfig.allowNewUserRegistration,
		});

		this.snackBar.open('Formulario restablecido', 'Cerrar', {
			duration: 2000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
		});
	}
}
