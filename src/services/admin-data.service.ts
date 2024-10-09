import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, getDoc } from '@angular/fire/firestore';
import { Admin } from '../models/admin.class';
import { Auth } from '@angular/fire/auth';
import { browserSessionPersistence, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class AdminService implements OnDestroy{
  private firestore: Firestore = inject(Firestore);
  private firebaseAuth: Auth = inject(Auth);
  allAdmins: Admin[] = [];
  unsubAdminList;
  isAuthenticated = false;
  unsubAuthState;

  constructor(private router: Router) {
    this.unsubAdminList = this.subAdminList();
    // this.checkAuthStatus();
    this.unsubAuthState = this.initializeAuthStateListener();
  }

  private initializeAuthStateListener() {
    let auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user; 
      if (!this.isAuthenticated) {
        this.router.navigate(['/login']); 
      }
    });
  }

// private checkAuthStatus() {
//   let storedStatus = localStorage.getItem('isAuthenticated');
//   this.isAuthenticated = storedStatus === 'true';

//   if (!this.isAuthenticated) {
//     this.router.navigate(['/login']);
//   }
// }

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
      // this.updateAuthStatus(true);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    try {
      let auth = getAuth();
      await setPersistence(auth, browserSessionPersistence);
      let userCredential = await signInWithEmailAndPassword(auth, email, password);
      let userId = userCredential.user.uid;

      let adminDoc = await this.getAdminById(userId);
      // this.updateAuthStatus(true);
      return adminDoc ? adminDoc : null;
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async logOut(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
      // this.updateAuthStatus(false);
    } catch (err) {
      throw err;
    }
  }

  ngOnDestroy() {
    if (this.unsubAuthState) {
      this.unsubAuthState();
    }
    if (this.unsubAdminList) {
      this.unsubAdminList();
    }
  }

  // private updateAuthStatus(status: boolean) {
  //   this.isAuthenticated = status;
  //   // localStorage.setItem('isAuthenticated', status.toString());
  //   if (!status) {
  //     this.router.navigate(['/login']);
  //   }
  // }

  private getAdminRef() {
    return collection(this.firestore, 'admins');
  }

  private getSingleRef(userId: string) {
    return doc(this.firestore, `admins/${userId}`);
  }
}