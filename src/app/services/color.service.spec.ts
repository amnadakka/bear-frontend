import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ColorService } from './color.service';
import { Color } from '../models/color.interface';

describe('ColorService', () => {
  let service: ColorService;
  let httpMock: HttpTestingController;

  const mockColors: Color[] = [
    { id: 1, name: 'Brown', hexa: '#8B4513' },
    { id: 2, name: 'Black', hexa: '#000000' },
    { id: 3, name: 'White', hexa: '#FFFFFF' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ColorService]
    });
    service = TestBed.inject(ColorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load colors successfully', () => {
    service.loadColors().subscribe(colors => {
      expect(colors).toEqual(mockColors);
      expect(service.colors()).toEqual(mockColors);
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/color');
    expect(req.request.method).toBe('GET');
    req.flush(mockColors);
  });

  it('should handle error when loading colors fails', () => {
    service.loadColors().subscribe({
      error: () => {
        expect(service.isLoading()).toBe(false);
        expect(service.error()).toBe('Failed to load colors');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/color');
    req.error(new ErrorEvent('Network error'));
  });

  it('should get color by id', () => {
    // Mock the private signal directly
    (service as any).colorsSignal.set(mockColors);
    
    const color = service.getColorById(2);
    expect(color).toEqual(mockColors[1]);
  });

  it('should return undefined for non-existent color id', () => {
    // Mock the private signal directly
    (service as any).colorsSignal.set(mockColors);
    
    const color = service.getColorById(999);
    expect(color).toBeUndefined();
  });
});
