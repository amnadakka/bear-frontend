import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BearIdentityComponent } from './bear-identity.component';

describe('BearIdentityComponent', () => {
  let component: BearIdentityComponent;
  let fixture: ComponentFixture<BearIdentityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BearIdentityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BearIdentityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
