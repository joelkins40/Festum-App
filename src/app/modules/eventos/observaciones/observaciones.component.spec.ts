import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservacionesComponent } from './observaciones.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ObservacionesComponent', () => {
	let component: ObservacionesComponent;
	let fixture: ComponentFixture<ObservacionesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObservacionesComponent, NoopAnimationsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ObservacionesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have initial observations', () => {
		expect(component.observations().length).toBeGreaterThan(0);
	});

	it('should add new observation', () => {
		const initialCount = component.observations().length;
		const newObservation = {
			id: 999,
			author: 'Test User',
			date: new Date(),
			text: 'Test observation text',
			status: component.observations()[0].status,
			tags: ['Test'],
		};

		component.addObservation(newObservation);
		expect(component.observations().length).toBe(initialCount + 1);
	});

	it('should delete observation', () => {
		const initialCount = component.observations().length;
		const firstObservationId = component.observations()[0].id;

		component.deleteObservation(firstObservationId);
		expect(component.observations().length).toBe(initialCount - 1);
	});

	it('should format date time correctly', () => {
		const now = new Date();
		const formatted = component.formatDateTime(now);
		expect(formatted).toContain('Hace');
	});
});
