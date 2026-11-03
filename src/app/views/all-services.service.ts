import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
// import { api } from '../../proxy.conf.json';

@Injectable({
  providedIn: 'root'
})
export class AllServicesService {

  // private baseUrl = "/api";  // proxy prefix

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

 
  sendOtp(obj:any){
    return this.http.post(`${this.baseUrl}/send-otp`, obj); 
  }

  validateOtp(obj:any){
    return this.http.post(`${this.baseUrl}/verify-otp`, obj); 
  }

  
  getLoctionPincode(pincode:any){
    return this.http.get(`${this.baseUrl}/location/pincode?search=${pincode}`); 
  }

  getStates(){
    return this.http.get(`${this.baseUrl}/location/states`); 
  }

  getDistricts(currentState:any){
    return this.http.get(`${this.baseUrl}/location/districts?state=${currentState}`); 
  }

  gstVerification(obj:any){
     return this.http.post(`${this.baseUrl}/kyc/gst`, obj); 
  }

  panVerification(obj:any){
     return this.http.post(`${this.baseUrl}/kyc/pan`, obj); 
  }

  postVendor(obj:any) {
    return this.http.post(`${this.baseUrl}/register`, obj); 
  }

  getVehicleCounts() {
    return this.http.get(`${this.baseUrl}/dashboard/counts`); 
  }

  getVehicleByVendor() {
    return this.http.post(`${this.baseUrl}/vehicle/vehicles`,{}); 
  }

  getBodyType(capacity:any){
    return this.http.get(`${this.baseUrl}/vehicle/vehicle-type-details-by-capacity?LoadingCapacity=${capacity}`); 
  }
  
  insertVehicleData(formData: FormData) {
    return this.http.post(`${this.baseUrl}/vehicle/verify-rc`,formData);
  }
  
  addVehicle(obj:any) {
    return this.http.post(`${this.baseUrl}/vehicle/add-vehicle`,obj);
  }

  editVehicle(obj:any) {
    return this.http.put(`${this.baseUrl}/vehicle/editvehicles`,obj);
  }

  addBankKyc(obj:any) {
    return this.http.post(`${this.baseUrl}/kyc/bankdetails`, obj); 
  }

  getVehicleData(VehicleId:any){
    return this.http.get(`${this.baseUrl}/vehicle/details?VehicleId=${VehicleId}`); 
  }

  getDriverByVendor() {
    return this.http.post(`${this.baseUrl}/vehicle/drivers`, {}); 
  }

  getUnassignVehicle() {
    return this.http.get(`${this.baseUrl}/vehicle/unassigned`); 
  }

  getUnassignDriver() {
    return this.http.get(`${this.baseUrl}/vehicle/unassigneddrivers`); 
  }

  driverDetailsByScannerUID(vendorUserId:string,userId:string) {
    return this.http.get(`${this.baseUrl}/verify?userId=${vendorUserId}&notificationId=${userId}`); 
  }

  driverDetailsByLicense(obj:any) {
    return this.http.post(`${this.baseUrl}/kyc/driving-license/verify`, obj); 
  }

  postDriverData(obj:any) {
    return this.http.post(`${this.baseUrl}/vehicle/driver-onboarding`, obj); 
  }

  // getDriverAvailable(obj:any) {
  //   return this.http.post(`${this.baseUrl}/get_DriverAvailable`, obj); 
  // }

  // getVehicleAvailable(obj:any) {
  //   return this.http.post(`${this.baseUrl}/get_VehicleAvailable`, obj); 
  // }

  getDriverVehicleAssign() {
    return this.http.get(`${this.baseUrl}/vehicle/driver-vehicle-assignments`); 
  }

  assignVehicle(obj:any) {
    return this.http.post(`${this.baseUrl}/vehicle/assign-vehicle`, obj); 
  }

  
  diassignVehicle(obj:any) {
    return this.http.post(`${this.baseUrl}/vehicle/deassign-vehicle`, obj); 
  }

  deleteVehicle(obj:any) {
    return this.http.post(`${this.baseUrl}/vehicle/discontinue-vehicle`, obj); 
  }

  deleteDriver(obj:any) {
    return this.http.post(`${this.baseUrl}/vehicle/discontinue-driver`, obj); 
  }













  getLocations(obj:any) {
    return this.http.post(`${this.baseUrl}/get_state_region_district`, obj); 
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
