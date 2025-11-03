import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobiliarioServiciosDialogComponent } from './mobiliario-servicios-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MobiliarioServiciosDialogComponent', () => {
	let component: MobiliarioServiciosDialogComponent;
	let fixture: ComponentFixture<MobiliarioServiciosDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MobiliarioServiciosDialogComponent, NoopAnimationsModule],
			providers: [
				{ provide: MatDialogRef, useValue: { close: () => {} } },
				{ provide: MAT_DIALOG_DATA, useValue: null },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(MobiliarioServiciosDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize form with default values', () => {
		expect(component.itemForm).toBeDefined();
		expect(component.itemForm.get('tipo')).toBeDefined();
		expect(component.itemForm.get('nombre')).toBeDefined();
		expect(component.itemForm.get('descripcion')).toBeDefined();
		expect(component.itemForm.get('cantidad')).toBeDefined();
		expect(component.itemForm.get('precioUnitario')).toBeDefined();
		expect(component.itemForm.get('estado')).toBeDefined();
	});

	it('should validate required fields', () => {
		const form = component.itemForm;
		expect(form.valid).toBeFalsy();

		form.patchValue({
			tipo: 'Mobiliario',
			nombre: 'Test Item',
			descripcion: 'Test description with enough characters',
			cantidad: 10,
			precioUnitario: 100,
			estado: 'Disponible',
		});

		expect(form.valid).toBeTruthy();
	});

	it('should calculate subtotal correctly', () => {
		component.itemForm.patchValue({
			cantidad: 10,
			precioUnitario: 50,
		});

		expect(component.subtotalCalculado()).toBe(500);
	});

	it('should update subtotal when quantity changes', () => {
		component.itemForm.patchValue({
			cantidad: 5,
			precioUnitario: 100,
		});

		expect(component.subtotalCalculado()).toBe(500);

		component.itemForm.patchValue({
			cantidad: 10,
		});

		expect(component.subtotalCalculado()).toBe(1000);
	});

	it('should update subtotal when price changes', () => {
		component.itemForm.patchValue({
			cantidad: 10,
			precioUnitario: 50,
		});

		expect(component.subtotalCalculado()).toBe(500);

		component.itemForm.patchValue({
			precioUnitario: 100,
		});

		expect(component.subtotalCalculado()).toBe(1000);
	});

	it('should format currency correctly', () => {
		const formatted = component.formatCurrency(1000);
		expect(formatted).toContain('1,000');
	});

	it('should validate minimum quantity', () => {
		const cantidadControl = component.itemForm.get('cantidad');
		cantidadControl?.setValue(0);
		expect(cantidadControl?.hasError('min')).toBeTruthy();
	});

	it('should validate minimum price', () => {
		const precioControl = component.itemForm.get('precioUnitario');
		precioControl?.setValue(0);
		expect(precioControl?.hasError('min')).toBeTruthy();
	});
});
