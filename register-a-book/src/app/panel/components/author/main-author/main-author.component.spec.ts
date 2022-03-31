import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAuthorComponent } from './main-author.component';

describe('MainAuthorComponent', () => {
  let component: MainAuthorComponent;
  let fixture: ComponentFixture<MainAuthorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainAuthorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
