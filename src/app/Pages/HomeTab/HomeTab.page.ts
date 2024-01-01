import {Component, ElementRef} from '@angular/core';
import { LocationService } from "../../services/location-service/location.service";
import { ElevationService } from "../../services/elevation-service/elevation.service";
import {interval, map, Observable, of, Subject, timer} from "rxjs";
import { switchMap, takeUntil } from 'rxjs/operators';
import { Elevation } from "../../model/elevation.model";
import {SettingsPage} from "../Settings/settings.page";
import {ModalController} from "@ionic/angular";
import {SettingsDataService} from "../../services/settings-data-service/settings-data.service"
import {StorageService} from "../../services/storage-service/storage.service";


@Component({
    selector: 'app-HomeTab',
    templateUrl: 'HomeTab.page.html',
    styleUrls: ['HomeTab.page.scss']
})
export class HomeTabPage {

  private destroy$ = new Subject<void>();
  elevation$: Observable<Elevation> | undefined;
  private timerSubject = new Subject<number>();
  public timer$: Observable<number> = this.timerSubject.asObservable();
  private timer: any;
  public time: number = 0;
  private isTracking : boolean;
  buttonText: string = 'Start tracking';
  buttonColor: string = 'success';
  public delay;
  backgroundStyle: string = '';
    constructor(
        private elevationService: ElevationService,
        private locationService: LocationService,
        private modalCtrl: ModalController,
        public settingService : SettingsDataService,
        private storageService : StorageService
    ) {
    this.delay = 30000;
      this.isTracking=false;
    }


  toggleTracking() {
    if (!this.isTracking) {
      this.startTracking();
    } else {
      this.stopTracking();
    }
  }

    async startTracking() {
      this.isTracking = true;
      this.destroy$.next();
      this.destroy$.complete();
      await this.storageService.resetSessionArray();


        this.locationService.getLocation().then(coordinates => {
          this.elevation$ = this.elevationService.getByGeo$(coordinates.coords.latitude, coordinates.coords.longitude)
            .pipe(
              takeUntil(this.destroy$),
                map(data => this.performCalculation(data))
            );

          this.elevation$.subscribe(data => {
            console.log(data);
            this.storageService.setSessionArray(String(data.results?.[0].elevation));
            console.log(this.storageService.getObject("sessionArray"));
          });
        });


        this.startTimer();
        this.buttonText = 'Stop tracking';
        this.buttonColor = 'danger';
    }
    stopTracking(){
      this.isTracking =false;
      this.stopTimer();
      this.buttonText = 'Start tracking';
      this.buttonColor = 'success';
    }

    ngOnDestroy() {
        // Ensure that the observable is unsubscribed when the component is destroyed
        this.destroy$.next();
        this.destroy$.complete();
    }

  startTimer() {
    this.timer = setInterval(() => {
      this.time++;

      this.locationService.getCurrentPositionWatch();

      this.locationService.getLocation().then(coordinates => {
        this.elevation$ = this.elevationService.getByGeo$(coordinates.coords.latitude, coordinates.coords.longitude)
          .pipe(
            takeUntil(this.destroy$),
              map(data => this.performCalculation(data))
          );

        this.elevation$.subscribe(data => {

          console.log(data);
          this.storageService.setSessionArray(String(data.results?.[0].elevation));
          console.log(this.storageService.getObject("sessionArray"));
        });
      });


    }, this.delay);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.time = 0;
    this.timerSubject.next(this.time);

  }


  async openSettings() {

    const modal = await this.modalCtrl.create({
      component: SettingsPage,
    });
    await modal.present();
    modal.onWillDismiss().then(_ => {
    });

  }

  getBackgroundStyle() {
    return `url(${this.settingService.settingsArray[2]}) 0 0/100% 100% no-repeat`
  }
  ngOnInit(){
  }


  private performCalculation(data: any) {
    if (this.settingService.settingsArray[1] === 'meters') {
      return data;
    } else {
      const metersToFeetConversionFactor = 3.2808399;

      // Check if elevation data is available and has a valid value
      if (data?.results?.[0]?.elevation !== undefined) {
        const elevationInMeters = data.results[0].elevation;
        const elevationInFeet = elevationInMeters * metersToFeetConversionFactor;
        data.results[0].elevation = Math.trunc(elevationInFeet);
        return data;
      } else {
        return data; // Return unchanged data if elevation is not available or not valid
      }
    }
  }
}
