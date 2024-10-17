import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditDescriptionComponent } from './dialog-edit-description.component';
import { MatDialogRef } from '@angular/material/dialog';
import { appConfig } from '../app.config';

describe('DialogEditDescriptionComponent', () => {
  let component: DialogEditDescriptionComponent;
  let fixture: ComponentFixture<DialogEditDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditDescriptionComponent],
      providers: [
        ...appConfig.providers,
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogEditDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
