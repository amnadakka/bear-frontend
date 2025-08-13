import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BearService } from '../../services/bear.service';
import { ColorService } from '../../services/color.service';
import { CreateBearRequest, Bear } from '../../models/bear.interface';
import { BearIdentityComponent } from '../bear-identity/bear-identity.component';

@Component({
  selector: 'app-bear-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BearIdentityComponent],
  templateUrl: './bear-form.component.html',
  styleUrls: ['./bear-form.component.scss']
})
export class BearFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bearService = inject(BearService);
  private colorService = inject(ColorService);

  bearForm!: FormGroup;
  colors = this.colorService.colors;
  isLoading = this.colorService.isLoading;
  error = this.colorService.error;
  showSuccess = signal(false);
  
  // Bear identity section
  bearIdInput = signal('');
  fetchedBear = signal<Bear | null>(null);
  bearIdentityError = signal<string | null>(null);
  isFetchingBear = signal(false);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.bearForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      size: ['', [Validators.required, Validators.min(1)]],
      colorIds: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  onSubmit(): void {
    if (this.bearForm.valid) {
      const bearData: CreateBearRequest = this.bearForm.value;
      this.bearService.createBear(bearData).subscribe({
        next: () => {
          this.bearForm.reset();
          this.bearForm.patchValue({ colorIds: [] });
          this.showSuccessMessage();
        },
        error: (error) => {
          console.error('Error creating bear:', error);
        }
      });
    }
  }

  private showSuccessMessage(): void {
    this.showSuccess.set(true);
    setTimeout(() => {
      this.showSuccess.set(false);
    }, 3000);
  }

  get nameError(): string | null {
    const nameControl = this.bearForm.get('name');
    if (nameControl?.errors && nameControl.touched) {
      if (nameControl.errors['required']) return 'Name is required';
      if (nameControl.errors['minlength']) return 'Name must be at least 2 characters';
    }
    return null;
  }

  get sizeError(): string | null {
    const sizeControl = this.bearForm.get('size');
    if (sizeControl?.errors && sizeControl.touched) {
      if (sizeControl.errors['required']) return 'Size is required';
      if (sizeControl.errors['min']) return 'Size must be at least 1';
    }
    return null;
  }

  get colorError(): string | null {
    const colorControl = this.bearForm.get('colorIds');
    if (colorControl?.errors && colorControl.touched) {
      if (colorControl.errors['required']) return 'At least one color is required';
      if (colorControl.errors['minlength']) return 'At least one color is required';
    }
    return null;
  }

  toggleColor(colorId: number): void {
    const colorIdsControl = this.bearForm.get('colorIds');
    const currentColorIds = colorIdsControl?.value || [];
    
    if (currentColorIds.includes(colorId)) {
      const updatedColorIds = currentColorIds.filter((id: number) => id !== colorId);
      colorIdsControl?.setValue(updatedColorIds);
    } else {
      const updatedColorIds = [...currentColorIds, colorId];
      colorIdsControl?.setValue(updatedColorIds);
    }
  }

  selectAllColors(): void {
    const allColorIds = this.colors().map(color => color.id);
    this.bearForm.get('colorIds')?.setValue(allColorIds);
  }

  clearAllColors(): void {
    this.bearForm.get('colorIds')?.setValue([]);
  }

  getSelectedColorsCount(): number {
    return this.bearForm.get('colorIds')?.value?.length || 0;
  }

  getSelectedColorsNames(): string[] {
    const selectedColorIds = this.bearForm.get('colorIds')?.value || [];
    return this.colors()
      .filter(color => selectedColorIds.includes(color.id))
      .map(color => color.name);
  }

  trackByColorId(index: number, color: any): number {
    return color.id;
  }

  // Bear identity methods
  onBearIdInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.bearIdInput.set(target.value);
  }

  fetchBearById(): void {
    const bearId = parseInt(this.bearIdInput());
    
    if (!bearId || isNaN(bearId)) {
      this.bearIdentityError.set('Please enter a valid bear ID');
      this.fetchedBear.set(null);
      return;
    }

    this.isFetchingBear.set(true);
    this.bearIdentityError.set(null);
    this.fetchedBear.set(null);

    this.bearService.getBearById(bearId).subscribe({
      next: (bear) => {
        this.fetchedBear.set(bear);
        this.isFetchingBear.set(false);
      },
      error: (error) => {
        this.bearIdentityError.set('Bear not found or invalid ID');
        this.fetchedBear.set(null);
        this.isFetchingBear.set(false);
      }
    });
  }

  clearBearIdentity(): void {
    this.bearIdInput.set('');
    this.fetchedBear.set(null);
    this.bearIdentityError.set(null);
  }
}
