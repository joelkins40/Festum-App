import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Invitado } from './invitados-mock.service';

/**
 * Interface para los datos del diálogo
 */
export interface InvitadoDialogData {
	invitado?: Invitado;
	mode: 'create' | 'edit';
}

/**
 * Componente de diálogo para crear/editar invitados
 */
@Component({
	selector: 'app-invitado-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatCheckboxModule,
		MatIconModule,
		MatDividerModule,
	],
	templateUrl: './invitado-dialog.component.html',
	styleUrl: './invitado-dialog.component.scss',
})
export class InvitadoDialogComponent {
	// Dependency injection
	private readonly dialogRef = inject(MatDialogRef<InvitadoDialogComponent>);
	private readonly data = inject<InvitadoDialogData>(MAT_DIALOG_DATA);
	private readonly fb = inject(FormBuilder);

	// Formulario principal
	invitadoForm: FormGroup;

	// Propiedades del diálogo
	mode: 'create' | 'edit' = this.data.mode;
	dialogTitle = this.mode === 'create' ? 'Nuevo Invitado' : 'Editar Invitado';

	constructor() {
		this.invitadoForm = this.createForm();

		// Si estamos en modo edición, cargar los datos
		if (this.mode === 'edit' && this.data.invitado) {
			this.loadInvitadoData(this.data.invitado);
		}
	}

	/**
	 * Crea el formulario con validaciones
	 */
	private createForm(): FormGroup {
		return this.fb.group(
			{
				fullName: ['', [Validators.required, Validators.minLength(3)]],
				contactPhone: ['', [Validators.required]],
				secondaryContactPhone: [''],
				email: ['', [Validators.email]],
				numberOfCompanions: [0, [Validators.min(0)]],
				willAttend: [false],
			},
			{
				validators: this.atLeastOnePhoneValidator,
			},
		);
	}

	/**
	 * Validador personalizado: al menos un teléfono es requerido
	 */
	private atLeastOnePhoneValidator(
		group: FormGroup,
	): { [key: string]: boolean } | null {
		const contactPhone = group.get('contactPhone')?.value;
		const secondaryContactPhone = group.get('secondaryContactPhone')?.value;

		if (!contactPhone && !secondaryContactPhone) {
			return { atLeastOnePhone: true };
		}

		return null;
	}

	/**
	 * Carga los datos del invitado en el formulario
	 */
	private loadInvitadoData(invitado: Invitado): void {
		this.invitadoForm.patchValue({
			fullName: invitado.fullName,
			contactPhone: invitado.contactPhone,
			secondaryContactPhone: invitado.secondaryContactPhone || '',
			email: invitado.email || '',
			numberOfCompanions: invitado.numberOfCompanions,
			willAttend: invitado.willAttend,
		});
	}

	/**
	 * Construye el objeto Invitado desde el formulario
	 */
	private buildInvitadoFromForm(): Invitado {
		const formValue = this.invitadoForm.value;

		const invitado: Invitado = {
			id: this.data.invitado?.id || 0,
			fullName: formValue.fullName.trim(),
			contactPhone: formValue.contactPhone.trim(),
			numberOfCompanions: formValue.numberOfCompanions,
			willAttend: formValue.willAttend,
		};

		// Agregar campos opcionales solo si tienen valor
		if (formValue.secondaryContactPhone?.trim()) {
			invitado.secondaryContactPhone = formValue.secondaryContactPhone.trim();
		}

		if (formValue.email?.trim()) {
			invitado.email = formValue.email.trim();
		}

		return invitado;
	}

	/**
	 * Obtiene el mensaje de error para un campo
	 */
	getErrorMessage(fieldName: string): string {
		const field = this.invitadoForm.get(fieldName);
		if (!field) return '';

		if (field.hasError('required')) {
			return 'Este campo es requerido';
		}
		if (field.hasError('email')) {
			return 'Email inválido';
		}
		if (field.hasError('minlength')) {
			return `Mínimo ${field.getError('minlength').requiredLength} caracteres`;
		}
		if (field.hasError('min')) {
			return `Valor mínimo: ${field.getError('min').min}`;
		}
		return '';
	}

	/**
	 * Verifica si el formulario tiene el error de teléfono
	 */
	hasPhoneError(): boolean {
		return (
			!!this.invitadoForm.hasError('atLeastOnePhone') &&
			!!(
				this.invitadoForm.get('contactPhone')?.touched ||
				this.invitadoForm.get('secondaryContactPhone')?.touched
			)
		);
	}

	/**
	 * Guarda el invitado
	 */
	save(): void {
		if (this.invitadoForm.valid) {
			const invitado = this.buildInvitadoFromForm();
			this.dialogRef.close(invitado);
		} else {
			// Marcar todos los campos como touched para mostrar errores
			Object.keys(this.invitadoForm.controls).forEach((key) => {
				this.invitadoForm.get(key)?.markAsTouched();
			});
		}
	}

	/**
	 * Cancela y cierra el diálogo
	 */
	cancel(): void {
		this.dialogRef.close();
	}
}
