import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Product } from '../models/product.class';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private firestore: Firestore = inject(Firestore);
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  product = new Product();
  unsubProductList;

  constructor() {
    this.unsubProductList = this.subProductList();
  }

subProductList() {
    return onSnapshot(this.getProductRef(), (snapshot) => {
      this.allProducts = [];
      snapshot.forEach((doc) => {
        let product = new Product({...doc.data(), id: doc.id});
        this.allProducts.push(product);
      });
      this.filteredProducts = this.allProducts;
  });
}

async getSingleProduct(productId: string) {
    const doc = await getDoc(this.getSingleDocRef(productId));
      if (doc.exists()) {
        return new Product({ id: doc.id, ...doc.data() });
      } else {
        return new Product()
      }
    }

  async addProduct(product: Product) {
      await addDoc(this.getProductRef(), product.toJSON()).catch(
        (err) => {
        console.log(err);
      });
  }

  async updateProduct(productId: string, product: Product) {
      await updateDoc(this.getSingleDocRef(productId), product.toJSON()).catch(
        (err) => {
        console.log(err);
      });
    }

  async deleteProduct(productId: string) {
    await deleteDoc(this.getSingleDocRef(productId)).catch(
        (err) => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    this.unsubProductList();
  }

  private getProductRef() {
    return collection(this.firestore, 'products');
  }

  private getSingleDocRef(productId: string) {
    return doc(this.getProductRef(), productId);
  }
}
