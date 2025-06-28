// import { Injectable, signal } from '@angular/core';
// import { Auth, signInAnonymously, onAuthStateChanged, User } from '@angular/fire/auth';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   user = signal<User | null>(null);

//   constructor(private auth: Auth) {
//     onAuthStateChanged(this.auth, (firebaseUser) => {
//       this.user.set(firebaseUser);
//     });
//     this.init();
//   }

//   async init() {
//     if (!this.auth.currentUser) {
//       await signInAnonymously(this.auth);
//     } else {
//       this.user.set(this.auth.currentUser);
//     }
//     console.log(this.auth.currentUser)
//   }
// }

import { inject, Injectable, signal } from '@angular/core';
import { Auth, signInAnonymously, onAuthStateChanged, User } from '@angular/fire/auth';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  user = signal<User | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => this.user.set(user));
    this.login();
  }

  async login() {
    if (!this.auth.currentUser) {
      await signInAnonymously(this.auth);
    }
    console.log("user",this.auth.currentUser)
  }
}
