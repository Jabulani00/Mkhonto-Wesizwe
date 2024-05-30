import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetDocPage } from './get-doc.page';

describe('GetDocPage', () => {
  let component: GetDocPage;
  let fixture: ComponentFixture<GetDocPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GetDocPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
