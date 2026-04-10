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
       
  ];