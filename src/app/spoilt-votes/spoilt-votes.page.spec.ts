import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpoiltVotesPage } from './spoilt-votes.page';

describe('SpoiltVotesPage', () => {
  let component: SpoiltVotesPage;
  let fixture: ComponentFixture<SpoiltVotesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SpoiltVotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
