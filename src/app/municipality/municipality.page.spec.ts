import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MunicipalityPage } from './municipality.page';

describe('MunicipalityPage', () => {
  let component: MunicipalityPage;
  let fixture: ComponentFixture<MunicipalityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MunicipalityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
