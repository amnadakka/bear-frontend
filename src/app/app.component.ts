import { Component, OnInit, inject } from '@angular/core';
import { BearFormComponent } from './components/bear-form/bear-form.component';
import { BearListComponent } from './components/bear-list/bear-list.component';
import { ColorService } from './services/color.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BearFormComponent, BearListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private colorService = inject(ColorService);

  ngOnInit(): void {
    // Load colors once at app initialization
    this.colorService.loadColors().subscribe();
  }
}
