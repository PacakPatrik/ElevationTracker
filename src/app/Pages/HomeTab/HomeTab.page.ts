import {Component} from '@angular/core';
import {WeatherApiService} from "../../services/weather-api/weather-api.service";
import {ElevationService} from "../../services/elevation-service/elevation.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-HomeTab',
  templateUrl: 'HomeTab.page.html',
  styleUrls: ['HomeTab.page.scss']
})
export class HomeTabPage {

  // Klasický zápis
  // nutné přepsat data pokaždé když data získám
  // je nutné kontrolovat existenci objektu a dalších zanořených objektů dodatečnýma podmínkama viz view
  /**
   * @deprecated Tento způsob není doporučován, lepší možnost je použít weather$ s kombinací s pipou async
   */
  data: any = {};

  // Pokročilejší zápis
  // využívá obserable pattern
  // datový typ se uvádí do <...> - generika
  //weather$: Observable<any>;

  constructor(
    // Vložím servisku pro Dependency Injection (má vlastní serviska)
    // private je doporučeno pro koncové třídy,
    //  pokud by se jednalo o abstraktní třídu, nebo třídu určenou k dědění použil bych public nebo protected
    private elevationService: ElevationService
  ) {
    // nastavým výstup funkce při načtení stránky (pozor, před načtením view)
    // zde se žádná data nezískávají!!! data se získají až ve view pomocí | async (pipy async)
    // až pipa async provede onen .subscribe(...), který získá data
    // zde se pouze předavají stejné datové typy getByGeo$(...): Observable<...> >>> this.weather$: Observable<any>
    //this.weather$ = this.weatherApiService.getByGeo$(0, 0)
  }

  /**
   * Get manual data
   *
   * @deprecated Tento způsob není doporučován, lepší možnost je použít weather$ s kombinací s pipou async
   */
 /* fetchData() {
    // získám data na pozici GEO 0,0 pomocí metody .subscribe(...)
    // používám servisku, které umožňuje přenášet logiku skrze Dependency Injection (DI)
    /*this.weatherApiService.getByGeo$(0, 0).subscribe(data => {
      // data získaná z requestu předám to proměnné this.data abych je mohl vypsat ve view (nahradím původní objekt uložený v data)
      this.data = data;
    })
  }*/
  startTracking() {
    this.elevationService.getByGeo$(0, 0).subscribe(data => {
     // data získaná z requestu předám to proměnné this.data abych je mohl vypsat ve view (nahradím původní objekt uložený v data)
     this.data = data;
        })
  }
}
