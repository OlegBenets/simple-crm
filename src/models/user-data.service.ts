import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private firestore: Firestore = inject(Firestore);
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  user = new User();
  unsubUserList;

  constructor() {
    this.unsubUserList = this.subUserList();
  }

subUserList() {
    return onSnapshot(this.getUserRef(), (snapshot) => {
      this.allUsers = [];
      snapshot.forEach((doc) => {
        let user = new User({...doc.data(), id: doc.id});
        this.allUsers.push(user);
      });
      this.filteredUsers = this.allUsers;
  });
}

getSingleUser(userId: string) {
    return onSnapshot(this.getSingleDocRef(userId), (doc) => {
      if (doc.exists()) {
        this.user = new User({ id: doc.id, ...doc.data() });
      } else {
        this.user = new User(); 
      }
    });
  }

  async addUser(user: User) {
      await addDoc(this.getUserRef(), user.toJSON()).catch(
        (err) => {
        console.log(err);
      });
  }

  async updateUser(userId: string, user: User) {
      await updateDoc(this.getSingleDocRef(userId), user.toJSON()).catch(
        (err) => {
        console.log(err);
      });
    }

  async deleteUser(userId: string) {
    await deleteDoc(this.getSingleDocRef(userId)).catch(
        (err) => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    this.unsubUserList();
  }

  private getUserRef() {
    return collection(this.firestore, 'users');
  }

  private getSingleDocRef(userId: string) {
    return doc(this.getUserRef(), userId);
  }
}