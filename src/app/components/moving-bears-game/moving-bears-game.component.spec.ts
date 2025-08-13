import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MovingBearsGameComponent } from './moving-bears-game.component';

describe('MovingBearsGameComponent', () => {
  let component: MovingBearsGameComponent;
  let fixture: ComponentFixture<MovingBearsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovingBearsGameComponent, HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MovingBearsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
