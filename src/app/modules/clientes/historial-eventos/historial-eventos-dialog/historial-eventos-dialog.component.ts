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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventoHistorial } from '../../../../core/models/evento-historial.model';

export interface EventoDialogData {
	evento?: EventoHistorial;
	mode: 'create' | 'edit';
}

@Component({
	selector: 'app-historial-eventos-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatDatepickerModule,
		MatNativeDateModule,
	],
	templateUrl: './historial-eventos-dialog.component.html',
	styleUrl: './historial-eventos-dialog.component.scss',
})
export class HistorialEventosDialogComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<HistorialEventosDialogComponent>);
	data = inject<EventoDialogData>(MAT_DIALOG_DATA);

	eventoForm = this.fb.group({
		cliente: ['', [Validators.required, Validators.minLength(3)]],
		tipoEvento: ['', [Validators.required]],
		fechaEvento: [new Date(), [Validators.required]],
		lugar: ['', [Validators.required, Validators.minLength(3)]],
		montoTotal: [0, [Validators.min(0)]],
	});

	constructor() {
		if (this.data.mode === 'edit' && this.data.evento) {
			this.eventoForm.patchValue({
				cliente: this.data.evento.cliente,
				tipoEvento: this.data.evento.tipoEvento,
				fechaEvento: new Date(this.data.evento.fechaEvento),
				lugar: this.data.evento.lugar,
				montoTotal: this.data.evento.montoTotal ?? 0,
			});
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	onSubmit(): void {
		if (this.eventoForm.valid) {
			const formValue = this.eventoForm.value;

			const evento: Partial<EventoHistorial> = {
				cliente: formValue.cliente ?? '',
				tipoEvento: formValue.tipoEvento ?? '',
				fechaEvento: formValue.fechaEvento ?? new Date(),
				lugar: formValue.lugar ?? '',
				montoTotal: formValue.montoTotal ?? undefined,
			};

			if (this.data.mode === 'edit' && this.data.evento) {
				evento.id = this.data.evento.id;
			}

			this.dialogRef.close(evento);
		}
	}

	get isEditMode(): boolean {
		return this.data.mode === 'edit';
	}
}
