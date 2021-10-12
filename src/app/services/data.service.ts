import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Vehicle} from "../vehicle";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
  }

  private apiUrl = 'https://dev.vozilla.pl/api-client-portal/map?objectType=VEHICLE';

  getAllVehicles(): Observable<Vehicle> {
    return this.http.get<Vehicle>(this.apiUrl);
  }
}
