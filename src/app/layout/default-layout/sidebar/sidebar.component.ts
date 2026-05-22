import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from 'src/app/views/Services/shared.service';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,MatMenuModule,MatButtonModule,RouterModule],
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

constructor(private router: Router,private sharedService:SharedService) {
  
}

ngOnInit(): void {
   this.isFlageEnable = String(localStorage.getItem('flag'));
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

  // CLOSE when clicking outside
  @HostListener('document:click')
  closeMenu() {
    this.activeMenu = null;
  }

logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
    //  this.sharedService.success("Logged Out Successfully!!")
    this.sharedService.success("You have been logged out successfully!");
  }


}
