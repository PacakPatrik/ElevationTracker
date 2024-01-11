import {Component, ElementRef, HostListener} from '@angular/core';
import { LocationService } from "../../services/location-service/location.service";
import { ElevationService } from "../../services/elevation-service/elevation.service";
import {interval, map, Observable, of, Subject, timer} from "rxjs";
import { switchMap, takeUntil } from 'rxjs/operators';
import { Elevation } from "../../model/elevation.model";
import {SettingsPage} from "../Settings/settings.page";
import {ModalController} from "@ionic/angular";
import {SettingsDataService} from "../../services/settings-data-service/settings-data.service"
import {StorageService} from "../../services/storage-service/storage.service";
import {UnitServiceService} from "../../services/unit-service/unit-service.service";

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
  backgroundStyle: string = '';
    constructor(
        private elevationService: ElevationService,
        private locationService: LocationService,
        private modalCtrl: ModalController,
        public settingService : SettingsDataService,
        public storageService : StorageService,
        private unitService : UnitServiceService
    ) {
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
      await this.storageService.setTrackingStatus(true);
      this.isTracking = true;
      this.destroy$.next();
      this.destroy$.complete();
      await this.storageService.resetSession();





        this.locationService.getLocation().then(coordinates => {
          this.elevation$ = this.elevationService.getByGeo$(coordinates.coords.latitude, coordinates.coords.longitude)
            .pipe(
              takeUntil(this.destroy$),
                map(data => this.unitService.performCalculation(data))
            );

          this.elevation$.subscribe(data => {


            //store data
            this.storageService.setSessionArray(String(data.results?.[0].elevation));
            this.storageService.setSessionTimeStamps(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/\s*(AM|PM)\s*/, ''));

            console.log(this.storageService.getObject("sessionTimeStamps"));
            console.log(this.storageService.getObject("sessionArray"));
          });
        });



        this.startTimer();
        this.buttonText = 'Stop tracking';
        this.buttonColor = 'danger';
    }
    async stopTracking(){
      await this.storageService.setTrackingStatus(false);
      this.isTracking =false;
      this.stopTimer();
      this.buttonText = 'Start tracking';
      this.buttonColor = 'success';
    }

    async ngOnDestroy() {
      await this.storageService.setTrackingStatus(false);
      // Ensure that the observable is unsubscribed when the component is destroyed
      this.destroy$.next();
      this.destroy$.complete();

    }
  @HostListener('window:beforeunload', ['$event'])
  async beforeUnloadHandler(event: Event) {
    await this.storageService.setTrackingStatus(false);
  }
  startTimer() {
    this.timer = setInterval(() => {
      this.time++;

      this.locationService.getCurrentPositionWatch();

      this.locationService.getLocation().then(coordinates => {
        this.elevation$ = this.elevationService.getByGeo$(coordinates.coords.latitude, coordinates.coords.longitude)
          .pipe(
            takeUntil(this.destroy$),
              map(data => this.unitService.performCalculation(data))
          );

        this.elevation$.subscribe(data => {

          console.log(data);

          this.storageService.setSessionArray(String(data.results?.[0].elevation));
          this.storageService.setSessionTimeStamps(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/\s*(AM|PM)\s*/, ''));
          console.log(this.storageService.getObject("sessionArray"));
          console.log(this.storageService.getObject("sessionTimeStamps"));
        });
      });


    }, Number(this.settingService.settingsArray[0]));
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
    this.storageService.getData();
  }
}
