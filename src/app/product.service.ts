import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) {

  }

  create(product){
    return this.db.list('/products').push(product);
  }

  get(productId): Observable<any> {
    return this.db.object('/products/' + productId).snapshotChanges().pipe(map(action => {
      const $key = action.payload.key;
      return { $key, ...action.payload.val() };
    }));
  }

  getAll(): Observable<any[]>{
    return this.db.list('/products').snapshotChanges().pipe(map(actions => {
      return actions.map(action => ({ key: action.key, ...action.payload.val() }));
    }))
  }

  update(productId, product) {
   return this.db.object('/products/' + productId).update(product);
  }

  delete(productId){
    return this.db.object('/products/' + productId).remove();
  }
}
