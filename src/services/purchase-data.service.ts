import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Purchase } from '../models/purchase.class';
import { User } from '../models/user.class';
import { Product } from '../models/product.class';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private firestore: Firestore = inject(Firestore);

  constructor() { }

  async generateAndSavePurchases(user: User, products: Product[]) {
    let purchases: Purchase[] = this.generatePurchasesForUser(user, products);
    await this.savePurchases(purchases);
  }

  private generatePurchasesForUser(user: User, products: Product[]): Purchase[] {
    let purchases: Purchase[] = [];
    let numPurchases = Math.floor(Math.random() * 5) + 1; // 1 bis 5 Käufe

    for (let i = 0; i < numPurchases; i++) {
      let randomProduct = products[Math.floor(Math.random() * products.length)];
      let quantity = Math.floor(Math.random() * 10) + 1; // 1 bis 10 Produkte
      let purchase = new Purchase({
        userId: user.id,
        productId: randomProduct.id,
        price: randomProduct.price,
        quantity: quantity,
        purchaseDate: new Date() 
      });
      purchases.push(purchase);
    }

    return purchases;
  }

  private async savePurchases(purchases: Purchase[]) {
    for (let purchase of purchases) {
      try {
          const docRef = await addDoc(collection(this.firestore, 'purchases'), purchase.toJSON());
          console.log('Kauf gespeichert mit ID:', docRef.id); 
      } catch (error) {
          console.error('Fehler beim Speichern des Kaufs:', error);
      }
  }
  }

  async getPurchasesByUser(userId: string): Promise<Purchase[]> {
    const purchasesRef = collection(this.firestore, 'purchases');
    const q = query(purchasesRef, where('userId', '==', userId)); 
    const querySnapshot = await getDocs(q);

    let purchases: Purchase[] = [];
    querySnapshot.forEach((doc) => {
      let purchase = new Purchase({ ...doc.data(), id: doc.id });
      purchases.push(purchase);
    });
    return purchases;
  }
}
