// import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-load-post-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './load-post-map.component.html',
  styleUrl: './load-post-map.component.scss'
})
export class LoadPostMapComponent {

    @Input() enableSelect: boolean = false;
    @Output() locationSelected = new EventEmitter<any>();
    @Output() activeLoadsChanged = new EventEmitter<any[]>();
    selectedLatLng: any;
    selectedOption: any;
    
    private map2: any;

    private marker: any;
    private currentIndex = 0;

      // Example active loads (Replace with API data)
//   activeLoads = [
//     { id: 1, lat: 19.0760, lng: 72.8777, name: 'Truck 1' }, // Mumbai
// ];

activeLoads = [
  // Mumbai (2 trucks)
  { id: 1, city: 'Mumbai', lat: 19.0760, lng: 72.8777, name: 'Truck 1 - Mumbai' },
  { id: 2, city: 'Mumbai', lat: 19.0896, lng: 72.8656, name: 'Truck 2 - Mumbai' },

  // Pune (3 trucks)
  { id: 3, city: 'Pune', lat: 18.5204, lng: 73.8567, name: 'Truck 3 - Pune' },
  { id: 4, city: 'Pune', lat: 18.5300, lng: 73.8500, name: 'Truck 4 - Pune' },
  { id: 5, city: 'Pune', lat: 18.5400, lng: 73.8700, name: 'Truck 5 - Pune' },

  // Nashik (2 trucks)
  { id: 6, city: 'Nashik', lat: 19.9975, lng: 73.7898, name: 'Truck 6 - Nashik' },
  { id: 7, city: 'Nashik', lat: 20.0050, lng: 73.8000, name: 'Truck 7 - Nashik' },

  // Thane (1 truck)
  { id: 8, city: 'Thane', lat: 19.2183, lng: 72.9781, name: 'Truck 8 - Thane' },

  { id: 9, city: 'Nagpur', lat: 21.1458, lng: 79.0882, name: 'Truck 9 - Nagpur' },
  { id: 10, city: 'Bhopal', lat: 23.2599, lng: 77.4126, name: 'Truck 10 - Bhopal' }
];

private vehicleMarkers: { [key: number]: any } = {}; // store markers by ID
  
    ngAfterViewInit(): void {
      this.initMap();
      this.addVehicles();
      // this.simulateLiveUpdates(); 

       // Emit activeLoads to parent so it can populate dropdown
      this.activeLoadsChanged.emit(this.activeLoads);
    }
  
  private initMap(): void {
      const container = L.DomUtil.get('map2');
      if (container != null) {
        (container as any)._leaflet_id = null; // reset Leaflet instance
      }
  
      this.map2 = L.map('map2').setView([20.5937, 78.9629], 5); // India center
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution: '&copy; OpenStreetMap contributors',
      //   maxZoom: 19
      // }).addTo(this.map2);

      //  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      //   attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      //   subdomains: 'abcd',
      //   maxZoom: 19
      // }).addTo(this.map2);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(this.map2);

      // L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      //   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      //   maxZoom: 20
      // }).addTo(this.map2);
  
      // Handle manual location selection
      this.map2.on('click', (e: any) => {
        this.selectedLatLng = e.latlng;
        L.marker(e.latlng).addTo(this.map2);
      });

    }

  
    selectLocation() {
      if (this.selectedLatLng) {
        this.locationSelected.emit(this.selectedLatLng);
      }
    }
  
    private addVehicles(): void {
      const vehicleIcon = L.icon({
        iconUrl: 'assets/images/truckIcon2.png', // Use your vehicle icon
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });
  
      this.activeLoads.forEach(load => {
        const marker = L.marker([load.lat, load.lng], { icon: vehicleIcon })
          .addTo(this.map2)
          .bindPopup(`<b>${load.name}</b>`);
  
        this.vehicleMarkers[load.id] = marker;
      });
    }
  

    // Simulated updates: Replace with API/WebSocket in production
    // private simulateLiveUpdates(): void {
    //   setInterval(() => {
    //     this.activeLoads.forEach(load => {
    //       // Randomly move vehicle (simulate GPS update)
    //       load.lat += (Math.random() - 0.5) * 0.01;
    //       load.lng += (Math.random() - 0.5) * 0.01;
  
    //       const marker = this.vehicleMarkers[load.id];
    //       if (marker) {
    //         marker.setLatLng([load.lat, load.lng]);
    //       }
    //     });
    //   }, 3000); // update every 3 sec
    // }


    public zoomToLocationById(id: number) {
      const loc = this.activeLoads.find(l => l.id === id);
      if (loc && this.map2) {
        // Zoom map to location
        this.map2.setView([loc.lat, loc.lng], 12);
    
        // Open marker popup if it exists
        const marker = this.vehicleMarkers[loc.id];
        if (marker) {
          marker.openPopup();
        }
      }
    }




}
