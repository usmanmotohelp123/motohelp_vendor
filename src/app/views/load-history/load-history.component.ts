import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AllServicesService } from '../all-services.service';
import { SharedService } from '../Services/shared.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';


@Component({
  selector: 'app-load-history',
  standalone: true,
  imports: [CommonModule,MatTableModule, MatFormFieldModule, MatSelectModule,MatInputModule,MatProgressBarModule, MatTabsModule],
  templateUrl: './load-history.component.html',
  styleUrl: './load-history.component.scss'
})
export class LoadHistoryComponent implements OnInit {



//   getStatusClass(status: string): string {
//     switch (status) {
//       case 'Active': return 'border-success';
//       case 'Pending': return 'border-warning';
//       case 'Completed': return 'border-primary';
//       default: return 'border-secondary';
//     }
//   }
  
//   getBadgeClass(status: string): string {
//     switch (status) {
//       case 'Active': return 'bg-success';
//       case 'Pending': return 'bg-warning text-dark';
//       case 'Completed': return 'bg-primary';
//       default: return 'bg-secondary';
//     }
//   }
  

// selectedStatus: string = 'All';

// shipments = [
//   {
//     from: 'Miami, FL',
//     to: 'Seattle, WA',
//     trackingId: '2023-0567',
//     distance: 4372,
//     truckType: 'Refrigerated',
//     weight: '22,000',
//     contents: 'Perishable Goods',
//     views: 128,
//     status: 'Active'
//   },
//   {
//     from: 'Chicago, IL',
//     to: 'Houston, TX',
//     trackingId: '2023-0789',
//     distance: 1743,
//     truckType: 'Flatbed',
//     weight: '45,000',
//     contents: 'Construction Materials',
//     views: 95,
//     status: 'Pending'
//   },
//   {
//     from: 'Chicago, IL',
//     to: 'Houston, TX',
//     trackingId: '2023-0789',
//     distance: 1743,
//     truckType: 'Flatbed',
//     weight: '45,000',
//     contents: 'Construction Materials',
//     views: 95,
//     status: 'Completed'
//   },
//   {
//     from: 'Chicago, IL',
//     to: 'Houston, TX',
//     trackingId: '2023-0789',
//     distance: 1743,
//     truckType: 'Flatbed',
//     weight: '45,000',
//     contents: 'Construction Materials',
//     views: 95,
//     status: 'Completed'
//   }
// ];

// filteredShipments = [...this.shipments];

// filterByStatus(status: string) {
//   this.selectedStatus = status;

//   if (status === 'All') {
//     this.filteredShipments = [...this.shipments];
//   } else {
//     this.filteredShipments = this.shipments.filter(
//       shipment => shipment.status === status
//     );
//   }
// }


  customerID: any;
  contactPerson: any;
  companyName: any;
  emailID: any;
  contactNo: any;
  isLoading:boolean = false;

  dataSource = new MatTableDataSource<any>([]);
  // displayedColumns: string[] = ['loadPostId', 'customerId']; verification_code
  displayedColumns: string[] = [
      'LoadPostID',
      'CustomerID',
      'Origin',
      'Destination',
      'VehicleType',
      'Weight',
      'Approximate_weight',
      'CargoContent',
      'CargoPackageType',
      'trip_status',
      'PostInsertDate',
      'ExpectedAvailableTime'
    ];



  constructor(private dialog: MatDialog, private allServices: AllServicesService,private sharedService:SharedService) {  
  
  
  }

ngOnInit(): void {

    this.customerID = localStorage.getItem('CustomerID');
    this.companyName = localStorage.getItem('CompanyName');
    this.contactPerson = localStorage.getItem('ContactPerson');
    this.emailID = localStorage.getItem('EmailID');
    this.contactNo = localStorage.getItem('ContactNo');
    const mpinFlag = localStorage.getItem('MPIN_Flag');

    this.loadData('all');

  }
 

// getLoadPost(){

//     const payload = {
//         CustomerID: this.customerID,
//         LoadPostID:""  
//     }

//     this.allServices.getCustomerLoadPost(payload).subscribe({
//     next: (res: any) => {
//           console.log(res);
//           if (res.status === '00') {
             
//             }
//           else{
//               this.sharedService.error(res.message);
//             }
//            },
//           error: (err) => {
//                 console.error(err);
//                  this.sharedService.error(err);
//             }
//           });


//      }


// getProcessTrip(){

//     const payload = {
//         CustomerID: this.customerID,
//         LoadPostID:""  
//     }

//     this.allServices.getCustomerProcessTrip(payload).subscribe({
//     next: (res: any) => {
//           console.log(res);
//           if (res.status === '00') {
             
//             }
//           else{
//               this.sharedService.error(res.message);
//             }
//            },
//           error: (err) => {
//                 console.error(err);
//                 this.sharedService.error(err);
//             }
//           });


//      }


//   getActiveTrip(){

//     const payload = {
//         CustomerID: this.customerID,
//         LoadPostID:"LP852523"  
//     }

//     this.allServices.getCustomerActiveTrip(payload).subscribe({
//     next: (res: any) => {
//           console.log(res);
//           if (res.status === '00') {
             
//             }
//           else{
//               this.sharedService.error(res.message);
//             }
//            },
//           error: (err) => {
//                 console.error(err);
//                 this.sharedService.error(err);
//             }
//           });


//      }


// getCompletedTrip(){

//     const payload = {
//         CustomerID: this.customerID,
//         LoadPostID:""  //LP852523
//     }

//     this.allServices.getCustomerCompletedTrip(payload).subscribe({
//     next: (res: any) => {
//           console.log(res);
//           if (res.status === '00') {
             
//             }
//           else{
//               this.sharedService.error(res.message);
//             }
//            },
//           error: (err) => {
//                 console.error(err);
//                 this.sharedService.error(err);
//             }
//           });


//      }


onTabChange(e: any) {
  const idx = e.index;
  if (idx === 0) this.loadData('all');
  else if (idx === 1) this.loadData('processed');
  else if (idx === 2) this.loadData('active');
  else if (idx === 3) this.loadData('completed');
}


onStatusChange(status: string) {
  this.loadData(status);
}



loadData(status: string) {
    this.isLoading = true;
    const payload = {
      CustomerID: this.customerID,
      LoadPostID: '' 
    };

    let apiCall:any;

    switch (status) {
      case 'all':
        apiCall = this.allServices.getCustomerLoadPost(payload);
        break;
      case 'processed':
        apiCall = this.allServices.getCustomerProcessTrip(payload);
        break;
      case 'active':
        payload.LoadPostID = 'LP852523'; 
        apiCall = this.allServices.getCustomerActiveTrip(payload);
        break;
      case 'completed':
        payload.LoadPostID = 'LP852523'; 
        apiCall = this.allServices.getCustomerCompletedTrip(payload);
        break;
    }

  apiCall.subscribe({
      next: (res: any) => {
        if (res.status === '00') {
          this.dataSource.data = res.data || [];
          this.isLoading = false;
        } else {
          this.sharedService.error(res.message);
          this.dataSource.data = [];
          this.isLoading = false;
        }
      },
      error: (err: string) => {
        console.error(err);
        this.sharedService.error(err);
        this.dataSource.data = [];
        this.isLoading = false;
      }
   });
}


  

}
