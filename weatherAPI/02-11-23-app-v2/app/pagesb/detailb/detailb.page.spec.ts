import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailbPage } from './detailb.page';

describe('DetailbPage', () => {
  let component: DetailbPage;
  let fixture: ComponentFixture<DetailbPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
