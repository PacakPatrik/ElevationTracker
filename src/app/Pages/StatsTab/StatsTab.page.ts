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

  constructor(private modalCtrl: ModalController,
                    public storageService: StorageService,
                    public statsService: StatsService,
                    private cdr: ChangeDetectorRef,
                    public unitService: UnitServiceService,
                    public settingService :SettingsDataService
  ) {
    this.statsService.setDefaults();
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
    this.storageService.getData();

  }




}
