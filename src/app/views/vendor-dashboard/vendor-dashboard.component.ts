import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AllServicesService } from '../all-services.service';
import { SharedService } from '../Services/shared.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.scss'
})
export class VendorDashboardComponent implements OnInit{


private map!: L.Map;
private selectedMarker: L.Marker | null = null;

constructor(private dialog: MatDialog, private allServices: AllServicesService, private sharedService: SharedService,){

  }

ngOnInit(): void {
    this.initMap();
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
