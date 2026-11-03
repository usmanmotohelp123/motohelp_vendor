import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormModule } from '@coreui/angular';
import { AllServicesService } from '../all-services.service';
import { SharedService } from '../Services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule,FormModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent implements OnInit{


 private map!: L.Map;
 private selectedMarker: L.Marker | null = null;

 screen = 1;

 isIssueBoxEnable:boolean = false;

vehicleList = [
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,
];

trackingData = [
  'Post',
  'Booking',
  'Reporting',
  'Loading Status',
  'Payment',
  'Departed',
  'Location',
  'Location',
  'Location',
  'Reporting',
  'Unloading',
  'Payment',
  'Delivered',
  'POD'
];
 
 constructor(private dialog: MatDialog, private allServices: AllServicesService, private sharedService: SharedService,){
 
   }
 
 ngOnInit(): void {
     this.initMap();
 }

 toggleIssueBox(){
    this.isIssueBoxEnable = !this.isIssueBoxEnable;
 }
 
 
   private initMap(): void {
 
     this.map = L.map('map').setView([20.5937, 78.9629], 5);
 
     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '&copy; OpenStreetMap contributors',
       maxZoom: 19
     }).addTo(this.map);
 
     this.getCurrentLocation();
 
     this.map.on('click', (e: any) => {
       this.setMarker(e.latlng.lat, e.latlng.lng);
     });
   }
 
   private getCurrentLocation(): void {
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (position) => {
           const lat = position.coords.latitude;
           const lng = position.coords.longitude;
 
           this.map.setView([lat, lng], 15); 
           this.setMarker(lat, lng);
         },
         (error) => {
           console.error('Location error:', error);
         }
       );
     }
   }
 
   private setMarker(lat: number, lng: number): void {
 
     if (this.selectedMarker) {
       this.map.removeLayer(this.selectedMarker);
     }
 
     // const selectedIcon = L.icon({
     //     iconUrl: 'assets/images/Vector.png',
     //     iconSize: [40, 70],
     //     iconAnchor: [16, 32]
     //   });
     const selectedIcon = L.icon({
         iconUrl: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
         iconSize: [40, 70],
         iconAnchor: [15, 45],
       });
 
     this.selectedMarker = L.marker([lat, lng],{icon:selectedIcon})
       .addTo(this.map)
       // .bindPopup('You are here 📍')
       .openPopup();
   }
 



}
