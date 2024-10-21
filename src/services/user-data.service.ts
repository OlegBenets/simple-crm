import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  user = new User();
  unsubUserList;

  /**
   * Constructor to initialize the UserService.
   * @param firestore The Firestore instance for database operations.
   */
  constructor(private firestore: Firestore) {
    this.unsubUserList = this.subUserList();
  }

  /**
   * Subscribes to the user list in Firestore and updates the local users array.
   * This method listens for real-time updates to the user collection.
   * @returns Unsubscribe function for the snapshot listener.
   */
  subUserList() {
    return onSnapshot(this.getUserRef(), (snapshot) => {
      this.allUsers = [];
      snapshot.forEach((doc) => {
        let user = new User({ ...doc.data(), id: doc.id });
        this.allUsers.push(user);
      });
      this.filteredUsers = this.allUsers;
    });
  }

  /**
   * Retrieves a single user document from Firestore by user ID.
   * @param userId The ID of the user to retrieve.
   * @returns A Promise that resolves to a User instance or a new User instance if not found.
   */
  async getSingleUser(userId: string) {
    const doc = await getDoc(this.getSingleDocRef(userId));
    if (doc.exists()) {
      return new User({ id: doc.id, ...doc.data() });
    } else {
      return new User();
    }
  }

  /**
   * Adds a new user to Firestore.
   * @param user The User instance to be added.
   */
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

  /**
   * Updates an existing user document in Firestore.
   * @param userId The ID of the user to update.
   * @param user The User instance containing updated data.
   */
  async updateUser(userId: string, user: User) {
    await updateDoc(this.getSingleDocRef(userId), user.toJSON()).catch(
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * Deletes a user document from Firestore by user ID.
   * @param userId The ID of the user to delete.
   */
  async deleteUser(userId: string) {
    await deleteDoc(this.getSingleDocRef(userId)).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Cleanup function to unsubscribe from Firestore listeners when the service is destroyed.
   */
  ngOnDestroy() {
    if (this.unsubUserList) {
      this.unsubUserList();
    }
  }

  /**
   * Retrieves a reference to the Firestore collection for users.
   * @returns A reference to the Firestore 'users' collection.
   */
  private getUserRef() {
    return collection(this.firestore, 'users');
  }

  /**
   * Retrieves a reference to a specific user document in Firestore.
   * @param userId The ID of the user document.
   * @returns A reference to the Firestore user document.
   */
  private getSingleDocRef(userId: string) {
    return doc(this.firestore, 'users', userId);
  }
}
