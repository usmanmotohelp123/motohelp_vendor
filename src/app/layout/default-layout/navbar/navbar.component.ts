import { Component,  Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/views/Services/shared.service';
import { NgClass } from "../../../../../node_modules/@angular/common/index";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() sidebarCollapsed = false;

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router,private sharedService:SharedService) {
    
  }
  
  ngOnInit(): void {
    
  }
  

    toggleMenu() {
      this.sharedService.toggleSidebar();
    }


    toggle(): void {
      this.toggleSidebar.emit();
    }

}
