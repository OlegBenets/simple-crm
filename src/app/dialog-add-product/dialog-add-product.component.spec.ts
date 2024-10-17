import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddProductComponent } from './dialog-add-product.component';
import { MatDialogRef } from '@angular/material/dialog';
import { appConfig } from '../app.config';

describe('DialogAddProductComponent', () => {
  let component: DialogAddProductComponent;
  let fixture: ComponentFixture<DialogAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddProductComponent],
      providers: [
        ...appConfig.providers,
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
