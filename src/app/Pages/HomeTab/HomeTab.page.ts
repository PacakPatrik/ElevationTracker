import { Component } from '@angular/core';
import { LocationService } from "../../services/location-service/location.service";
import { ElevationService } from "../../services/elevation-service/elevation.service";
import {Observable, of, Subject} from "rxjs";
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

    constructor(
        private elevationService: ElevationService,
        private locationService: LocationService
    ) {}

    startTracking() {
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
    }

    ngOnDestroy() {
        // Ensure that the observable is unsubscribed when the component is destroyed
        this.destroy$.next();
        this.destroy$.complete();
    }
}
