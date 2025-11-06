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
import { MatIconModule } from '@angular/material/icon';

export interface EditProfileDialogData {
	fullName: string;
	email: string;
	phone: string;
	profilePicture: string;
}

@Component({
	selector: 'app-edit-profile-dialog',
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
	templateUrl: './edit-profile-dialog.component.html',
	styleUrls: ['./edit-profile-dialog.component.scss'],
})
export class EditProfileDialogComponent {
	private fb = inject(FormBuilder);
	private dialogRef = inject(MatDialogRef<EditProfileDialogComponent>);
	data = inject<EditProfileDialogData>(MAT_DIALOG_DATA);

	profileForm: FormGroup;

	constructor() {
		this.profileForm = this.initializeForm();
	}

	private initializeForm(): FormGroup {
		return this.fb.group({
			fullName: [
				this.data.fullName,
				[
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(100),
				],
			],
			email: [
				this.data.email,
				[Validators.required, Validators.email, Validators.maxLength(100)],
			],
			phone: [
				this.data.phone,
				[
					Validators.required,
					Validators.pattern(/^[0-9]{10}$/),
					Validators.minLength(10),
					Validators.maxLength(10),
				],
			],
			profilePicture: [
				this.data.profilePicture,
				[Validators.required, Validators.pattern(/^https?:\/\/.+/)],
			],
		});
	}

	onSave(): void {
		if (this.profileForm.valid) {
			this.dialogRef.close(this.profileForm.value);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

	// Getters for form controls
	get fullName() {
		return this.profileForm.get('fullName');
	}

	get email() {
		return this.profileForm.get('email');
	}

	get phone() {
		return this.profileForm.get('phone');
	}

	get profilePicture() {
		return this.profileForm.get('profilePicture');
	}
}
