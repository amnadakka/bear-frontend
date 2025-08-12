import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BearFormComponent } from './bear-form.component';
import { BearService } from '../../services/bear.service';
import { ColorService } from '../../services/color.service';
import { of, throwError } from 'rxjs';
import { Color } from '../../models/color.interface';
import { Bear } from '../../models/bear.interface';

describe('BearFormComponent', () => {
  let component: BearFormComponent;
  let fixture: ComponentFixture<BearFormComponent>;
  let bearService: jasmine.SpyObj<BearService>;
  let colorService: jasmine.SpyObj<ColorService>;

  const mockColors: Color[] = [
    { id: 1, name: 'Brown', hexa: '#8B4513' },
    { id: 2, name: 'Black', hexa: '#000000' }
  ];

  const mockBear: Bear = {
    id: 1,
    name: 'Teddy',
    size: 10,
    colors: [mockColors[0]]
  };

  beforeEach(async () => {
    const bearServiceSpy = jasmine.createSpyObj('BearService', ['createBear']);
    const colorServiceSpy = jasmine.createSpyObj('ColorService', ['loadColors']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: BearService, useValue: bearServiceSpy },
        { provide: ColorService, useValue: colorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BearFormComponent);
    component = fixture.componentInstance;
    bearService = TestBed.inject(BearService) as jasmine.SpyObj<BearService>;
    colorService = TestBed.inject(ColorService) as jasmine.SpyObj<ColorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    component.ngOnInit();
    
    expect(component.bearForm.get('name')?.value).toBe('');
    expect(component.bearForm.get('size')?.value).toBe('');
    expect(component.bearForm.get('colorIds')?.value).toEqual([]);
  });

  it('should load colors on init', () => {
    colorService.loadColors.and.returnValue(of(mockColors));
    
    component.ngOnInit();
    
    expect(colorService.loadColors).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    component.ngOnInit();
    
    expect(component.bearForm.valid).toBe(false);
    expect(component.bearForm.get('name')?.errors?.['required']).toBeTruthy();
    expect(component.bearForm.get('size')?.errors?.['required']).toBeTruthy();
    expect(component.bearForm.get('colorIds')?.errors?.['required']).toBeTruthy();
  });

  it('should validate name minimum length', () => {
    component.ngOnInit();
    const nameControl = component.bearForm.get('name');
    
    nameControl?.setValue('a');
    expect(nameControl?.errors?.['minlength']).toBeTruthy();
    
    nameControl?.setValue('ab');
    expect(nameControl?.errors?.['minlength']).toBeFalsy();
  });

  it('should validate size minimum value', () => {
    component.ngOnInit();
    const sizeControl = component.bearForm.get('size');
    
    sizeControl?.setValue(0);
    expect(sizeControl?.errors?.['min']).toBeTruthy();
    
    sizeControl?.setValue(1);
    expect(sizeControl?.errors?.['min']).toBeFalsy();
  });

  it('should create bear when form is valid', () => {
    component.ngOnInit();
    bearService.createBear.and.returnValue(of(mockBear));
    
    component.bearForm.patchValue({
      name: 'Teddy',
      size: 10,
      colorIds: [1]
    });
    
    component.onSubmit();
    
    expect(bearService.createBear).toHaveBeenCalledWith({
      name: 'Teddy',
      size: 10,
      colorIds: [1]
    });
  });

  it('should not create bear when form is invalid', () => {
    component.ngOnInit();
    
    component.onSubmit();
    
    expect(bearService.createBear).not.toHaveBeenCalled();
  });

  it('should reset form after successful bear creation', () => {
    component.ngOnInit();
    bearService.createBear.and.returnValue(of(mockBear));
    
    component.bearForm.patchValue({
      name: 'Teddy',
      size: 10,
      colorIds: [1]
    });
    
    component.onSubmit();
    
    expect(component.bearForm.get('name')?.value).toBe('');
    expect(component.bearForm.get('size')?.value).toBe('');
    expect(component.bearForm.get('colorIds')?.value).toEqual([]);
  });

  it('should toggle color selection', () => {
    component.ngOnInit();
    const colorIdsControl = component.bearForm.get('colorIds');
    
    // Add color
    component.toggleColor(1);
    expect(colorIdsControl?.value).toEqual([1]);
    
    // Remove color
    component.toggleColor(1);
    expect(colorIdsControl?.value).toEqual([]);
    
    // Add multiple colors
    component.toggleColor(1);
    component.toggleColor(2);
    expect(colorIdsControl?.value).toEqual([1, 2]);
  });

  it('should return correct error messages', () => {
    component.ngOnInit();
    const nameControl = component.bearForm.get('name');
    const sizeControl = component.bearForm.get('size');
    const colorControl = component.bearForm.get('colorIds');
    
    nameControl?.setValue('');
    nameControl?.markAsTouched();
    expect(component.nameError).toBe('Name is required');
    
    sizeControl?.setValue('');
    sizeControl?.markAsTouched();
    expect(component.sizeError).toBe('Size is required');
    
    colorControl?.setValue([]);
    colorControl?.markAsTouched();
    expect(component.colorError).toBe('At least one color is required');
  });
});
