import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {

  constructor(
    // Vložím servisku pro Dependency Injection (pro komunikaci s API skrze HTTP protokol)
    // private je doporučeno pro koncové třídy,
    //  pokud by se jednalo o abstraktní třídu, nebo třídu určenou k dědění použil bych public nebo protected
    private http: HttpClient
  ) {
  }

  /**
   * Get weather by GEO
   * @param lat Float
   * @param lng Float
   */
  getByGeo$(lat: number, lng: number) {
    // ukázka původního formátu requetu
    // https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}

    // klasické skládání stringů v JS/TS
    //return this.http.get(environment.baseUrl + "/weather?lat=" + lat + "&lon=" + lng + "&appid=" + environment.apiToken);

    // environment.ts (soubor), který obsahuje konstantu environment, která obsahuje následující strukturu
    // environment je zde pro možnost změny různých vývojových prostředí (DEV, STAGING, PRODUCTION...),
    //  které se mění automaticky pomocí buildu aplikace (ionic build, ionic build prod, ng build, ng build prod, ...)
    // environment.ts i environment.prod.ts musejí mít stejnou strukturu!!!
    // moderní skládání stringů v JS/TS
    return this.http.get(`${environment.baseUrl}${lat},${lng}`);
  }
}
