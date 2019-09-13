import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ShoppingCartService } from './shopping-cart.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFireDatabase, private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order){
  let result = await this.db.list('/orders').push(order);
  this.shoppingCartService.clearCart();
  return result;
  }

  getOrders() {
    return this.db.list("/orders").valueChanges();
  }

getOrdersByUser(userId: string) {
  return this.db.list('/orders',  ref => {
   return ref.equalTo(userId).orderByChild('userId');
  }).valueChanges();
    }
}




