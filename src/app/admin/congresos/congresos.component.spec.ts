import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CongresosComponent } from './congresos.component';

describe('CongresosComponent', () => {
  let component: CongresosComponent;
  let fixture: ComponentFixture<CongresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CongresosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CongresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
