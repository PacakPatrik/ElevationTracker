import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Elevation} from "../../model/elevation.model";

@Injectable({
  providedIn: 'root'
})
export class ElevationService {

  constructor(private http: HttpClient) {

  }

  getByGeo$(lat: number, lng: number){
    return this.http.get<Elevation>(`${environment.baseUrl}${lat},${lng}`);
  }
}
