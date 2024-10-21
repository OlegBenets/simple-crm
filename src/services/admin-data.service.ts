import { Injectable, OnDestroy } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  getDoc,
} from '@angular/fire/firestore';
import { Admin } from '../models/admin.class';
import { Auth, User } from '@angular/fire/auth';
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminService implements OnDestroy {
  allAdmins: Admin[] = [];
  unsubAdminList;
  unsubRoute: any;
  isAuthenticated = false;
  currentUser: User | null = null;

  /**
   * Constructor to initialize the AdminService.
   *
   * @param router The Angular router instance for navigation.
   * @param firestore The Firestore instance for database operations.
   * @param firebaseAuth The Firebase Auth instance for authentication operations.
   */
  constructor(
    private router: Router,
    private firestore: Firestore,
    private firebaseAuth: Auth
  ) {
    this.unsubAdminList = this.subAdminList();
    this.trackRouteChanges();
    this.initializeAuthStateListener();
  }

  /**
   * Initializes the listener for authentication state changes.
   */
  private initializeAuthStateListener() {
    let auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.updateUserStatus(user);
      this.handleNavigation(user);
    });
  }

  /**
   * Updates the authentication status and current user.
   *
   * @param user The current user or null if not authenticated.
   */
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

  /**
   * Handles navigation based on user authentication status.
   *
   * @param user The current user or null if not authenticated.
   */
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

  /**
   * Tracks route changes and saves the last visited route.
   */
  private trackRouteChanges() {
    this.unsubRoute = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.urlAfterRedirects !== '/login') {
          localStorage.setItem('lastRoute', event.urlAfterRedirects);
        }
      }
    });
  }

  /**
   * Subscribes to the admin list in Firestore and updates the local admin list.
   *
   * @returns Unsubscribe function for the snapshot listener.
   */
  subAdminList() {
    return onSnapshot(this.getAdminRef(), (snapshot) => {
      this.allAdmins = [];
      snapshot.forEach((doc) => {
        let admin = new Admin({ ...doc.data(), id: doc.id });
        this.allAdmins.push(admin);
      });
    });
  }

  /**
   * Adds a new administrator to Firestore and creates a corresponding authentication user.
   *
   * @param admin The Admin object to be added.
   * @returns A promise that resolves when the admin is added.
   */
  async addAdmin(admin: Admin): Promise<void> {
    try {
      let userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        admin.email,
        admin.password
      );
      let userId = userCredential.user.uid;
      admin.id = userId;

      await setDoc(this.getSingleRef(userId), admin.toJSON());
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Validates an administrator's email and password for login.
   *
   * @param email The admin's email address.
   * @param password The admin's password.
   * @returns A promise that resolves to the Admin object if validation is successful, otherwise null.
   */
  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    let auth = getAuth();
    try {
      await setPersistence(auth, browserSessionPersistence);
      let userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
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

  /**
   * Retrieves an administrator's details by user ID.
   *
   * @param userId The ID of the user to retrieve.
   * @returns A promise that resolves to the Admin object if found, otherwise null.
   */
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

  /**
   * Logs out the currently authenticated administrator.
   *
   * @returns A promise that resolves when the logout is complete.
   */
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

  /**
   * Cleans up subscriptions when the service is destroyed.
   */
  ngOnDestroy() {
    if (this.unsubAdminList) {
      this.unsubAdminList();
    }

    if (this.unsubRoute) {
      this.unsubRoute.unsubscribe();
    }
  }

  /**
   * Resets the animation status in local storage.
   */
  resetAnimationStatus() {
    localStorage.removeItem('animationPlayed');
  }

  /**
   * Gets the Firestore reference for the admin collection.
   *
   * @returns The Firestore collection reference for admins.
   */
  private getAdminRef() {
    return collection(this.firestore, 'admins');
  }

  /**
   * Gets the Firestore reference for a single admin document by user ID.
   *
   * @param userId The ID of the user to retrieve the document reference for.
   * @returns The Firestore document reference for the specified admin.
   */
  private getSingleRef(userId: string) {
    return doc(this.firestore, `admins/${userId}`);
  }
}
