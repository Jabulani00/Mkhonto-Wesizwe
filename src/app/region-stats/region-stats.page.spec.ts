import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegionStatsPage } from './region-stats.page';

describe('RegionStatsPage', () => {
  let component: RegionStatsPage;
  let fixture: ComponentFixture<RegionStatsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
