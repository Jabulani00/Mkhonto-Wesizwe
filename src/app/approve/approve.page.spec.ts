import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovePage } from './approve.page';

describe('ApprovePage', () => {
  let component: ApprovePage;
  let fixture: ComponentFixture<ApprovePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
