import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Product } from '../models/product.class';

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  product = new Product();
  unsubProductList;

  constructor(private firestore: Firestore) {
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
    try {
      let productRef = await addDoc(this.getProductRef(), product.toJSON());
      let generatedId = productRef.id;

      product.id = generatedId;
      await updateDoc(productRef, { id: generatedId });
    } catch (err) {
      console.log(err);
    }
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
    if(this.unsubProductList) {
      this.unsubProductList();
    }
  }

  private getProductRef() {
    return collection(this.firestore, 'products');
  }

  private getSingleDocRef(productId: string) {
    return doc(this.firestore, 'users', productId);
  }
}
