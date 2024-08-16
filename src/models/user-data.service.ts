// import { Injectable, inject } from '@angular/core';
// import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
// import { User } from '../models/user.class';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   private firestore: Firestore = inject(Firestore);
//   allUsers: User[] = [];
//   filteredUsers: User[] = [];

//   async addUser(user: User): Promise<void> {
//     try {
//       const docRef = await addDoc(this.getUserRef(), user.toJSON());
//       console.log('User added with ID:', docRef.id);
//     } catch (err) {
//       console.error('Failed to add user:', err);
//     }
//   }

//   async updateUser(userId: string, user: User): Promise<void> {
//     try {
//       const docRef = this.getSingleDocRef(userId);
//       await updateDoc(docRef, user.toJSON());
//     } catch (err) {
//       console.error('Failed to update user:', err);
//     }
//   }

//   async deleteUser(userId: string): Promise<void> {
//     try {
//       await deleteDoc(this.getSingleDocRef(userId));
//       console.log(`User ${userId} deleted successfully.`);
//     } catch (err) {
//       console.error(`Failed to delete user ${userId}:`, err);
//     }
//   }

//   subUserList() {
//     return onSnapshot(this.getUserRef(), (list: any) => {
//       this.allUsers = [];
//       list.forEach((element: any) => {
//         let user = new User({...element.data(), id: element.id});
//         this.allUsers.push(user);
//       });
//       this.filteredUsers = this.allUsers;
//   });
// }

//   private getUserRef() {
//     return collection(this.firestore, 'users');
//   }

//   private getSingleDocRef(userId: string) {
//     return doc(this.getUserRef(), userId);
//   }
// }