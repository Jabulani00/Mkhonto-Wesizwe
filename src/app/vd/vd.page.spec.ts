import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VdPage } from './vd.page';

describe('VdPage', () => {
  let component: VdPage;
  let fixture: ComponentFixture<VdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
