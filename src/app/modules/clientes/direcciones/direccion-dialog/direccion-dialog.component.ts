import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
} from '@angular/forms';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DireccionCliente } from '../direccion.model';

export interface DireccionDialogData {
	mode: 'create' | 'edit';
	direccion?: DireccionCliente;
}

@Component({
	selector: 'app-direccion-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
	],
	templateUrl: './direccion-dialog.component.html',
	styleUrl: './direccion-dialog.component.scss',
})
export class DireccionDialogComponent implements OnInit {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<DireccionDialogComponent>);
	private data = inject<DireccionDialogData>(MAT_DIALOG_DATA);

	form!: FormGroup;
	mode: 'create' | 'edit';
	saving = false;

	constructor() {
		this.mode = this.data.mode;
		this.initForm();
	}

	ngOnInit(): void {
		if (this.mode === 'edit' && this.data.direccion) {
			this.loadData();
		}
	}

	private initForm(): void {
		this.form = this.fb.group({
			id: [null],
			clienteId: [null, [Validators.required, Validators.min(1)]],
			cliente: ['', [Validators.required, Validators.minLength(2)]],
			fullAddress: ['', [Validators.required, Validators.minLength(10)]],
			street: ['', [Validators.required]],
			number: ['', [Validators.required]],
			neighborhood: ['', [Validators.required]],
			city: ['', [Validators.required]],
			state: ['', [Validators.required]],
			country: ['México', [Validators.required]],
			postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
		});
	}

	private loadData(): void {
		if (this.data.direccion) {
			this.form.patchValue(this.data.direccion);
		}
	}

	save(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.saving = true;
		setTimeout(() => {
			this.dialogRef.close(this.form.value);
		}, 300);
	}

	cancel(): void {
		this.dialogRef.close();
	}

	get title(): string {
		return this.mode === 'create' ? 'Nueva Dirección' : 'Editar Dirección';
	}

	get icon(): string {
		return this.mode === 'create' ? 'add_location' : 'edit_location';
	}
}
