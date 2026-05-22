import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllServicesService } from '../../../../views/all-services.service';
import { SharedService } from '../../../../views/Services/shared.service';
import { CommonModule } from '@angular/common';
import { FormModule } from '@coreui/angular';

@Component({
  selector: 'app-vehicle-expiry',
  standalone: true,
  imports: [CommonModule,FormModule],
  templateUrl: './vehicle-expiry.component.html',
  styleUrl: './vehicle-expiry.component.scss'
})
export class VehicleExpiryComponent implements OnInit{

  vehicles = [
      {
        vehicleNo: 'MH 02 JM 2626',
        fitness: '07-02-2032',
        insurance: '07-02-2032',
        puc: '07-02-2032',
        permit: '07-02-2032',
        roadTax: '07-02-2032',
        other: '07-02-2032'
      },
      {
        vehicleNo: 'MH 02 JM 2626',
        fitness: '07-02-2032',
        insurance: '07-02-2032',
        puc: '07-02-2032',
        permit: '07-02-2032',
        roadTax: '07-02-2032',
        other: '07-02-2032'
      },
      {
        vehicleNo: 'MH 02 JM 2626',
        fitness: '07-02-2032',
        insurance: '07-02-2032',
        puc: '07-02-2032',
        permit: '07-02-2032',
        roadTax: '07-02-2032',
        other: '07-02-2032'
      },
      // {
      //   vehicleNo: 'MH 02 JM 2626',
      //   fitness: '07-02-2032',
      //   insurance: '07-02-2032',
      //   puc: '07-02-2032',
      //   permit: '07-02-2032',
      //   roadTax: '07-02-2032',
      //   other: '07-02-2032'
      // }
  ];

  constructor(private router: Router,private allService:AllServicesService,private sharedService: SharedService){
  
  }

  ngOnInit(): void {
    
  }

}
