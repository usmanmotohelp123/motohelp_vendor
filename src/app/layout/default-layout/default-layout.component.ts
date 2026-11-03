import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedService } from '../../views/Services/shared.service';

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    // SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    SidebarComponent,
    NavbarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DefaultLayoutComponent {
  public navItems = navItems;
  isSidebarOpen = false;

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

  @ViewChild('sidebar1', { static: false }) sidebar1Ref!: ElementRef;



  constructor(private dialog: MatDialog,private router:Router,public sharedService:SharedService,private cd: ChangeDetectorRef) {}

ngOnInit() {
   this.sharedService.sidebar$.subscribe(val => {
    console.log("sidebar received:", val); 
      // this.isOpen = val;
       this.cd.detectChanges();
    });
}

  // ngAfterViewInit(): void {
  //   const sidebarElement = this.sidebar1Ref?.nativeElement;

  //   if (sidebarElement) {
  //     this.checkSidebarState(); // initial state

  //     const observer = new MutationObserver(() => {
  //       this.checkSidebarState();
  //     });

  //     observer.observe(sidebarElement, {
  //       attributes: true,
  //       attributeFilter: ['class']
  //     });
  //   }
  // }

  // checkSidebarState() {
  //   const classes = this.sidebar1Ref.nativeElement.classList;
  //   this.isSidebarNarrow = classes.contains('c-sidebar-narrow');
  // }

  
isSidebarCollapsed = false;

toggleSidebar(): void {
  this.isSidebarCollapsed = !this.isSidebarCollapsed;
}






  
}
