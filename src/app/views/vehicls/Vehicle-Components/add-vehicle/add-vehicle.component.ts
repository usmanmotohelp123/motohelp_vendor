import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss'
})
export class AddVehicleComponent implements OnInit{

  

  constructor(){

  }

  ngOnInit(): void {
 
  }

}
