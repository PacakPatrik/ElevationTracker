import { Injectable } from '@angular/core';
import {Chart} from "chart.js";
import {StorageService} from "../storage-service/storage.service";

@Injectable({
  providedIn: 'root'
})
export class StatsService {


  constructor(private storageService:StorageService) {
    this.sethighestOverallElevationChange(0);
    this.sethighestPointOverall(0);
    this.setlowestPointOverall(0);
  }
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

  public async sethighestPointOverall(value:any){
    await this.storageService.setObject("HighestPointOverall",value);
  }
  public async setlowestPointOverall(value:any){
   await  this.storageService.setObject("LowestPointOverall",value);
  }
  public async sethighestOverallElevationChange(value:any){
    await this.storageService.setObject("ElevationChangeOverall",value);
  }

  public async setIsLowestPointSet(value:any){
    await this.storageService.setObject("isLowestPointSet",value);
  }
  public async getIsLowestPointSet(): Promise<string> {
        const value = await this.storageService.getObject("isLowestPointSet");
        return JSON.parse(<string>value);
  }
  public async gethighestPointOverall(): Promise<number> {
        const value = await this.storageService.getObject("HighestPointOverall");
        return this.parseNumber(value);
  }
    public async getlowestPointOverall(): Promise<number> {
        const value = await this.storageService.getObject("LowestPointOverall");
        return this.parseNumber(value);
    }
    public async gethighestOverallElevationChange(): Promise<number> {
        const value = await this.storageService.getObject("ElevationChangeOverall");
        return this.parseNumber(value);
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

    private parseNumber(value: any): number {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) ? parsedValue : 0;
    }

}
