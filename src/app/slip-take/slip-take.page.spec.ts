import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlipTakePage } from './slip-take.page';

describe('SlipTakePage', () => {
  let component: SlipTakePage;
  let fixture: ComponentFixture<SlipTakePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SlipTakePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
