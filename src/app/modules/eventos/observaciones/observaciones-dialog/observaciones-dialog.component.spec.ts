import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservacionesDialogComponent } from './observaciones-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ObservacionesDialogComponent', () => {
	let component: ObservacionesDialogComponent;
	let fixture: ComponentFixture<ObservacionesDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObservacionesDialogComponent, NoopAnimationsModule],
			providers: [
				{ provide: MatDialogRef, useValue: { close: () => {} } },
				{ provide: MAT_DIALOG_DATA, useValue: null },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ObservacionesDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should initialize form with default values', () => {
		expect(component.observationForm).toBeDefined();
		expect(component.observationForm.get('author')).toBeDefined();
		expect(component.observationForm.get('text')).toBeDefined();
		expect(component.observationForm.get('status')).toBeDefined();
	});

	it('should validate required fields', () => {
		const form = component.observationForm;
		expect(form.valid).toBeFalsy();

		form.patchValue({
			author: 'Test Author',
			text: 'This is a test observation with enough characters',
			status: 'INFO',
		});

		expect(form.valid).toBeTruthy();
	});

	it('should add tag', () => {
		const initialLength = component.tags().length;
		const mockEvent = {
			value: 'New Tag',
			chipInput: { clear: () => {} },
		};

		component.addTag(
			mockEvent as unknown as import('@angular/material/chips').MatChipInputEvent,
		);
		expect(component.tags().length).toBe(initialLength + 1);
	});

	it('should remove tag', () => {
		component.tags.set(['Tag1', 'Tag2']);
		component.removeTag('Tag1');
		expect(component.tags()).toEqual(['Tag2']);
	});
});
