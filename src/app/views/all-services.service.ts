import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
// import { api } from '../../proxy.conf.json';

@Injectable({
  providedIn: 'root'
})
export class AllServicesService {

  private baseUrl = "/api";  // proxy prefix

  // private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // https://motohelpindia.com/vendor/v1/VendorOnboarding

  sendOtp(obj:any){
    return this.http.post(`${this.baseUrl}/sendOTP`, obj); 
  }

  validateOtp(obj:any){
    return this.http.post(`${this.baseUrl}/validateOTP`, obj); 
  }

  gstVerification(obj:any){
     return this.http.post(`${this.baseUrl}/GST`, obj); 
  }

  panVerification(obj:any){
     return this.http.post(`${this.baseUrl}/pancard`, obj); 
  }
  
  postVendor(obj:any) {
    return this.http.post(`${this.baseUrl}/VendorOnboarding`, obj); 
  }

  getVehicleByVendor(obj:any) {
    return this.http.post(`${this.baseUrl}/get_vehicle`, obj); 
  }

  getDriverByVendor(obj:any) {
    return this.http.post(`${this.baseUrl}/get_DriverDetails`, obj); 
  }

  addBankKyc(obj:any) {
    return this.http.post(`${this.baseUrl}/vendor_Bank_kyc`, obj); 
  }

  driverDetailsByScannerUID(obj:any) {
    return this.http.post(`${this.baseUrl}/qr_scan/driver_details`, obj); 
  }

  driverDetailsByLicense(obj:any) {
    return this.http.post(`${this.baseUrl}/DrivingLicense`, obj); 
  }

  postDriverData(obj:any) {
    return this.http.post(`${this.baseUrl}/Driver_verification`, obj); 
  }

  insertVehicleData(obj:any) {
    return this.http.post(`${this.baseUrl}/Insert_Vehicle`, obj); 
  }

  deleteDriver(obj:any) {
    return this.http.post(`${this.baseUrl}/delete_driver`, obj); 
  }


  deleteVehicle(obj:any) {
    return this.http.post(`${this.baseUrl}/delete_vehicle`, obj); 
  }
  
  getLocations(obj:any) {
    return this.http.post(`${this.baseUrl}/get_state_region_district`, obj); 
  }


  getLoctionPincode(obj:any){
    return this.http.post(`${this.baseUrl}/pincode`, obj); 
  }



  getDriverVehicleAssign(obj:any) {
    return this.http.post(`${this.baseUrl}/get_Driver_Vehicle_Assign`, obj); 
  }

  getDriverAvailable(obj:any) {
    return this.http.post(`${this.baseUrl}/get_DriverAvailable`, obj); 
  }

  getVehicleAvailable(obj:any) {
    return this.http.post(`${this.baseUrl}/get_VehicleAvailable`, obj); 
  }


  assignVehicle(obj:any) {
    return this.http.post(`${this.baseUrl}/insert_Driver_Vehicle_Assign`, obj); 
  }

  diassignVehicle(obj:any) {
    return this.http.post(`${this.baseUrl}/update_Driver_Vehicle_Assign`, obj); 
  }








  getActiveLoadPost(obj:any){
    return this.http.post(`${this.baseUrl}/get_Active_LoadPost`, obj); 
  }

  getVehicleDetails() {
    return this.http.post(`${this.baseUrl}/get_vehicle_Details`, {}); 
  }

  getCorgoContent() {
    return this.http.post(`${this.baseUrl}/get_CargoTypes`, {}); 
  }


  getWeightRange(obj:any) {
    return this.http.post(`${this.baseUrl}/get_vehicle_Details`, obj); 
  }

  getbodyTypes(obj:any){
    return this.http.post(`${this.baseUrl}/get_vehicle_Details`, obj); 
  }

  getPackegingType(obj:any) {
    return this.http.post(`${this.baseUrl}/get_CargoTypes`, obj); 
  }


  postNewLoad(obj:any) {
    return this.http.post(`${this.baseUrl}/Insert_customer_load_post`, obj); 
  }


  getCustomerLoadPost(obj:any) {
    return this.http.post(`${this.baseUrl}/get_customer_load_post`, obj); 
  }

  getCustomerProcessTrip(obj:any) {
    return this.http.post(`${this.baseUrl}/customer_process_Trip`, obj); 
  }

  getCustomerActiveTrip(obj:any) {
    return this.http.post(`${this.baseUrl}/customer_active_Trip`, obj); 
  }

 getCustomerCompletedTrip(obj:any) {
    return this.http.post(`${this.baseUrl}/customer_active_Trip`, obj); 
  }
  

}
