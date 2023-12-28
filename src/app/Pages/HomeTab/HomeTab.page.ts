import { Component } from '@angular/core';
import { LocationService } from "../../services/location-service/location.service";
import { ElevationService } from "../../services/elevation-service/elevation.service";
import {interval, Observable, of, Subject, timer} from "rxjs";
import { switchMap, takeUntil } from 'rxjs/operators';
import { Elevation } from "../../model/elevation.model";


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
    constructor(
        private elevationService: ElevationService,
        private locationService: LocationService
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
      this.isTracking = true;
      this.destroy$.next();
      this.destroy$.complete();




        this.locationService.getLocation().then(coordinates => {
          this.elevation$ = this.elevationService.getByGeo$(coordinates.coords.latitude, coordinates.coords.longitude)
            .pipe(
              takeUntil(this.destroy$)
            );

          this.elevation$.subscribe(data => {
            console.log(data);
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
            takeUntil(this.destroy$)
          );

        this.elevation$.subscribe(data => {
          console.log(data);
        });
      });


    }, 10000);
  }

  stopTimer() {
    clearInterval(this.timer);
    this.time = 0;
    this.timerSubject.next(this.time);

  }

}
