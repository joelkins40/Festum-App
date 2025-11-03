import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronogramaDialogComponent } from './cronograma-dialog.component';

describe('CronogramaDialogComponent', () => {
	let component: CronogramaDialogComponent;
	let fixture: ComponentFixture<CronogramaDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CronogramaDialogComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(CronogramaDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
