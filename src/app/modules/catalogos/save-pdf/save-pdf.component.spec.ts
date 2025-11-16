import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavePdfComponent } from './save-pdf.component';

describe('SavePdfComponent', () => {
	let component: SavePdfComponent;
	let fixture: ComponentFixture<SavePdfComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SavePdfComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SavePdfComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
