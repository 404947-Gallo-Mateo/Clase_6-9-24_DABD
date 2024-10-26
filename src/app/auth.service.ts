import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(role:string){
    localStorage.setItem('role',role)
  }
  logout(){
    localStorage.removeItem('role')
  }
  getRole(){
    return localStorage.getItem('role')
  }
}
