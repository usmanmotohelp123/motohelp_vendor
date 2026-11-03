import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, Input, Output, EventEmitter, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from 'src/app/views/Services/shared.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { AllServicesService } from 'src/app/views/all-services.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,FormsModule,MatMenuModule,MatButtonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{


  menuType: 'main' | 'driver' | 'vehicle' = 'main';
  isOpen = false;

  vehicleOpen = false;
  driverOpen = false;

 activeMenu: string | null = null;
 isFlageEnable: string = "N";

 @Input() collapsed = false;
 @Output() toggleSidebar = new EventEmitter<void>();
  isProfileCompleted: boolean = false;
  isKycVerified: any;

  // showOnboardModel = signal(false);

  onBoardId:any
  vendorId: any;
  vendorUserId: any;


  constructor(private router: Router,public sharedService:SharedService,private allServices: AllServicesService,) {
    
  }

  ngOnInit(): void {
    this.vendorId = String(localStorage.getItem('vendorId'));
     this.vendorUserId = String(localStorage.getItem('userId'));
    //  this.socketService.connect(this.vendorUserId!);
    this.isFlageEnable = String(localStorage.getItem('flag'));
    this.isProfileCompleted = JSON.parse(localStorage.getItem('isProfileCompleted') || 'false');
  }

  // openOnboardModel(): void {
  //   this.showOnboardModel.set(true);
  // }

  // closeOnboardModel(): void {
  //   this.showOnboardModel.set(false);
  // }


toggle(): void {
  this.toggleSidebar.emit();
}

openDriverMenu() {
  this.menuType = 'driver';
}

openVehicleMenu() {
  this.menuType = 'vehicle';
}

toggleVehicle() {
  this.vehicleOpen = !this.vehicleOpen;
}

toggleDriver() {
  this.driverOpen = !this.driverOpen;
}

goHomeMenu() {
  this.menuType = 'main';
  this.router.navigate(['/vendorDashboard'])
}

profile(){
  this.router.navigate(['/newRegisterDashboard'])
}



toggleMenu(menu: string, event: Event) {
    event.stopPropagation(); 
    this.activeMenu = this.activeMenu === menu ? null : menu;
}

//  // CLOSE when clicking outside
//  @HostListener('document:click')
//   closeMenu() {
//     this.activeMenu = null;
//  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {
    const target = event.target as HTMLElement;
    // Don't close if click happened inside sidebar
    if (target.closest('.sidebar')) {
      return;
    }
    this.activeMenu = null;
  }


   verifyDriver(): void {
    this.allServices.driverDetailsByScannerUID(this.vendorUserId,this.onBoardId).subscribe({
      next: (res: any) => {
        if (res.status === '00' && res.data) {
          this.sharedService.setDriverDetails(res.data);
          this.router.navigate(['/onboardDriver']);
          this.sharedService.closeOnboardModel()
        } else {
          this.sharedService.error(res.message);
        }
      },
      error: (err) => {
        console.error('Driver verification API error:', err);
        this.sharedService.error(
          err.error?.message || 'Something went wrong.'
        );
      }
    });
  }



logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
    //  this.sharedService.success("Logged Out Successfully!!")
    this.sharedService.success("You have been logged out successfully!");
  }




}
