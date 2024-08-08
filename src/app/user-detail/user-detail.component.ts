import { Component, inject } from '@angular/core';
import { collection, doc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.class';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent {
  firestore: Firestore = inject(Firestore);
  userId = '';
  user = new User();

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe( paramMap => {
      this.userId = paramMap.get('id') || '';
      console.log('got', this.userId);

      this.getUser();
    })
  }

  getUser() {
    onSnapshot(this.getSingleDocRef(), (doc) => {
      if (doc.exists()) {
        this.user = new User({ id: doc.id, ...doc.data() });
        console.log('User data:', this.user);
      } else {
        console.log('No such document!');
        this.user = new User(); 
      }
    });
  }

  getSingleDocRef() {
    return doc(collection(this.firestore, 'users'), this.userId);
  }
}