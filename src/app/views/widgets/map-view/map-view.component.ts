// import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { AllServicesService } from '../../all-services.service';
import { SharedService } from '../../Services/shared.service';

// interface Trip {
//   id: number;
//   name: string;
//   route: [number, number][];
// }

interface Trip {
  id: number;
  name: string;
  route: [number, number][];
  DriverName?: string;
  VehicleType?: string;
  CargoContent?: string;
  CargoPackageType?: string;
  total_km?: number;
  covered_km?: number;
  pending_km?: number;
  // PostInsertDate: Date;
   PostInsertDate: string;
}

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  providers: [DatePipe]
})


export class MapViewComponent {

  @Input() enableSelect: boolean = false;
  @Input() lat: any;
  @Input() lng: any;

  @Output() locationSelected = new EventEmitter<any>();
  @Output() activeTrips = new EventEmitter<any[]>();
  private apiKey = 'AIzaSyBam0VcHF4WsWfiDVxjaW82Xt7xhhvlXvk';
  selectedLatLng: any;
  private routingControl: any;
  private map: any;
  customerID:any;

  // private route: L.LatLngExpression[] = [];
  // private route: [number,number][] = [[19.0760, 72.8777],  // Mumbai
  // [23.2599, 77.4126] ];

  private route: [number,number][] = [ ];
  
  trips: Trip[] = [
  {
    id: 1,
    name: 'Mumbai → Pune',
    route: [
      [19.0760, 72.8777], // Mumbai
      [18.5204, 73.8567]  // Pune
    ],
    PostInsertDate: '18-01-2026'
  },
  {
    id: 2,
    name: 'Delhi → Jaipur',
    route: [
      [28.6139, 77.2090], // Delhi
      [26.9124, 75.7873]  // Jaipur
    ],
    PostInsertDate: '18-01-2026'
  },
  // {
  //   id: 3,
  //   name: 'Bengaluru → Chennai',
  //   route: [
  //     [12.9716, 77.5946], // Bengaluru
  //     [13.0827, 80.2707]  // Chennai
  //   ],
  //   PostInsertDate: '18-01-2026'
  // },
  // {
  //   id: 4,
  //   name: 'Ahmedabad → Surat',
  //   route: [
  //     [23.0225, 72.5714], // Ahmedabad
  //     [21.1702, 72.8311]  // Surat
  //   ],
  //   PostInsertDate: '18-01-2026'
  // }
];

  // trips: Trip[] = []; 
 
  private marker: any;
  private currentIndex = 0;
  isoDate: string = '2025-10-04T19:03:32.413Z';

constructor(private dialog: MatDialog, private allServices: AllServicesService,private datePipe: DatePipe,private sharedService: SharedService,) {
         
    
  }

ngOnInit(): void {
  this.customerID = localStorage.getItem('CustomerID');
  console.log("CustomerId>>>>>",this.customerID)
             console.log('Trips:', this.trips);
          this.activeTrips.emit(this.trips);
  
        if (this.trips.length > 0) {
            this.onChangeTrip(this.trips[0].id);
          }
    // this.getActiveLoadPost();
  }

  ngAfterViewInit(): void {
    
    this.initMap();
    this.drawPath();
    this.addSourceAndDestinationMarkers();
    this.simulateRealTimeTracking();
    if (this.lat && this.lng) {
      this.showInitialMarker(this.lat, this.lng);
    }
  }

  private selectedMarker: L.Marker | null = null;
  private initMap(): void {
    this.map = L.map('map').setView([20.5937, 78.9629], 5); // India center
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // this.map.on('click', (e: any) => {
    //   this.selectedLatLng = e.latlng;
    //   L.marker(e.latlng).addTo(this.map);
    // });

    

  if (this.enableSelect) {

      this.map.on('click', (e: any) => {
        this.selectedLatLng = e.latlng;
  
        if (this.selectedMarker) {
          this.map.removeLayer(this.selectedMarker);
        }

        const selectedIcon = L.icon({
          iconUrl: 'assets/images/LocationMark2.png',  
          iconSize: [32, 32],      
          iconAnchor: [16, 32],    
          popupAnchor: [0, -32]    
        });
  
        // // Add new marker
        // this.selectedMarker = L.marker(e.latlng, {icon : selectedIcon}).addTo(this.map)
        //   // .bindPopup("Selected Location") (`<b>Selected Location</b><br>${address}`)
        //   .bindPopup(this.markedLocation)
        //   .openPopup();

       // Add marker first
       this.selectedMarker = L.marker(e.latlng, { icon: selectedIcon }).addTo(this.map);
         // Call reverse geocode API
          this.reverseGeocode(e.latlng.lat, e.latlng.lng).then((address) => {
            this.selectedMarker
              ?.bindPopup(`<b>Selected Location</b><br>${address}`)
              .openPopup();
          });
           this.map.setView([e.latlng.lat, e.latlng.lng], 12);
      });
    }
    
  }


private showInitialMarker(lat: number, lng: number) {
  const selectedIcon = L.icon({
    iconUrl: 'assets/images/LocationMark2.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });

  this.selectedMarker = L.marker([lat, lng], { icon: selectedIcon }).addTo(this.map);
  this.reverseGeocode(lat, lng).then(address => {
    this.selectedMarker
      ?.bindPopup(`<b>Selected Location</b><br>${address}`)
      .openPopup();
  });
  this.map.setView([lat, lng], 12);
}


private reverseGeocode(lat: number, lng: number): Promise<string> {
    return new Promise((resolve) => {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
  
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'OK' && data.results.length > 0) {
            resolve(data.results[0].formatted_address);
          } else {
            resolve('Address not found');
          }
        })
        .catch(() => resolve('Error fetching address'));
    });
  }


formatDate(dateInput: string | Date | null | undefined, fallback: string = ''): string {
    if (!dateInput) return fallback;
  
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return fallback;
  
    // Use UTC methods to avoid local timezone shift
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // months are 0-based
    const year = date.getUTCFullYear();
  
    return `${day}-${month}-${year}`;
  }
  

  getActiveLoadPost() {
    // const obj = { CustomerID: 'CM782389' };
    const obj = { CustomerID: this.customerID };
    this.allServices.getActiveLoadPost(obj).subscribe({
      next: (res: any) => {
        if (res.status === '00') {
          this.trips = res.data.map((item: any, index: number) => ({
            id: item.LoadPostID,
            name: `${item.Origin_City} → ${item.Destination_City}`,
            route: [
              [item.Origin_Lat, item.Origin_Lng],
              [item.Destination_Lat, item.Destination_Lng]
            ],
            DriverName: item.DriverName,
            VehicleType: item.VehicleType,
            CargoContent: item.CargoContent,
            CargoPackageType: item.CargoPackageType,
            total_km: item.total_km,
            covered_km: item.covered_km,
            pending_km: item.pending_km,
            PostInsertDate: this.formatDate(item.PostInsertDate)
          }));
  
          console.log('Trips:', this.trips);
          this.activeTrips.emit(this.trips);
  
          if (this.trips.length > 0) {
            this.onChangeTrip(this.trips[0].id);
          }
  
        } else {
          this.sharedService.error(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.sharedService.error(err);
      }
    });
  }
  

  selectLocation() {
    if (this.selectedLatLng) {
      this.locationSelected.emit(this.selectedLatLng);
    }
  }

  private polyline: L.Polyline | null = null;

  // private drawPath(): void {
  //   if(!this.enableSelect){
  //     this.polyline = L.polyline(this.route, { color: 'blue' }).addTo(this.map);
  //     this.map.fitBounds(this.polyline.getBounds());
  //   } 
  // }

private drawPath(): void {
    if (!this.enableSelect && this.route.length >= 2) {
      this.fetchAndDrawRoute(this.route[0], this.route[this.route.length - 1]);
    }
  }

private fetchAndDrawRoute(src: [number, number], dest: [number, number]): void {
   
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }

    this.routingControl = L.Routing.control({
      waypoints: [
          L.latLng(src[0], src[1]),
           L.latLng(dest[0], dest[1])
      ],
      routeWhileDragging: false,
      show: false,              
      addWaypoints: false,     
      fitSelectedRoutes: true, 
      createMarker: () => null, 
      lineOptions: {
        styles: [{ color: '#6563f7', opacity: 0.8, weight: 4 }] 
      } 
    } as any ).addTo(this.map);

      (this.routingControl as any).on('routesfound', (e: any) => {
        if (this.routingControl && (this.routingControl as any)._container) {
          (this.routingControl as any)._container.style.display = 'none';
        }
      });

  }
  

private sourceMarker: L.Marker | null = null;
private destinationMarker: L.Marker | null = null;

private addSourceAndDestinationMarkers(): void {
  if(!this.enableSelect){
    const sourceIcon = L.icon({
      iconUrl:  'assets/images/LocationIcon.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    const destinationIcon = L.icon({
      iconUrl: 'assets/images/LocationMark.png',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    this.sourceMarker = L.marker(this.route[0], { icon: sourceIcon }).addTo(this.map).bindPopup('Source');
    this.destinationMarker = L.marker(this.route[this.route.length - 1], { icon: destinationIcon }).addTo(this.map).bindPopup('Destination');
   }
  }


// private simulateRealTimeTracking(): void {
//   if(!this.enableSelect){ 
//     const movingIcon = L.icon({
//       iconUrl: 'assets/images/truckIcon2.png',
//       iconSize: [32, 32],
//       iconAnchor: [16, 32]
//     });
  
//     // Start with a marker at the first point
//     this.marker = L.marker(this.route[0], { icon: movingIcon }).addTo(this.map);
//   }

//     // Function to update truck position
//     const updateTruckPosition = (lat: number, lng: number) => {
//       this.marker.setLatLng([lat, lng]);
//       this.map.panTo([lat, lng]);
//     };
  
//     // Example: simulate API by pushing new coordinates every 3 seconds
//     setInterval(() => {
//       // Replace this with API response
//       const nextLatLng = this.getNextApiCoordinate(); 
  
//       if (nextLatLng) {
//         updateTruckPosition(nextLatLng.lat, nextLatLng.lng);
//       }
//     }, 100000);
//   }


private trackingInterval: any;

private simulateRealTimeTracking(): void {
  if (!this.enableSelect) {
    const movingIcon = L.icon({
      iconUrl: 'assets/images/truckIcon2.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    // Reset old marker + interval
    if (this.marker) this.map.removeLayer(this.marker);
    if (this.trackingInterval) clearInterval(this.trackingInterval);

    // Start truck at source
    this.marker = L.marker(this.route[0], { icon: movingIcon }).addTo(this.map);

    // Update truck position
    this.trackingInterval = setInterval(() => {
      const nextLatLng = this.getNextApiCoordinate(); 
      if (nextLatLng) {
        this.marker.setLatLng([nextLatLng.lat, nextLatLng.lng]);
        this.map.panTo([nextLatLng.lat, nextLatLng.lng]);
      }
    }, 30000); // every 3
  }
}

private getNextApiCoordinate(): { lat: number; lng: number } | null {
    // In production, you will get this from a WebSocket or HTTP API
    const randomLat = 19.0 + Math.random() * 4; // example
    const randomLng = 72.8 + Math.random() * 5;
    return { lat: randomLat, lng: randomLng };
 }
 

// onChangeTrip(id: number) {
//   const trip = this.trips.find(t => t.id === id);
//   if (trip) {
//     this.route = trip.route;

//     if (this.sourceMarker) this.map.removeLayer(this.sourceMarker);
//     if (this.destinationMarker) this.map.removeLayer(this.destinationMarker);

//     this.addSourceAndDestinationMarkers();

//     if (this.marker) this.map.removeLayer(this.marker);

//     this.simulateRealTimeTracking();

//     this.fetchAndDrawRoute(this.route[0], this.route[this.route.length - 1]);
//   }
// }


onChangeTrip(id: number) {
  const trip = this.trips.find(t => t.id === id);
  if (trip) {
    this.route = trip.route;

    // 🧹 Remove old layers before adding new ones
    if (this.sourceMarker) this.map.removeLayer(this.sourceMarker);
    if (this.destinationMarker) this.map.removeLayer(this.destinationMarker);
    if (this.marker) this.map.removeLayer(this.marker);

    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
      this.routingControl = null;
    }

    this.addSourceAndDestinationMarkers();
    this.simulateRealTimeTracking();
    this.fetchAndDrawRoute(this.route[0], this.route[this.route.length - 1]);
  }
}


 
}
