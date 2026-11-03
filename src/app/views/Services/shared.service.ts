import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
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

  isProfileCompleted = signal<boolean>(localStorage.getItem('isProfileCompleted') === 'true');
  isProfileVerified = signal<boolean>(localStorage.getItem('isProfileVerified') === 'true');
  isVehicleVerified = signal<boolean>(localStorage.getItem('isVehicleVerified') === 'true');
  isKycVerified = signal<boolean>(localStorage.getItem('isKycVerified') === 'true');

  updateVerificationStatus(data: any): void {
    if (data.isProfileCompleted !== undefined) {//|| data.isProfileCompleted !== null
      localStorage.setItem('isProfileCompleted',JSON.stringify(data.isProfileCompleted || data.IsProfileCompleted));
    }
    if (data.isProfileVerified !== undefined) {// || data.isProfileVerified !== null
      localStorage.setItem('isProfileVerified',JSON.stringify(data.isProfileVerified || data.IsProfileVerified));
    }
    if (data.isVehicleVerified !== undefined) {// || data.isVehicleVerified !== null
      localStorage.setItem('isVehicleVerified',JSON.stringify(data.isVehicleVerified || data.IsVehicleVerified));
    }
    if (data.isKycVerified !== undefined) {//  || data.isKycVerified !== null
      localStorage.setItem('isKycVerified',JSON.stringify(data.isKycVerified || data.isKycVerified));
    }
    this.isProfileCompleted.set(data.isProfileCompleted === true);
    this.isProfileVerified.set(data.isProfileVerified === true);
    this.isVehicleVerified.set(data.isVehicleVerified === true);
    this.isKycVerified.set(data.isKycVerified === true);
  }



  showOnboardModel = signal(false);

  openOnboardModel(): void {
    this.showOnboardModel.set(true);
  }

  closeOnboardModel(): void {
    this.showOnboardModel.set(false);
  }


  driverDetails = signal<any>(null);

  setDriverDetails(data: any): void {
    this.driverDetails.set(data);
  }

  clearDriverDetails(): void {
    this.driverDetails.set(null);
  }
  
}
