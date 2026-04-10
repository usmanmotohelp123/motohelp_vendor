import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/views/Services/shared.service';

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-alert.component.html',
  styleUrl: './custom-alert.component.scss'
})
export class CustomAlertComponent implements OnInit, OnDestroy {

  message: any;
  private subscription: Subscription | undefined;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    this.subscription = this.sharedService.alertState.subscribe((message: any) => {
      this.message = message;

      // Automatically hide the alert after 3 seconds
    setTimeout(() => {
        this.message = null;
      }, 3000);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get cssClass() {
    if (!this.message) {
      return;
    }

    return {
      'alert-success': this.message.type === 'success',
      'alert-error': this.message.type === 'error'
    };
  }

  get iconClass() {
    if (!this.message) {
      return '';
    }

    return this.message.type === 'success' ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }
  
}
