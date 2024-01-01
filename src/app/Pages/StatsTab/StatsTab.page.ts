import { Component } from '@angular/core';
import {SettingsPage} from "../Settings/settings.page";
import {ModalController} from "@ionic/angular";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import {StorageService} from "../../services/storage-service/storage.service";
import {StatsService} from "../../services/stats-service/stats.service";

@Component({
  selector: 'app-StatsTab',
  templateUrl: 'StatsTab.page.html',
  styleUrls: ['StatsTab.page.scss']
})
export class StatsTabPage {
  private lastData: { sessionTimeStamps: string[], sessionArray: string[] } = { sessionTimeStamps: [], sessionArray: [] };

  constructor(private modalCtrl: ModalController,
              private storageService:StorageService,
              private statsService : StatsService
  ) {}

  async openSettings() {

    const modal = await this.modalCtrl.create({
      component: SettingsPage,
    });
    await modal.present();
    modal.onWillDismiss().then(_ => {
    });

  }
  ionViewDidEnter() {
    this.loadData();
    this.updateStats();
  }

  private loadData(): void {
    this.updateChart();
  }
  private updateStats(){
    //TO DO: kontrolovat a nastavit highest overall, ve view nastavit last session staty
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
    // Assuming "myChart" is an element in your template with an ID
    var existingChart = Chart.getChart("myChart");

    // Destroy the existing chart if it exists
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
        // Your chart options here
      }
    });
  }

  private areArraysEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }
}
