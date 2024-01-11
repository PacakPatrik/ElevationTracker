import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";
import {SettingsDataService} from "../settings-data-service/settings-data.service";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public sessionData: string[];
  public sessionTimeStamps:string[];
  constructor(private settingData : SettingsDataService) {
    this.sessionData = [];
    this.sessionTimeStamps = [];
    this.getObject("isLowestPointSet").then(data =>{
      if(!data) {
        this.setObject("isLowestPointSet", "false");
      }
    })
  this.setDefaults();
  }


  public async getData() {
    await this.getObject("refreshRate").then((data) => {
      if (data) {

        this.settingData.settingsArray[0] = String(data).replace(/"/g, '');
      }
    });

    await this.getObject("units").then((data) => {
      if (data) {
        this.settingData.settingsArray[1] = String(data).replace(/"/g, '');
      }
    });

    await this.getObject("pictureOption").then((data) => {
      if (data) {
        this.settingData.settingsArray[2] = String(data).replace(/"/g, '');
      }
    });
  }


  async setDefaults(){
    this.sessionData =JSON.parse(await this.getObject("sessionArray") || '[]');
    this.sessionTimeStamps =JSON.parse(await this.getObject("sessionTimeStamps") || '[]');
  }
  public async resetSession(){
    await this.removeObject("sessionArray");
    await this.removeObject("sessionTimeStamps");
    this.sessionData.splice(0);
    this.sessionTimeStamps.splice(0);
  }
  public async removeObject(key: string): Promise<void> {
    await new Promise<void>(resolve => {
      Preferences.remove({ key: key }).then(() => resolve());
    });
  }
  public async setObject(key:string,value:any) {
    await Preferences.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  public async setSessionArray(value:any) {
    this.sessionData.push(value);
    await Preferences.set({
      key: 'sessionArray',
      value: JSON.stringify(this.sessionData)
    });
  }
  public async setSessionTimeStamps(value:any) {
    this.sessionTimeStamps.push(value);
    await Preferences.set({
      key: 'sessionTimeStamps',
      value: JSON.stringify(this.sessionTimeStamps)
    });
  }
  public async getObject(key:string) {
    const ret = await Preferences.get({ key: key });
    return ret.value;
  }

  public async setTrackingStatus(value:any) {
    await this.setObject("isTracking", value);
  }
  public async getTrackingStatus() {
    return await this.getObject("isTracking");
  }
}
