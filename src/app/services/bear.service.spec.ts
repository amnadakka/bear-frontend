import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BearService } from './bear.service';
import { Bear, CreateBearRequest } from '../models/bear.interface';
import { Color } from '../models/color.interface';

describe('BearService', () => {
  let service: BearService;
  let httpMock: HttpTestingController;

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

  const mockCreateBearRequest: CreateBearRequest = {
    name: 'New Bear',
    size: 15,
    colorIds: [1, 2]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BearService]
    });
    service = TestBed.inject(BearService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load bears successfully', () => {
    service.loadBears().subscribe(bears => {
      expect(bears).toEqual(mockBears);
      expect(service.bears()).toEqual(mockBears);
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/bear');
    expect(req.request.method).toBe('GET');
    req.flush(mockBears);
  });

  it('should create bear successfully', () => {
    const newBear: Bear = { 
      id: 3, 
      name: 'New Bear', 
      size: 15, 
      colors: mockColors 
    };

    // Set initial bears
    (service as any).bearsSignal.set(mockBears);

    service.createBear(mockCreateBearRequest).subscribe(bear => {
      expect(bear).toEqual(newBear);
      expect(service.bears()).toContain(newBear);
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/bear');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCreateBearRequest);
    req.flush(newBear);
  });

  it('should search bears by colors successfully', () => {
    const colorIds = [1];
    const filteredBears = [mockBears[0]];

    service.searchBearsByColors(colorIds).subscribe(bears => {
      expect(bears).toEqual(filteredBears);
      expect(service.bears()).toEqual(filteredBears);
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/bear/search?colorIds=1');
    expect(req.request.method).toBe('GET');
    req.flush(filteredBears);
  });

  it('should handle error when loading bears fails', () => {
    service.loadBears().subscribe({
      error: () => {
        expect(service.isLoading()).toBe(false);
        expect(service.error()).toBe('Failed to load bears');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/bear');
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle error when creating bear fails', () => {
    service.createBear(mockCreateBearRequest).subscribe({
      error: () => {
        expect(service.isLoading()).toBe(false);
        expect(service.error()).toBe('Failed to create bear');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/bear');
    req.error(new ErrorEvent('Network error'));
  });
});
