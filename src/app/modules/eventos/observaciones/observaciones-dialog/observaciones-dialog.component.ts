import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	MatDialogModule,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observation, ObservationStatus } from '../observaciones.component';

@Component({
	selector: 'app-observaciones-dialog',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatSelectModule,
		MatChipsModule,
	],
	templateUrl: './observaciones-dialog.component.html',
	styleUrl: './observaciones-dialog.component.scss',
})
export class ObservacionesDialogComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<ObservacionesDialogComponent>);
	private data = inject<Observation | null>(MAT_DIALOG_DATA);

	observationForm: FormGroup;
	tags = signal<string[]>([]);
	readonly separatorKeysCodes = [ENTER, COMMA] as const;

	readonly statusOptions = [
		{ value: ObservationStatus.PENDING, label: 'Pendiente', icon: 'schedule' },
		{
			value: ObservationStatus.IN_PROGRESS,
			label: 'En Progreso',
			icon: 'autorenew',
		},
		{
			value: ObservationStatus.RESOLVED,
			label: 'Resuelto',
			icon: 'check_circle',
		},
		{ value: ObservationStatus.INFO, label: 'Información', icon: 'info' },
	];

	isEditMode = signal<boolean>(false);

	constructor() {
		this.isEditMode.set(!!this.data);

		this.observationForm = this.fb.group({
			author: [
				this.data?.author || 'Usuario Actual',
				[Validators.required, Validators.minLength(3)],
			],
			text: [
				this.data?.text || '',
				[
					Validators.required,
					Validators.minLength(10),
					Validators.maxLength(1000),
				],
			],
			status: [
				this.data?.status || ObservationStatus.INFO,
				[Validators.required],
			],
		});

		if (this.data?.tags) {
			this.tags.set([...this.data.tags]);
		}
	}

	addTag(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		if (value && this.tags().length < 10) {
			this.tags.update((tags) => [...tags, value]);
		}

		if (event.chipInput) {
			event.chipInput.clear();
		}
	}

	removeTag(tag: string): void {
		this.tags.update((tags) => tags.filter((t) => t !== tag));
	}

	onSave(): void {
		if (this.observationForm.valid) {
			const result: Observation = {
				id: this.data?.id || 0,
				...this.observationForm.value,
				date: this.data?.date || new Date(),
				tags: this.tags(),
			};

			this.dialogRef.close(result);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	getCharacterCount(): string {
		const text = this.observationForm.get('text')?.value || '';
		return `${text.length}/1000`;
	}
}
