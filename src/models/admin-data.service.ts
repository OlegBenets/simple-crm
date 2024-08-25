import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, onSnapshot, getDoc } from '@angular/fire/firestore';
import { Admin } from './admin.class';
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
    });
  }

  async addAdmin(admin: Admin): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.firebaseAuth, admin.email, admin.password);
      const userId = userCredential.user.uid;
      admin.id = userId;
  
      const adminRef = doc(this.firestore, `admins/${userId}`);
      await setDoc(adminRef, admin.toJSON()); 
    } catch (error) {
      console.error('Error adding admin: ', error);
    }
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
      const userId = userCredential.user.uid;

      const adminDoc = await this.getAdminById(userId);
      return adminDoc ? adminDoc : null;
    } catch (error) {
      console.error('Error validating admin: ', error);
      return null;
    }
  }

  async getAdminById(userId: string): Promise<Admin | null> {
    try {
      const adminRef = doc(this.firestore, `admins/${userId}`);
      const adminDoc = await getDoc(adminRef);
      
      if (adminDoc.exists()) {
        console.log('Admin data exists:', adminDoc.data());
        return new Admin({ id: adminDoc.id, ...adminDoc.data() });
      } else {
        console.log('No admin data found for this user.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching admin by ID: ', error);
      return null;
    }
  }


  ngOnDestroy() {
    this.unsubAdminList();
  }

  private getAdminRef() {
    return collection(this.firestore, 'admins');
  }
}