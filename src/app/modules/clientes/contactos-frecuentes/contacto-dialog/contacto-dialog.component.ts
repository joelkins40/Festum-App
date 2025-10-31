import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
	MatDialogModule,
	MAT_DIALOG_DATA,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Contacto } from '../../../../core/models/contacto.model';

export interface ContactoDialogData {
	contacto?: Contacto;
	mode: 'create' | 'edit';
}

@Component({
	selector: 'app-contacto-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatCheckboxModule,
	],
	templateUrl: './contacto-dialog.component.html',
	styleUrl: './contacto-dialog.component.scss',
})
export class ContactoDialogComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<ContactoDialogComponent>);
	data = inject<ContactoDialogData>(MAT_DIALOG_DATA);

	contactoForm = this.fb.group({
		nombre: ['', [Validators.required, Validators.minLength(3)]],
		phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
		email: ['', [Validators.required, Validators.email]],
		contactoAlternativo: [''],
		clientePreferente: [false],
	});

	constructor() {
		if (this.data.mode === 'edit' && this.data.contacto) {
			this.contactoForm.patchValue({
				nombre: this.data.contacto.nombre,
				phone: this.data.contacto.informacionDeContacto.phone,
				email: this.data.contacto.informacionDeContacto.email,
				contactoAlternativo:
					this.data.contacto.informacionDeContacto.contactoAlternativo || '',
				clientePreferente: this.data.contacto.clientePreferente,
			});
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSubmit(): void {
		if (this.contactoForm.valid) {
			const formValue = this.contactoForm.value;

			const contacto: Partial<Contacto> = {
				nombre: formValue.nombre ?? '',
				informacionDeContacto: {
					phone: formValue.phone ?? '',
					email: formValue.email ?? '',
					contactoAlternativo: formValue.contactoAlternativo || undefined,
				},
				clientePreferente: formValue.clientePreferente ?? false,
			};

			if (this.data.mode === 'edit' && this.data.contacto) {
				contacto.id = this.data.contacto.id;
			}

			this.dialogRef.close(contacto);
		}
	}

	get isEditMode(): boolean {
		return this.data.mode === 'edit';
	}
}
