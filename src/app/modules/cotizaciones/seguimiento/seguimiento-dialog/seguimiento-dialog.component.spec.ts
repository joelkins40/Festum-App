import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoDialogComponent } from './seguimiento-dialog.component';

describe('SeguimientoDialogComponent', () => {
	let component: SeguimientoDialogComponent;
	let fixture: ComponentFixture<SeguimientoDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SeguimientoDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SeguimientoDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
