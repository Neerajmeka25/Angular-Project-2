import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private vehicleJsonPath = 'assets/VehicleData.json';

  constructor(private http: HttpClient) {}

  getVehicleData(): Observable<any> {
    return this.http.get<any>(this.vehicleJsonPath);
  }
}
