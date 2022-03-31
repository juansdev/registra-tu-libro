import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEditorialComponent } from './detail-editorial.component';

describe('DetailEditorialComponent', () => {
  let component: DetailEditorialComponent;
  let fixture: ComponentFixture<DetailEditorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEditorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailEditorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
