import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingupPageComponent } from './singup-page.component';
import { Auth } from '@angular/fire/auth';
import { appConfig } from '../app.config';

describe('SingupPageComponent', () => {
  let component: SingupPageComponent;
  let fixture: ComponentFixture<SingupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingupPageComponent],
      providers: [
        ...appConfig.providers,
        {
          provide: Auth,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SingupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
