import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Bear, CreateBearRequest } from '../models/bear.interface';

@Injectable({
  providedIn: 'root'
})
export class BearService {
  private readonly API_URL = 'http://localhost:3000/bear';
  
  private bearsSignal = signal<Bear[]>([]);
  public bears = this.bearsSignal.asReadonly();
  
  public isLoading = signal(false);
  public error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  loadBears(): Observable<Bear[]> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.get<Bear[]>(this.API_URL).pipe(
      tap({
        next: (bears) => {
          this.bearsSignal.set(bears);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set('Failed to load bears');
          this.isLoading.set(false);
          console.error('Error loading bears:', error);
        }
      })
    );
  }

  createBear(bearData: CreateBearRequest): Observable<Bear> {
    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.post<Bear>(this.API_URL, bearData).pipe(
      tap({
        next: (newBear) => {
          this.bearsSignal.update(bears => [...bears, newBear]);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set('Failed to create bear');
          this.isLoading.set(false);
          console.error('Error creating bear:', error);
        }
      })
    );
  }

  searchBearsByColors(colorIds: number[]): Observable<Bear[]> {
    this.isLoading.set(true);
    this.error.set(null);
    
    const params = new HttpParams().set('colorIds', colorIds.join(','));
    
    return this.http.get<Bear[]>(`${this.API_URL}/search`, { params }).pipe(
      tap({
        next: (bears) => {
          this.bearsSignal.set(bears);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set('Failed to search bears');
          this.isLoading.set(false);
          console.error('Error searching bears:', error);
        }
      })
    );
  }
}
