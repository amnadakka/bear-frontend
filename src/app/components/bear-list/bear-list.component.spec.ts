import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { BearListComponent } from './bear-list.component';
import { BearService } from '../../services/bear.service';
import { ColorService } from '../../services/color.service';
import { of } from 'rxjs';
import { Color } from '../../models/color.interface';
import { Bear } from '../../models/bear.interface';

describe('BearListComponent', () => {
  let component: BearListComponent;
  let fixture: ComponentFixture<BearListComponent>;
  let bearService: jasmine.SpyObj<BearService>;
  let colorService: jasmine.SpyObj<ColorService>;

  const mockColors: Color[] = [
    { id: 1, name: 'Brown', hexa: '#8B4513' },
    { id: 2, name: 'Black', hexa: '#000000' }
  ];

  const mockBears: Bear[] = [
    { 
      id: 1, 
      name: 'Teddy', 
      size: 10, 
      colors: [mockColors[0]] 
    },
    { 
      id: 2, 
      name: 'Grizzly', 
      size: 25, 
      colors: [mockColors[1]] 
    }
  ];

  beforeEach(async () => {
    const bearServiceSpy = jasmine.createSpyObj('BearService', ['loadBears', 'searchBearsByColors'], {
      bears: signal(mockBears),
      isLoading: signal(false),
      error: signal(null)
    });
    const colorServiceSpy = jasmine.createSpyObj('ColorService', ['loadColors'], {
      colors: signal(mockColors)
    });

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: BearService, useValue: bearServiceSpy },
        { provide: ColorService, useValue: colorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BearListComponent);
    component = fixture.componentInstance;
    bearService = TestBed.inject(BearService) as jasmine.SpyObj<BearService>;
    colorService = TestBed.inject(ColorService) as jasmine.SpyObj<ColorService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load bears on init', () => {
    bearService.loadBears.and.returnValue(of(mockBears));
    
    component.ngOnInit();
    
    expect(bearService.loadBears).toHaveBeenCalled();
  });

  it('should filter bears by selected colors', () => {
    component.selectedColorIds.set([1]);
    
    const filteredBears = component.filteredBears();
    
    expect(filteredBears).toEqual([mockBears[0]]);
  });

  it('should return all bears when no colors are selected', () => {
    component.selectedColorIds.set([]);
    
    const filteredBears = component.filteredBears();
    
    expect(filteredBears).toEqual(mockBears);
  });

  it('should search bears by colors when color filter changes', () => {
    bearService.searchBearsByColors.and.returnValue(of([mockBears[0]]));
    
    component.onColorFilterChange([1]);
    
    expect(bearService.searchBearsByColors).toHaveBeenCalledWith([1]);
  });

  it('should load all bears when color filter is cleared', () => {
    bearService.loadBears.and.returnValue(of(mockBears));
    
    component.onColorFilterChange([]);
    
    expect(bearService.loadBears).toHaveBeenCalled();
  });

  it('should get color names as comma-separated string', () => {
    const bear: Bear = {
      id: 1,
      name: 'Multi-colored Bear',
      size: 15,
      colors: [mockColors[0], mockColors[1]]
    };
    
    const colorNames = component.getColorNames(bear);
    
    expect(colorNames).toBe('Brown, Black');
  });

  it('should handle bear with no colors', () => {
    const bear: Bear = {
      id: 1,
      name: 'Colorless Bear',
      size: 15,
      colors: []
    };
    
    const colorNames = component.getColorNames(bear);
    
    expect(colorNames).toBe('');
  });
});
