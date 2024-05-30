import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadFilePage } from './upload-file.page';

describe('UploadFilePage', () => {
  let component: UploadFilePage;
  let fixture: ComponentFixture<UploadFilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
