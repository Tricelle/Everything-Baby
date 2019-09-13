import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list('/categories', (ref) => {
      return ref.orderByChild('name');
      }).valueChanges();
  }
}

// function(ref) {
//   return ref.orderByChild('name');
// }

// (ref) => {
//   return ref.orderByChild('name');
//   }

//   ref => {
//     return ref.orderByChild('name');
//     }
