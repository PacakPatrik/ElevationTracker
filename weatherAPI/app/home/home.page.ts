import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WeatherModalComponent } from './weather-modal/weather-modal.component';
import { PlacesService } from '../services/places/places.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  countriesDataArray: any[] = [];

  constructor(
    public modalCTRL: ModalController, 
    public http: HttpClient, 
    // new
    private placesService: PlacesService
    ) {}

  async openModal(){
    const modal = await this.modalCTRL.create({
      component: WeatherModalComponent
    });

    await modal.present();
    const {data: newData, role} = await modal.onWillDismiss();

    // Read data
    if (role === "location"){
      console.log(newData);

      this.fetchData(newData);
    }
  }


  sendData(data: any){
  //  console.log("Send");
   // console.log(data);
    this.placesService.data = data;
  }

  fetchData(countries: any){ // countries = [{label: Czechia.., checked: ....}.....]
    this.countriesDataArray = [];

    for (var c of countries){
      const url = `https://restcountries.com/v3.1/name/${c.label}`;

      this.http.get(url).subscribe(data => {
        console.log(data);
        this.countriesDataArray.push(data);
      });

      console.warn(this.countriesDataArray);
    }

    console.log("Load data from API");
    
  }

}
