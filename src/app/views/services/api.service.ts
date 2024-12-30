import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  errorMessages: any;
  formRules = {
    usernameMin: 5
  }
  constructor(protected http: HttpClient){
   
    this.errorMessages = {
      empName: {
        required: 'Employee name is required'
      },
      email: {
        required: 'Email is required',
        email: 'Invalid email address'
      },
      gender: {
        required: 'Gender is required'
      },
      designation: {
        required: 'Designation is required'
      },
      empId: {
        required: 'Employee ID is required',
        minLength: `Employee ID must be ${this.formRules.usernameMin} characters or more`,
      },
      birthDate: {
        required: 'Birth Date is required'
      },
      joiningDate: {
        required: 'Joining Date is required'
      }
    }
  }

api='http://13.235.67.167:8080/';
protected getemp = this.api +'api/employees' 
protected leavedata = this.api +'api/employee-leaves' 


  getemployee(): Observable<any> {
    return this.http.get<any>( this.getemp , {observe: 'response' });
  }
  editget(id:any): Observable<any> {
    return this.http.get<any>(`${this.getemp}/${id}`   ,{observe: 'response' });
  }
  deleteemp(id:any): Observable<any> {
    return this.http.delete<any>(`${this.getemp}/${id}`   ,{observe: 'response' });
  }
  updateemp(id: any, payload: any): Observable<any> {
    return this.http.put<any>(`${this.getemp}/${id}`, payload, { observe: 'response' });
  }  
  addnewemp(payload:any): Observable<any> {
    return this.http.post<any>( this.getemp ,payload, {observe: 'response' });
  }
  getemployeeleavedetails(mon:any): Observable<any> {
    return this.http.get<any>( `${this.leavedata}?month=${mon}`, {observe: 'response' });
  }
  search(option: any, key: string): Observable<any> {
    return this.http.get<any>(`${this.getemp}?key=${key}`, { observe: 'response' });
  }
}
