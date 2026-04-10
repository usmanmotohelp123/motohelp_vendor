import { Component, OnInit,AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { CustomAlertComponent } from './layout/default-layout/Components/custom-alert/custom-alert.component';

@Component({
  selector: 'app-root',
  template: '<router-outlet /> <app-custom-alert></app-custom-alert>',
  standalone: true,
  imports: [RouterOutlet,CustomAlertComponent],
   styles: [`
    :host {
      background-color: white;
    }
  `]
})
export class AppComponent implements OnInit,AfterViewInit {
  title = 'MotoHelp Software';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService
  ) {
    this.titleService.setTitle(this.title);
    // iconSet singleton
    this.iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

  ngAfterViewInit(): void {  
    setTimeout(() => {
      const iframe = document
        .querySelector('df-messenger')
        ?.shadowRoot?.querySelector('iframe');

      const applyStyle = () => {
        const doc = iframe?.contentDocument || iframe?.contentWindow?.document;
        if (!doc) return;

        doc.head.insertAdjacentHTML('beforeend', `
          <style>
            .df-chat-wrapper {
              width: 200px !important;
              height: 300px !important;
            }
          </style>
        `);
      };

      iframe?.addEventListener('load', applyStyle);
    }, 1500);
  }
  
}
