import { Component } from '@angular/core';
import { DriverAddComponent } from '../widgets/driver-add/driver-add.component';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss'
})
export class DriverComponent {

isHover = false;

drivers = [
  {
    licenceNo: 'MH12-2023-001234',
    name: 'Rahul Patil',
    mobile: '9876543210',
    expiryDate: '15-08-2026',
    status: 'Active'
  },
  {
    licenceNo: 'MH14-2022-004567',
    name: 'Amit Sharma',
    mobile: '9123456780',
    expiryDate: '10-12-2025',
    status: 'Inactive'
  },
  {
    licenceNo: 'MH13-2024-009876',
    name: 'Suresh Yadav',
    mobile: '9988776655',
    expiryDate: '05-03-2027',
    status: 'Active'
  }
];


constructor(private fb: FormBuilder,private dialog: MatDialog) {
     
}

 ngOnInit(): void {
   
  }

addDriver() {
  console.log('Add Driver clicked');
   this.dialog.open(DriverAddComponent, {
    width: '65rem',
    disableClose: true
  });
}

editDriver(v:any, index:number) {

}

deleteDriver(index:number) {

}


}
