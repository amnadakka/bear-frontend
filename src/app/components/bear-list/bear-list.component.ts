import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BearService } from '../../services/bear.service';
import { ColorService } from '../../services/color.service';
import { Bear } from '../../models/bear.interface';

@Component({
  selector: 'app-bear-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bear-list.component.html',
  styleUrls: ['./bear-list.component.scss']
})
export class BearListComponent implements OnInit {
  private bearService = inject(BearService);
  private colorService = inject(ColorService);

  bears = this.bearService.bears;
  colors = this.colorService.colors;
  isLoading = this.bearService.isLoading;
  error = this.bearService.error;
  
  selectedColorIds = signal<number[]>([]);
  
  filteredBears = computed(() => {
    const selectedColors = this.selectedColorIds();
    if (selectedColors.length === 0) {
      return this.bears();
    }
    return this.bears().filter(bear => 
      bear.colors.some(color => selectedColors.includes(color.id))
    );
  });

  ngOnInit(): void {
    this.loadBears();
  }

  private loadBears(): void {
    this.bearService.loadBears().subscribe();
  }

  changeColorFilter(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const colorIds = target.value ? [Number(target.value)] : [];
    this.selectedColorIds.set(colorIds);
    if (colorIds.length > 0) {
      this.bearService.searchBearsByColors(colorIds).subscribe();
    } else {
      this.bearService.loadBears().subscribe();
    }
  }

  getColorNames(bear: Bear): string {
    return bear.colors.map(color => color.name).join(', ');
  }

  trackByBearId(index: number, bear: Bear): number {
    return bear.id;
  }

  trackByColorId(index: number, color: any): number {
    return color.id;
  }
}
