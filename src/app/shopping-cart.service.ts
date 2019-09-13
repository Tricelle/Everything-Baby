import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Product } from './models/product';
import { take, map } from 'rxjs/operators';
import { ShoppingCart } from './models/shopping-cart';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId)
    .snapshotChanges().pipe(map(x => {
      const value = x.payload.val() as any;

      if(value && value.items)
           return new ShoppingCart(value.items);
      else
           return new ShoppingCart({})
    }));

  }
  async addToCart(product: Product) {
    const cartId = await this.getOrCreateCartId();
    const item = this.getItem(cartId, product.key);
    item.snapshotChanges().pipe(take(1)).subscribe((i: any) => {
      if (i.payload.val()) {
        item.update({ product: product, quantity: i.payload.val().quantity + 1 });
      } else {
        item.set({ product: product, quantity: 1 });
      }
    });
  }

 async removeFromCart(product: Product) {
    const cartId = await this.getOrCreateCartId();
    const item = this.getItem(cartId, product.key);
    item.snapshotChanges().pipe(take(1)).subscribe((i: any) => {
      if (i.payload.val()) {
        let quantity = i.payload.val().quantity;

        if(quantity <= 1)
             item.remove();
        else
             item.update({ product: product, quantity: quantity- 1 });
      }
      else {
        item.set({ product: product, quantity: 1 });
      }
    });
  }

  async clearCart() {
     let cartId = await this.getOrCreateCartId();
     this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }


}
