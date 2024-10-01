import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, getDoc } from '@angular/fire/firestore';
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

async getSingleUser(userId: string) {
    const doc = await getDoc(this.getSingleDocRef(userId));
      if (doc.exists()) {
        return new User({ id: doc.id, ...doc.data() });
      } else {
        return new User()
      }
    }

  async addUser(user: User) {
    try {
     let userRef = await addDoc(this.getUserRef(), user.toJSON());
     let generatedId = userRef.id;
     
     user.id = generatedId;
     await updateDoc(userRef, { id: generatedId });
    } catch (err) {
        console.log(err);
    }
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
    if(this.unsubUserList) {
      this.unsubUserList();
    }
  }

  private getUserRef() {
    return collection(this.firestore, 'users');
  }

  private getSingleDocRef(userId: string) {
    return doc(this.getUserRef(), userId);
  }
}