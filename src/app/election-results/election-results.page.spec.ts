import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionResultsPage } from './election-results.page';

describe('ElectionResultsPage', () => {
  let component: ElectionResultsPage;
  let fixture: ComponentFixture<ElectionResultsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectionResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
