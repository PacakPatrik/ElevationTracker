import {ChangeDetectorRef, Component, ElementRef, HostListener} from '@angular/core';
import {LocationService} from "../../services/location-service/location.service";
import {ElevationService} from "../../services/elevation-service/elevation.service";
import {interval, map, Observable, of, Subject, timer} from "rxjs";
import {switchMap, takeUntil} from 'rxjs/operators';
import {Elevation} from "../../model/elevation.model";
import {SettingsPage} from "../Settings/settings.page";
import {ModalController} from "@ionic/angular";
import {SettingsDataService} from "../../services/settings-data-service/settings-data.service"
import {StorageService} from "../../services/storage-service/storage.service";
import {UnitServiceService} from "../../services/unit-service/unit-service.service";
import {StatsService} from "../../services/stats-service/stats.service";
import {Chart} from "chart.js";


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
  private isTracking: boolean;
  buttonText: string = 'Start tracking';
  buttonColor: string = 'success';
  private lastData: { sessionTimeStamps: string[], sessionArray: string[] } = {sessionTimeStamps: [], sessionArray: []};


  constructor(
    private elevationService: ElevationService,
    private locationService: LocationService,
    private modalCtrl: ModalController,
    public settingService: SettingsDataService,
    public storageService: StorageService,
    private unitService: UnitServiceService,
    public statsService: StatsService,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    this.isTracking = false;
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

      this.elevation$.subscribe(async data => {


        await this.updateData(data);

      });
    });


    this.startTimer();
    this.buttonText = 'Stop tracking';
    this.buttonColor = 'danger';
  }

  async stopTracking() {
    await this.storageService.setTrackingStatus(false);
    this.isTracking = false;
    this.stopTimer();
    this.buttonText = 'Start tracking';
    this.buttonColor = 'success';
  }

  /*async ngOnDestroy() {
    await this.storageService.setTrackingStatus(false);
    // Ensure that the observable is unsubscribed when the component is destroyed
    this.destroy$.next();
    this.destroy$.complete();

  }*/

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
            map(data => this.unitService.performCalculation(data)

            )
          );

        this.elevation$.subscribe(async data => {
          await this.updateData(data);
        });
      });


    }, Number(this.settingService.settingsArray[0]));
  }

  stopTimer() {
    clearInterval(this.timer);
    this.time = 0;
    this.timerSubject.next(this.time);

  }


  async updateData(data: any) {

    this.storageService.setSessionArray(String(data.results?.[0].elevation));
    this.storageService.setSessionTimeStamps(new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\s*(AM|PM)\s*/, ''));
    this.statsService.updateStats(this.cdr);
    await this.updateChart();

  }


  async updateChart() {


    this.statsService
      .getDataForChart()
      .then((data) => {
          this.createChart(data.sessionTimeStamps, data.sessionArray);
          this.lastData = {...data};
          console.log('Updated chart');
      })
      .catch((error) => {
        console.error('Error getting data for chart:', error);
      });


  }

  private createChart(sessionTimeStamps: string[], sessionArray: string[]): void {

    setTimeout(() => {
      const canvasElement = document.getElementById('myChart') as HTMLCanvasElement;
      const ctx = canvasElement.getContext('2d');

      const existingChart = Chart.getChart('myChart');

      // Destroy the existing chart if it exists
      if (existingChart) {
        existingChart.destroy();
      }
      // Create the new chart
      var myChart = new Chart(canvasElement, {
        type: 'line',
        data: {
          labels: sessionTimeStamps,
          datasets: [
            {
              label: 'Elevation from latest session',
              data: sessionArray,
              pointRadius: 0,
              borderColor: 'rgba(75, 192, 192, 0.5)', // Set the border color
              borderWidth: 1, // Set the border width
              pointHoverRadius: 0, // Hide points on hover
              tension: 0.4
            }
          ]
        },
        options: {
          plugins: {

            legend: {
              display: false
            },


          },
          layout: {
            padding: {
              left:10,
              right: 50,
              bottom:10,
              top:10
            },
          },
          scales:{
            y: {

              display: false, // Hide the y-axis numbers
              grid: {
                display: false
              }
            },
            x: {
              display: true,
              ticks: {
                font:{
                  size:9
                } // Hide x-axis tick values
              }
            },
          },
          maintainAspectRatio: false,
        }
      });
    }, 100);
  }


  private areArraysEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
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

  ngOnInit() {
    this.statsService.updateStats(this.cdr);
    this.updateChart();
    this.storageService.getData();
  }
}
