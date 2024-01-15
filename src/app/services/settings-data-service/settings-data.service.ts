import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsDataService {
  //private _settingsArray: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(['30000','meters','assets/images/mountain2.jpg']);
  //public settingsArray$: Observable<string[]> = this._settingsArray.asObservable();
  public settingsArray: string[];
  constructor() {
  this.settingsArray =['20000','meters','ion-content-first']
  }
}
