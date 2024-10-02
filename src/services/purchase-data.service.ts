import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Purchase } from '../models/purchase.class';
import { User } from '../models/user.class';
import { Product } from '../models/product.class';
import { addDoc, collection, getDocs, onSnapshot, updateDoc} from 'firebase/firestore';
import { UserService } from './user-data.service';
import { ProductDataService } from './product-data.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private firestore: Firestore = inject(Firestore);
  allPurchases: Purchase[] = [];
  unsubPurchaseList: any;   

  constructor(public userService: UserService, public productService: ProductDataService) {
    this.userService.subUserList();
    this.productService.subProductList();
    this.subPurchaseList(); 
  }

  async generateAndSavePurchaseForUser(user: User, multiple = false) {
    if (this.productService.allProducts.length === 0) {
      console.error('Keine Produkte verfügbar');
      return;
    }

    let purchases: Purchase[] = [];
    let numPurchases = multiple ? Math.floor(Math.random() * 5) + 1 : 1;

    for (let i = 0; i < numPurchases; i++) {
      let randomProduct = this.productService.allProducts[Math.floor(Math.random() * this.productService.allProducts.length)];
      let purchase = new Purchase({
        userId: user.id,
        productId: randomProduct.id,
        price: randomProduct.price,
        quantity: Math.floor(Math.random() * 10) + 1,
        purchaseDate: new Date()
      });
      purchases.push(purchase);
    }

    await this.savePurchases(purchases);
  }

  async savePurchases(purchases: Purchase[]) {
    for (let purchase of purchases) {
      try {
        const purchaseData = purchase.toJSON();
        let docRef = await addDoc(collection(this.firestore, 'purchases'), purchaseData);
        let generatedId = docRef.id;

        purchase.id = generatedId;
        await updateDoc(docRef, { id: generatedId });

        console.log('Kauf gespeichert mit ID:', docRef.id);
        this.allPurchases.push(purchase); 
      } catch (error) {
        console.error('Fehler beim Speichern des Kaufs:', error);
      }
    }
  }

  subPurchaseList() {
    let purchasesRef = collection(this.firestore, 'purchases');
    this.unsubPurchaseList = onSnapshot(purchasesRef, (snapshot) => {
      this.allPurchases = [];
      snapshot.forEach((doc) => {
        let purchase = new Purchase({ ...doc.data(), id: doc.id });
        this.allPurchases.push(purchase);
      });
      console.log('Aktualisierte Kauf-Liste:', this.allPurchases);
    });
  }


  ngOnDestroy() {
    if (this.unsubPurchaseList) {
      this.unsubPurchaseList();
    }
  }
}
