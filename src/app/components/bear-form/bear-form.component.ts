import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BearService } from '../../services/bear.service';
import { ColorService } from '../../services/color.service';
import { CreateBearRequest } from '../../models/bear.interface';

@Component({
  selector: 'app-bear-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  trackByColorId(index: number, color: any): number {
    return color.id;
  }
}
