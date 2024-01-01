import { Injectable } from '@angular/core';
import {Chart} from "chart.js";
import {StorageService} from "../storage-service/storage.service";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private storageService:StorageService) { }
  getDataForChart(): Promise<{ sessionTimeStamps: string[], sessionArray: string[] }> {
    return Promise.all([
      this.storageService.getObject("sessionTimeStamps"),
      this.storageService.getObject("sessionArray")
    ]).then(([sessionTimeStampsString, sessionArrayString]) => {
      const sessionTimeStamps = JSON.parse(sessionTimeStampsString || '[]');
      const sessionArray = JSON.parse(sessionArrayString || '[]');
      return { sessionTimeStamps, sessionArray };
    });
  }

  public sethighestPointOverall(value:any){
    this.storageService.setObject("HighestPointOverall",value);
  }
  public setlowestPointOverall(value:any){
    this.storageService.setObject("LowestPointOverall",value);
  }
  public sethighestOverallElevationChange(value:any){
    this.storageService.setObject("ElevationChangeOverall",value);
  }

  public gethighestPointOverall(){
    let highestPoint:number;
      highestPoint = Number(JSON.stringify(this.storageService.getObject("HighestPointOverall")));
      return highestPoint;
  }
  public getlowestPointOverall(){
    let lowesPoint:number;
    lowesPoint = Number(JSON.stringify(this.storageService.getObject("LowestPointOverall")));
    return lowesPoint;
  }
  public gethighestOverallElevationChange(){
    let highestPoint:number;
    highestPoint = Number(JSON.stringify(this.storageService.getObject("ElevationChangeOverall")));
    return highestPoint;
  }
  public async getHighestPointInLastSession(): Promise<number> {
    try {
      const sessionArrayString = await this.storageService.getObject("sessionArray");

      if (sessionArrayString !== null && sessionArrayString !== undefined) {
        const sessionArray = JSON.parse(sessionArrayString || '[]') as number[];

        if (sessionArray.length > 0) {
          return Math.max(...sessionArray);
        } else {
          console.warn("Session array is empty.");
          return 0; // or handle the case where the array is empty
        }
      } else {
        console.warn("Session array string is null or undefined.");
        return 0; // or handle the case where the array string is null or undefined
      }
    } catch (error) {
      console.error("Error getting highest point:", error);
      return 0; // or handle the error as needed
    }
  }

  public async getlowestPointLastSession(){
    try {
      const sessionArrayString = await this.storageService.getObject("sessionArray");

      if (sessionArrayString !== null && sessionArrayString !== undefined) {
        const sessionArray = JSON.parse(sessionArrayString || '[]') as number[];

        if (sessionArray.length > 0) {
          return Math.min(...sessionArray);
        } else {
          console.warn("Session array is empty.");
          return 0; // or handle the case where the array is empty
        }
      } else {
        console.warn("Session array string is null or undefined.");
        return 0; // or handle the case where the array string is null or undefined
      }
    } catch (error) {
      console.error("Error getting highest point:", error);
      return 0; // or handle the error as needed
    }
  }

  public async getElevationChangeInLatestSession(){
    try {
      const sessionArrayString = await this.storageService.getObject("sessionArray");

      if (sessionArrayString !== null && sessionArrayString !== undefined) {
        const sessionArray = JSON.parse(sessionArrayString || '[]') as number[];

        if (sessionArray.length > 0) {
          return Math.max(...sessionArray) - Math.min(...sessionArray);
        } else {
          console.warn("Session array is empty.");
          return 0; // or handle the case where the array is empty
        }
      } else {
        console.warn("Session array string is null or undefined.");
        return 0; // or handle the case where the array string is null or undefined
      }
    } catch (error) {
      console.error("Error getting highest point:", error);
      return 0; // or handle the error as needed
    }
  }

}
