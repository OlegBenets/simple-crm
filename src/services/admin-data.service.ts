import { Injectable, OnDestroy } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, getDoc } from '@angular/fire/firestore';
import { Admin } from '../models/admin.class';
import { Auth, User } from '@angular/fire/auth';
import { browserSessionPersistence, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AdminService implements OnDestroy{
  allAdmins: Admin[] = [];
  unsubAdminList;
  unsubRoute: any;
  isAuthenticated = false;
  currentUser: User | null = null;

  constructor(private router: Router, private firestore: Firestore, private firebaseAuth: Auth) {
    this.unsubAdminList = this.subAdminList();
    this.trackRouteChanges();
    this.initializeAuthStateListener();
  }

private initializeAuthStateListener() {
  let auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    this.updateUserStatus(user);
    this.handleNavigation(user);
  });
}

private updateUserStatus(user: User | null) {
  if (user) {
    this.isAuthenticated = true;
    this.currentUser = user;
  } else {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem('lastRoute');
  }
}

private handleNavigation(user: User | null) {
  if (user) {
    let savedRoute = localStorage.getItem('lastRoute');
    if (savedRoute && savedRoute !== '/login') {
      this.router.navigate([savedRoute]); 
    } else {
      this.router.navigate(['/dashboard']);
    }
  } else {
    this.router.navigate(['/login']);
  }
}

private trackRouteChanges() {
  this.unsubRoute = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      if (event.urlAfterRedirects !== '/login') {
        localStorage.setItem('lastRoute', event.urlAfterRedirects);
      }
    }
  });
}

  subAdminList() {
    return onSnapshot(this.getAdminRef(), (snapshot) => {
      this.allAdmins = [];
      snapshot.forEach((doc) => {
        let admin = new Admin({...doc.data(), id: doc.id});
        this.allAdmins.push(admin);
      });
    });
  }

  async addAdmin(admin: Admin): Promise<void> {
    try {
      let userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, admin.email, admin.password);
      let userId = userCredential.user.uid;
      admin.id = userId;
  
      await setDoc(this.getSingleRef(userId), admin.toJSON()); 
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {  
    let auth = getAuth();
    try {
      await setPersistence(auth, browserSessionPersistence);
      let userCredential = await signInWithEmailAndPassword(auth, email, password);
      this.currentUser = userCredential.user;

      let userId = userCredential.user.uid;
      let adminDoc = await this.getAdminById(userId);

      if (adminDoc) {
        this.isAuthenticated = true; 
        return adminDoc;
      } else {
        this.isAuthenticated = false;
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getAdminById(userId: string): Promise<Admin | null> {
    try {
      let adminDoc = await getDoc(this.getSingleRef(userId));
      
      if (adminDoc.exists()) {
        return new Admin({ id: adminDoc.id, ...adminDoc.data() });
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async logOut(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
      this.isAuthenticated = false;
      this.currentUser = null;
      localStorage.removeItem('lastRoute'); 
    } catch (err) {
      throw err;
    }
  }

  ngOnDestroy() {
    if (this.unsubAdminList) {
      this.unsubAdminList();
    }

    if (this.unsubRoute) {
      this.unsubRoute.unsubscribe();
    }
  }

  resetAnimationStatus() {
    localStorage.removeItem('animationPlayed');
  }

  private getAdminRef() {
    return collection(this.firestore, 'admins');
  }

  private getSingleRef(userId: string) {
    return doc(this.firestore, `admins/${userId}`);
  }
}