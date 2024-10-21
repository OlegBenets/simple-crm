import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { Product } from '../models/product.class';

@Injectable({
  providedIn: 'root',
})
export class ProductDataService {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  product = new Product();
  unsubProductList;

  /**
   * Constructor to initialize the ProductDataService.
   *
   * @param firestore The Firestore instance for database operations.
   */
  constructor(private firestore: Firestore) {
    this.unsubProductList = this.subProductList();
  }

  /**
   * Subscribes to the product list in Firestore and updates the local product arrays.
   *
   * @returns Unsubscribe function for the snapshot listener.
   */
  subProductList() {
    return onSnapshot(this.getProductRef(), (snapshot) => {
      this.allProducts = [];
      snapshot.forEach((doc) => {
        let product = new Product({ ...doc.data(), id: doc.id });
        this.allProducts.push(product);
      });
      this.filteredProducts = this.allProducts;
    });
  }

  /**
   * Retrieves a single product by its ID.
   *
   * @param productId The ID of the product to retrieve.
   * @returns A promise that resolves to the Product object if found, otherwise a new Product instance.
   */
  async getSingleProduct(productId: string) {
    const doc = await getDoc(this.getSingleDocRef(productId));
    if (doc.exists()) {
      return new Product({ id: doc.id, ...doc.data() });
    } else {
      return new Product();
    }
  }

  /**
   * Adds a new product to Firestore.
   *
   * @param product The Product object to be added.
   */
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

  /**
   * Updates an existing product in Firestore.
   *
   * @param productId The ID of the product to update.
   * @param product The Product object with updated details.
   */
  async updateProduct(productId: string, product: Product) {
    await updateDoc(this.getSingleDocRef(productId), product.toJSON()).catch(
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * Deletes a product from Firestore.
   *
   * @param productId The ID of the product to delete.
   */
  async deleteProduct(productId: string) {
    await deleteDoc(this.getSingleDocRef(productId)).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Cleans up subscriptions when the service is destroyed.
   */
  ngOnDestroy() {
    if (this.unsubProductList) {
      this.unsubProductList();
    }
  }

  /**
   * Gets the Firestore reference for the product collection.
   *
   * @returns The Firestore collection reference for products.
   */
  private getProductRef() {
    return collection(this.firestore, 'products');
  }

  /**
   * Gets the Firestore reference for a single product document by product ID.
   *
   * @param productId The ID of the product to retrieve the document reference for.
   * @returns The Firestore document reference for the specified product.
   */
  private getSingleDocRef(productId: string) {
    return doc(this.firestore, 'products', productId);
  }
}
