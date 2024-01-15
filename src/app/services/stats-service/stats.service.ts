import {ChangeDetectorRef, Injectable} from '@angular/core';
import {Chart} from "chart.js";
import {StorageService} from "../storage-service/storage.service";

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  public highestPointOverall:number = 0;
  public overallElevationChange:number = 0;
  public lowestPointOverall:number = 0;

  public highestPointLastSession:number=0;
  public elevationChangeLastSession:number=0;
  public lowestPointLastSession:number=0;
  constructor(private storageService:StorageService) {
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
          return 0; // or handle the case where the array is empty
        }
      } else {
        return 0; // or handle the case where the array string is null or undefined
      }
    } catch (error) {
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

  parseNumber(value: any): number {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) ? parsedValue : 0;
    }

  async setDefaults() : Promise<void> {
    this.highestPointOverall = await this.gethighestPointOverall();
    this.overallElevationChange = await this.gethighestOverallElevationChange();
    this.lowestPointOverall = await this.getlowestPointOverall();

    this.highestPointLastSession = await this.getHighestPointInLastSession();
    this.elevationChangeLastSession = await this.getElevationChangeInLatestSession();
    this.lowestPointLastSession = await this.getlowestPointLastSession();
  }
   async updateStats(cdr: ChangeDetectorRef){

    this.highestPointLastSession = await this.getHighestPointInLastSession();
    this.lowestPointLastSession = await this.getlowestPointLastSession();
    this.elevationChangeLastSession = await this.getElevationChangeInLatestSession();

    this.lowestPointOverall = await this.getlowestPointOverall();
    if(this.highestPointLastSession > await this.gethighestPointOverall()){
      await this.sethighestPointOverall(this.highestPointLastSession);
    }
    this.highestPointOverall = await this.gethighestPointOverall();

    if(await this.getIsLowestPointSet()==="true")
    {
      if (this.lowestPointLastSession < await this.getlowestPointOverall()) {
        await this.setlowestPointOverall(this.lowestPointLastSession);
      }
      this.lowestPointOverall = await this.getlowestPointOverall();
    }
    else
    {
      if(await this.storageService.getTrackingStatus() ==="true")
      {
        await this.setlowestPointOverall(this.highestPointLastSession);
        await this.setIsLowestPointSet("true");
        this.lowestPointOverall = await this.getlowestPointOverall();
      }
    }
    if(this.elevationChangeLastSession > await this.gethighestOverallElevationChange())
    {
      await this.sethighestOverallElevationChange(this.elevationChangeLastSession);
    }
    this.overallElevationChange = await this.gethighestOverallElevationChange();

    cdr.detectChanges();
  }

}
