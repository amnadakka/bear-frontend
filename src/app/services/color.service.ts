import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { Color } from '../models/color.interface';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private readonly API_URL = 'http://localhost:3000/color';
  
  private colorsSignal = signal<Color[]>([]);
  public colors = this.colorsSignal.asReadonly();
  
  public isLoading = signal(false);
  public error = signal<string | null>(null);
  private colorsLoaded = signal(false);

  constructor(private http: HttpClient) {}

  loadColors(): Observable<Color[]> {
    // If colors are already loaded, return them immediately
    if (this.colorsLoaded()) {
      return of(this.colors());
    }

    // If already loading, don't make another request
    if (this.isLoading()) {
      return of(this.colors());
    }

    this.isLoading.set(true);
    this.error.set(null);
    
    return this.http.get<Color[]>(this.API_URL).pipe(
      tap({
        next: (colors) => {
          this.colorsSignal.set(colors);
          this.colorsLoaded.set(true);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set('Failed to load colors');
          this.isLoading.set(false);
          console.error('Error loading colors:', error);
        }
      })
    );
  }

  getColorById(id: number): Color | undefined {
    return this.colors().find(color => color.id === id);
  }

  // Method to refresh colors if needed
  refreshColors(): Observable<Color[]> {
    this.colorsLoaded.set(false);
    return this.loadColors();
  }
}
