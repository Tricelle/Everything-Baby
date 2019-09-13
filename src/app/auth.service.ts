import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from './models/app-user';
import { UserService } from './user.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  user$: Observable<firebase.User>;

  constructor(private userService: UserService ,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private router: Router,) {
    this.user$ = afAuth.authState;

  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut()
    return this.router.navigate(['/login'])
  };


  get appUser$() : Observable<AppUser> {
    return this.user$
    .pipe(switchMap(user => {
       if (user) return this.userService.get(user.uid).valueChanges();
       return of(null);
    })

       )

  }
}
