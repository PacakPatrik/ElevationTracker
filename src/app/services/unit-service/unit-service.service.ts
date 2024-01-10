import { Injectable } from '@angular/core';
import {SettingsDataService} from "../settings-data-service/settings-data.service";
@Injectable({
  providedIn: 'root'
})
export class UnitServiceService {
  constructor(private settingService: SettingsDataService) {
  }
  public performCalculation(data: any) {
    if (this.settingService.settingsArray[1] === 'meters') {
      return data;
    } else {
      const metersToFeetConversionFactor = 3.2808399;
      // Check if elevation data is available and has a valid value
      if (data?.results?.[0]?.elevation !== undefined) {
        const elevationInMeters = data.results[0].elevation;
        const elevationInFeet = elevationInMeters * metersToFeetConversionFactor;
        data.results[0].elevation = Math.trunc(elevationInFeet);
        return data;
      } else {
        return data; // Return unchanged data if elevation is not available or not valid
      }
    }
  }
}
