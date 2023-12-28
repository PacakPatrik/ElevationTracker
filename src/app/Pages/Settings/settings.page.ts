  import {Component, OnInit} from '@angular/core';
  import {ModalController} from "@ionic/angular";
  import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
  import {SettingsDataService} from "../../services/settings-data-service/settings-data.service";
  import {firstValueFrom} from "rxjs";

  @Component({
    selector: 'app-Settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
  })
  export class SettingsPage implements OnInit {
      form: FormGroup;

    constructor(
        private modalCtrl: ModalController,
        private fb: FormBuilder,
        private settingsData : SettingsDataService
    ) {
      this.form = this.fb.group({
        "refreshRate": [settingsData.settingsArray[0]],
        "units": [settingsData.settingsArray[1]],
        "pictureOption": [settingsData.settingsArray[2]]
      });

      if (this.form.get('refreshRate')) {
        this.form.get('refreshRate')!.valueChanges.subscribe(data => {
        settingsData.settingsArray[0]=data;
        });
      }
    if(this.form.get('units')) {
      this.form.get('units')!.valueChanges.subscribe(data => {
        settingsData.settingsArray[1]=data;
        // You can perform additional actions here
      });
    }
  if(this.form.get('pictureOption')) {
    this.form.get('pictureOption')!.valueChanges.subscribe(data => {
      settingsData.settingsArray[2]=data;
      // You can perform additional actions here
    });
  }
      }

    ngOnInit() {
    }

    /**
     * Modal Dismiss
     */
    async dismiss() {
      await this.modalCtrl.dismiss();
    }

  }
