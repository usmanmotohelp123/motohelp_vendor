import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private alertSubject = new Subject<any>();
  alertState = this.alertSubject.asObservable();

  private sidebar = new BehaviorSubject<boolean>(false);
  sidebar$ = this.sidebar.asObservable();

  constructor(private http: HttpClient) {}

  success(message: string) {
    this.alertSubject.next({ type: 'success', text: message });
  }

  error(message: string) {
    this.alertSubject.next({ type: 'error', text: message });
  }

  toggleSidebar() {
    this.sidebar.next(!this.sidebar.value);
  }

  closeSidebar() {
    this.sidebar.next(false);
  }
  
}
