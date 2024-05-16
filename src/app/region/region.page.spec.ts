import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionPage } from './region.page';

describe('RegionPage', () => {
  let component: RegionPage;
  let fixture: ComponentFixture<RegionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
