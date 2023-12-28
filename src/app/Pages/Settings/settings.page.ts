import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-Settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
      private modalCtrl: ModalController,
      private fb: FormBuilder
  ) {

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
