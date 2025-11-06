import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

// Dialog Component
import {
	EditProfileDialogComponent,
	EditProfileDialogData,
} from './edit-profile-dialog/edit-profile-dialog.component';

export interface UserProfile {
	id: number;
	fullName: string;
	email: string;
	phone: string;
	role: string;
	joinDate: Date;
	lastLogin: Date;
	profilePicture: string;
}

export interface ActivityStats {
	totalEventsManaged: number;
	activeRentals: number;
	pendingTasks: number;
}

@Component({
	selector: 'app-perfil',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatButtonModule,
		MatIconModule,
		MatTooltipModule,
		MatDividerModule,
		MatChipsModule,
		MatDialogModule,
		MatSnackBarModule,
	],
	templateUrl: './perfil.component.html',
	styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
	userProfile!: UserProfile;
	activityStats!: ActivityStats;

	private readonly destroyRef = inject(DestroyRef);

	constructor(
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
	) {}

	ngOnInit(): void {
		this.loadUserProfile();
		this.loadActivityStats();
	}

	private loadUserProfile(): void {
		this.userProfile = {
			id: 1,
			fullName: 'Carlos Mendoza García',
			email: 'carlos.mendoza@festum.com',
			phone: '5512345678',
			role: 'Administrador General',
			joinDate: new Date('2023-03-15'),
			lastLogin: new Date(),
			profilePicture:
				'https://ui-avatars.com/api/?name=Carlos+Mendoza&size=200&background=20b2aa&color=fff&bold=true',
		};
	}

	private loadActivityStats(): void {
		this.activityStats = {
			totalEventsManaged: 142,
			activeRentals: 28,
			pendingTasks: 7,
		};
	}

	openEditDialog(): void {
		const dialogData: EditProfileDialogData = {
			fullName: this.userProfile.fullName,
			email: this.userProfile.email,
			phone: this.userProfile.phone,
			profilePicture: this.userProfile.profilePicture,
		};

		const dialogRef = this.dialog.open(EditProfileDialogComponent, {
			width: '600px',
			maxWidth: '95vw',
			disableClose: false,
			data: dialogData,
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result) => {
				if (result) {
					this.updateProfile(result);
				}
			});
	}

	private updateProfile(updatedData: Partial<UserProfile>): void {
		this.userProfile = {
			...this.userProfile,
			...updatedData,
		};

		this.showMessage('Profile updated successfully');
	}

	private showMessage(message: string): void {
		this.snackBar.open(message, 'Close', {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
		});
	}

	getTimeAgo(date: Date): string {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60)
			return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

		const diffHours = Math.floor(diffMins / 60);
		if (diffHours < 24)
			return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
	}
}
