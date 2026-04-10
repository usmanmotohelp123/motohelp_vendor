import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validate-vehicle',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './validate-vehicle.component.html',
  styleUrl: './validate-vehicle.component.scss'
})
export class ValidateVehicleComponent implements OnInit {

  constructor(){

  }

  ngOnInit(): void {
 
  }

}
