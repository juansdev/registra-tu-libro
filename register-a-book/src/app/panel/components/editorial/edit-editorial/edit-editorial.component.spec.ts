import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEditorialComponent } from './edit-editorial.component';

describe('EditEditorialComponent', () => {
  let component: EditEditorialComponent;
  let fixture: ComponentFixture<EditEditorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEditorialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEditorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
