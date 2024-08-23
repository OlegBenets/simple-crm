import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, onSnapshot, getDoc } from '@angular/fire/firestore';
import { Admin } from './admin.class';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})

export class AdminService {
  private firestore: Firestore = inject(Firestore);
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

  async addAdmin(admin: Admin) {
    const salt = bcrypt.genSaltSync(10);
    admin.password = bcrypt.hashSync(admin.password, salt);

    await addDoc(this.getAdminRef(), admin.toJSON()).catch(
      (err) => {
        console.log(err);
      }
    );
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdminByEmail(email);
    if (admin && bcrypt.compareSync(password, admin.password)) {
      return admin;
    } else {
      return null;
    }
  }

  async getAdminByEmail(email: string): Promise<Admin | null> {
    const adminDoc = await getDoc(doc(this.getAdminRef(), email));
    if (adminDoc.exists()) {
      return new Admin({ id: adminDoc.id, ...adminDoc.data() });
    } else {
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