import { Component } from '@angular/core';
import {SettingsPage} from "../Settings/settings.page";
import {ModalController} from "@ionic/angular";
import { Chart, registerables } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';
import {StorageService} from "../../services/storage-service/storage.service";
import {StatsService} from "../../services/stats-service/stats.service";
Chart.register(...registerables);
import {UnitServiceService} from "../../services/unit-service/unit-service.service";
import {SettingsDataService} from "../../services/settings-data-service/settings-data.service";
@Component({
  selector: 'app-StatsTab',
  templateUrl: 'StatsTab.page.html',
  styleUrls: ['StatsTab.page.scss']
})
export class StatsTabPage {
  private lastData: { sessionTimeStamps: string[], sessionArray: string[] } = { sessionTimeStamps: [], sessionArray: [] };
  public highestPointOverall:number = 0;
  public overallElevationChange:number = 0;
  public lowestPointOverall:number = 0;

  public highestPointLastSession:number=0;
  public elevationChangeLastSession:number=0;
  public lowestPointLastSession:number=0;

  constructor(private modalCtrl: ModalController,
                    public storageService: StorageService,
                    public statsService: StatsService,
                    private cdr: ChangeDetectorRef,
                    public unitService: UnitServiceService,
                    public settingService :SettingsDataService
  ) {
    this.setDefaults();
  }
  async setDefaults() : Promise<void> {
    this.highestPointOverall = await this.statsService.gethighestPointOverall();
    this.overallElevationChange = await this.statsService.gethighestOverallElevationChange();
    this.lowestPointOverall = await this.statsService.getlowestPointOverall();

    this.highestPointLastSession = await this.statsService.getHighestPointInLastSession();
    this.elevationChangeLastSession = await this.statsService.getElevationChangeInLatestSession();
    this.lowestPointLastSession = await this.statsService.getlowestPointLastSession();
  }
  async openSettings() {

    const modal = await this.modalCtrl.create({
      component: SettingsPage,
    });
    await modal.present();
    modal.onWillDismiss().then(_ => {
    });

  }
  ionViewDidEnter() {
    this.updateChart();
    this.updateStats();
  }
  private async updateStats(){

    this.highestPointLastSession = await this.statsService.getHighestPointInLastSession();
    this.lowestPointLastSession = await this.statsService.getlowestPointLastSession();
    this.elevationChangeLastSession = await this.statsService.getElevationChangeInLatestSession();

    this.lowestPointOverall = await this.statsService.getlowestPointOverall();
    if(this.highestPointLastSession > await this.statsService.gethighestPointOverall()){
      await this.statsService.sethighestPointOverall(this.highestPointLastSession);
    }
    this.highestPointOverall = await this.statsService.gethighestPointOverall();

    if(await this.statsService.getIsLowestPointSet()==="true")
    {
          if (this.lowestPointLastSession < await this.statsService.getlowestPointOverall()) {
              await this.statsService.setlowestPointOverall(this.lowestPointLastSession);
          }
          this.lowestPointOverall = await this.statsService.getlowestPointOverall();
    }
    else
    {
      if(await this.storageService.getTrackingStatus() ==="true")
      {
        await this.statsService.setlowestPointOverall(this.highestPointLastSession);
        await this.statsService.setIsLowestPointSet("true");
        this.lowestPointOverall = await this.statsService.getlowestPointOverall();
      }
    }
    if(this.elevationChangeLastSession > await this.statsService.gethighestOverallElevationChange())
    {
      await this.statsService.sethighestOverallElevationChange(this.elevationChangeLastSession);
    }
    this.overallElevationChange = await this.statsService.gethighestOverallElevationChange();

    this.cdr.detectChanges();
  }

  private updateChart(): void {
    this.statsService
      .getDataForChart()
      .then((data) => {
        if (
          !this.areArraysEqual(data.sessionTimeStamps, this.lastData.sessionTimeStamps) ||
          !this.areArraysEqual(data.sessionArray, this.lastData.sessionArray)
        ) {
          this.createChart(data.sessionTimeStamps, data.sessionArray);
          this.lastData = { ...data };
          console.log('Updated chart');
        }

      })
      .catch((error) => {
        console.error('Error getting data for chart:', error);
      });
  }

  private createChart(sessionTimeStamps: string[], sessionArray: string[]): void {
    var existingChart = Chart.getChart("myChart");

    if (existingChart) {
      existingChart.destroy();
    }

    // Create the new chart
    var myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: sessionTimeStamps,
        datasets: [
          {
            label: 'Elevation from latest session',
            data: sessionArray
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          },
        }
      }
    });
  }

  private areArraysEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }
}
