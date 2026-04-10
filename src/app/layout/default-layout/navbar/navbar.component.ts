import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/views/Services/shared.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {


  constructor(private router: Router,private sharedService:SharedService) {
    
  }
  
  ngOnInit(): void {
    
  }
  

    toggleMenu() {
      this.sharedService.toggleSidebar();
    }
}
