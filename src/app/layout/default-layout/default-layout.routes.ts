import { Routes } from "@angular/router";
import { LoadHistoryComponent } from "../../views/load-history/load-history.component";
// import { DriverPostComponent } from "../../views/driver-post/driver-post.component";
import { BillInvoiceComponent } from "../../views/bill-invoice/bill-invoice.component";
import { ProfileEditComponent } from "../../views/widgets/profile-edit/profile-edit.component";
import { AuthoritiesComponent } from "../../views/authorities/authorities.component";
import { DriverComponent } from "../../views/driver/driver.component";
import { VehiclsComponent } from "../../views/vehicls/vehicls.component";
import { ProfileManagementComponent } from "../../views/profile-management/profile-management.component";
import { VendorDashboardComponent } from "../../views/vendor-dashboard/vendor-dashboard.component";
import { NewRegisterDashboardComponent } from "../../views/new-register-dashboard/new-register-dashboard.component";
import { VahicleDetailsComponent } from "../../views/vehicls/Vehicle-Components/vahicle-details/vahicle-details.component";
import { DiscontinueDriverComponent } from "../../views/driver/Driver-Components/discontinue-driver/discontinue-driver.component";
import { OnboardDriverComponent } from "../../views/driver/Driver-Components/onboard-driver/onboard-driver.component";
import { DriverListComponent } from "../../views/driver/Driver-Components/driver-list/driver-list.component";
import { AssignVehicleComponent } from "../../views/vehicls/Vehicle-Components/assign-vehicle/assign-vehicle.component";
import { VehicleExpiryComponent } from "../../views/vehicls/Vehicle-Components/vehicle-expiry/vehicle-expiry.component";
import {TrackingComponent } from "../../views/tracking/tracking.component";
import { DiscontinueVehicleComponent } from "../../views/vehicls/Vehicle-Components/discontinue-vehicle/discontinue-vehicle.component";

export const DEFAULT_LAYOUT_ROUTES: Routes = [

      {
        path: 'newRegisterDashboard', component:NewRegisterDashboardComponent
      },

      {
        path: 'vendorDashboard', component:VendorDashboardComponent
      },

      {
        path: 'vehicle', component:VehiclsComponent
      },

      {
        path: 'driver', component:DriverComponent
      },

      {
        path: 'authorities', component:AuthoritiesComponent
      },

      {
        path: 'loadhistory', component:LoadHistoryComponent
      },

      {
        path: 'billinvoice',component:BillInvoiceComponent
      },

      {
        path:'profile',component:ProfileEditComponent
      },

      {
        path:'profile-management',component:ProfileManagementComponent
      },

      {
        path:'vahicleDetails',component:VahicleDetailsComponent
      },

      {
        path:'discontinueDriver',component:DiscontinueDriverComponent
      },
      
      {
        path:'onboardDriver',component:OnboardDriverComponent
      },

      {
        path:'driverList',component:DriverListComponent
      },

      {
        path:'assignVehicle',component:AssignVehicleComponent
      },

      {
        path:'vehicleExpiry',component:VehicleExpiryComponent
      },

      {
        path:'tracking',component:TrackingComponent
      },
      
      {
        path:'discontinueVehicle',component:DiscontinueVehicleComponent
        
      }

      
       
  ];