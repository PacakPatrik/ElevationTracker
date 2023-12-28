import { Injectable } from '@angular/core';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public checkPermissions: boolean;
  private posId: any;

  constructor() {
    this.checkPermissions = false;
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      maximumAge: Infinity
    });
    return coordinates;
  }

  async arePermissionsAllowed(): Promise<PermissionStatus> {
    const checkPermissions = await Geolocation.checkPermissions();
    return checkPermissions;
  }

  requestPermissions() {
    Geolocation.requestPermissions();
  }

  getCurrentPositionWatch() {
    if (this.posId) {
      Geolocation.clearWatch({ id: this.posId });
      this.posId = null;
    }

    this.posId = Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: Infinity
      },
      (pos) => {
        Geolocation.clearWatch({ id: this.posId });
        this.posId = null;
      }
    );
  }
}
