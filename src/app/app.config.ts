import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth} from '@angular/fire/auth';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
 
const firebaseConfig = {
  "projectId":"simple-crm-9eb57",
  "appId":"1:669849106640:web:05ac713a595cd2c1a306d5",
  "databaseURL":"https://simple-crm-9eb57-default-rtdb.europe-west1.firebasedatabase.app",
  "storageBucket":"simple-crm-9eb57.appspot.com",
  "apiKey":"AIzaSyBSekW5485bT7k6H44eXZeNYzoleSxvZ94",
  "authDomain":"simple-crm-9eb57.firebaseapp.com",
  "messagingSenderId":"669849106640"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(), 
    provideCharts(withDefaultRegisterables()),
      provideFirebaseApp(() => initializeApp(firebaseConfig)), 
      provideFirestore(() => getFirestore()),
      provideAuth(() => getAuth()),
  ]
};
