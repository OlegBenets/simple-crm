import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, getDoc } from '@angular/fire/firestore';
import { Admin } from '../models/admin.class';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})

export class AdminService {
  private firestore: Firestore = inject(Firestore);
  private firebaseAuth: Auth = inject(Auth);
  allAdmins: Admin[] = [];
  unsubAdminList;

  constructor() {
    this.unsubAdminList = this.subAdminList();
  }

  subAdminList() {
    return onSnapshot(this.getAdminRef(), (snapshot) => {
      this.allAdmins = [];
      snapshot.forEach((doc) => {
        let admin = new Admin({...doc.data(), id: doc.id});
        this.allAdmins.push(admin);
      });
      console.log('Admin list updated:', this.allAdmins);
    });
  }


  async addAdmin(admin: Admin): Promise<void> {
    try {
      let userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, admin.email, admin.password);
      let userId = userCredential.user.uid;
      admin.id = userId;
  
      await setDoc(this.getSingleRef(userId), admin.toJSON()); 
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    try {
      let userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      let userId = userCredential.user.uid;

      let adminDoc = await this.getAdminById(userId);
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
        console.log('Admin data exists:', adminDoc.data());
        return new Admin({ id: adminDoc.id, ...adminDoc.data() });
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  ngOnDestroy() {
    this.unsubAdminList();
  }

  private getAdminRef() {
    return collection(this.firestore, 'admins');
  }

  private getSingleRef(userId: string) {
    return doc(this.firestore, `admins/${userId}`);
  }
}