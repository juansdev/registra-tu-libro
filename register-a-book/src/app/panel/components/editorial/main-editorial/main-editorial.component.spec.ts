import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainEditorialComponent } from './main-editorial.component';

describe('MainEditorialComponent', () => {
  let component: MainEditorialComponent;
  let fixture: ComponentFixture<MainEditorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainEditorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainEditorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
