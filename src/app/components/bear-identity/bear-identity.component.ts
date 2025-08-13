import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color } from '../../models/color.interface';

@Component({
  selector: 'app-bear-identity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bear-identity.component.html',
  styleUrls: ['./bear-identity.component.scss']
})
export class BearIdentityComponent {
  @Input() name: string = '';
  @Input() size: number = 0;
  @Input() color: Color | null = null;
}
