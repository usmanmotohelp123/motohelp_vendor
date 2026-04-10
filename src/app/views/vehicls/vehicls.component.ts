import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { VehicleAddComponent } from '../widgets/vehicle-add/vehicle-add.component';

@Component({
  selector: 'app-vehicls',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './vehicls.component.html',
  styleUrl: './vehicls.component.scss'
})
export class VehiclsComponent implements OnInit{

isHover = false;

vehicles = [
  {
    vehicleNo: 'MH12 AB 1234',
    type: 'Truck',
    model: 'Tata Ace',
    capacity: '1.5 Ton',
    status: 'Active',
    validationState: 'idle'
  },
    {
    vehicleNo: 'MH13 AS 6734',
    type: 'Truck',
    model: 'Ashok Layland',
    capacity: '2 Ton',
    status: 'Active',
    validationState: 'idle'
  }
  ,
    {
    vehicleNo: 'MH13 AS 6734',
    type: 'Truck',
    model: 'Ashok Layland',
    capacity: '2 Ton',
    status: 'Active',
    validationState: 'idle'
  }
  ,
];



constructor(private fb: FormBuilder,private dialog: MatDialog) {
     
}

 ngOnInit(): void {
   
  }

 validateVehicle(index: number) {
  const vehicle = this.vehicles[index];

  if (vehicle.validationState !== 'idle') return;

  vehicle.validationState = 'loading';

  // Simulate API call
  setTimeout(() => {
    vehicle.validationState = 'validated';
  }, 2000);
}

addVehicle() {
  console.log('Add Driver clicked');
   this.dialog.open(VehicleAddComponent, {
    width: '35rem',
    disableClose: true
  });
}

editVehicle(v:any, index:number) {
   console.log('Add Driver clicked');
   this.dialog.open(VehicleAddComponent, {
    data:{
        vehicle:v,
        mode:'edit'
      },
    width: '35rem',
    disableClose: true
  });

}
deleteVehicle(index:number) {

}


}
