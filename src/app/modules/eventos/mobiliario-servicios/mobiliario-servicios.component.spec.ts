import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobiliarioServiciosComponent } from './mobiliario-servicios.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MobiliarioServiciosComponent', () => {
	let component: MobiliarioServiciosComponent;
	let fixture: ComponentFixture<MobiliarioServiciosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MobiliarioServiciosComponent, NoopAnimationsModule],
		}).compileComponents();

		fixture = TestBed.createComponent(MobiliarioServiciosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have initial items', () => {
		expect(component.items().length).toBeGreaterThan(0);
	});

	it('should calculate subtotal correctly', () => {
		const subtotal = component.subtotalGeneral();
		expect(subtotal).toBeGreaterThan(0);
	});

	it('should calculate IVA correctly', () => {
		const iva = component.iva();
		const expectedIva = component.subtotalGeneral() * 0.16;
		expect(iva).toBe(expectedIva);
	});

	it('should calculate total correctly', () => {
		const total = component.totalGeneral();
		const expectedTotal = component.subtotalGeneral() + component.iva();
		expect(total).toBe(expectedTotal);
	});

	it('should add item correctly', () => {
		const initialCount = component.items().length;
		const newItem = {
			id: 999,
			tipo: 'Mobiliario' as const,
			nombre: 'Test Item',
			descripcion: 'Test Description',
			cantidad: 10,
			precioUnitario: 100,
			subtotal: 1000,
			estado: 'Disponible' as const,
		};

		component.addItem(newItem);
		expect(component.items().length).toBe(initialCount + 1);
	});

	it('should delete item correctly', () => {
		const initialCount = component.items().length;
		const firstItemId = component.items()[0].id;

		component.deleteItem(firstItemId);
		expect(component.items().length).toBe(initialCount - 1);
	});

	it('should update quantity correctly', () => {
		const item = component.items()[0];
		const newQuantity = item.cantidad + 5;

		component.updateQuantity(item, newQuantity);

		const updatedItem = component.items().find((i) => i.id === item.id);
		expect(updatedItem?.cantidad).toBe(newQuantity);
		expect(updatedItem?.subtotal).toBe(newQuantity * item.precioUnitario);
	});

	it('should filter items by search term', () => {
		component.searchControl.setValue('Silla');
		const filtered = component.filteredItems();
		expect(filtered.length).toBeGreaterThan(0);
		expect(
			filtered.every(
				(item) =>
					item.nombre.toLowerCase().includes('silla') ||
					item.descripcion.toLowerCase().includes('silla'),
			),
		).toBeTruthy();
	});

	it('should filter items by tipo', () => {
		component.tipoControl.setValue('Mobiliario');
		const filtered = component.filteredItems();
		expect(filtered.every((item) => item.tipo === 'Mobiliario')).toBeTruthy();
	});

	it('should clear filters correctly', () => {
		component.searchControl.setValue('test');
		component.tipoControl.setValue('Mobiliario');
		component.estadoControl.setValue('Disponible');

		component.clearFilters();

		expect(component.searchControl.value).toBe('');
		expect(component.tipoControl.value).toBe('');
		expect(component.estadoControl.value).toBe('');
	});

	it('should format currency correctly', () => {
		const formatted = component.formatCurrency(1000);
		expect(formatted).toContain('1,000');
	});
});
