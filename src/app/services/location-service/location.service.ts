import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  };

}
