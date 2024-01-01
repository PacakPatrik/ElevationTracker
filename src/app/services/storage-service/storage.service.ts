import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public sessionData: string[];
  constructor() {
    this.sessionData = [];
  }
  public async resetSessionArray(){
    await this.removeObject("sessionArray");
    this.sessionData.splice(0);
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
  public async getObject(key:string) {
    const ret = await Preferences.get({ key: key });
    return ret.value;
  }
}
