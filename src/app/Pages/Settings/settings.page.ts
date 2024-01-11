import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SettingsDataService } from "../../services/settings-data-service/settings-data.service";
import { StorageService } from "../../services/storage-service/storage.service";

@Component({
  selector: 'app-Settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {
  form: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private settingsData: SettingsDataService,
    public storageService: StorageService
  ) {
    this.form = this.fb.group({name:['form'],
      "refreshRate": this.settingsData.settingsArray[0],
      "units": this.settingsData.settingsArray[1],
      "pictureOption": this.settingsData.settingsArray[2]});
    this.formInit();
  }
  async formInit(){
    await this.storageService.getData();

    this.form = this.fb.group({
      name: ['form'],
      "refreshRate": this.settingsData.settingsArray[0],
      "units": this.settingsData.settingsArray[1],
      "pictureOption": this.settingsData.settingsArray[2],
    });

    if (this.form.get('refreshRate')) {
      this.form.get('refreshRate')!.valueChanges.subscribe(data => {
        this.settingsData.settingsArray[0]=data;
        this.storageService.setObject("refreshRate", data);
      });
    }
    if(this.form.get('units')) {
      this.form.get('units')!.valueChanges.subscribe(data => {
        this.settingsData.settingsArray[1]=data;
        this.storageService.setObject("units", data);
      });
    }
    if(this.form.get('pictureOption')) {
      this.form.get('pictureOption')!.valueChanges.subscribe(data => {
        this.settingsData.settingsArray[2]=data;
        this.storageService.setObject("pictureOption", data);

        // You can perform additional actions here
      });
    }
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
