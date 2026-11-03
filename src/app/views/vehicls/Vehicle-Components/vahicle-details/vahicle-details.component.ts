import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AllServicesService } from '../../../all-services.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-vahicle-details',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './vahicle-details.component.html',
  styleUrl: './vahicle-details.component.scss'
})
export class VahicleDetailsComponent implements OnInit {

  
    showValidateForm:boolean=false;

    vehicleData:any;
  
    constructor(private router: Router,private allService:AllServicesService,private sharedService: SharedService){
  
    }
  
    ngOnInit(): void {
   
    }

}
