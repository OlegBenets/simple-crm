import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditProductComponent } from './dialog-edit-product.component';
import { MatDialogRef } from '@angular/material/dialog';
import { appConfig } from '../app.config';

describe('DialogEditProductComponent', () => {
  let component: DialogEditProductComponent;
  let fixture: ComponentFixture<DialogEditProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditProductComponent],
      providers: [
        ...appConfig.providers,
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
