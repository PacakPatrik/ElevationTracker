import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { WeatherModalComponent } from './weather-modal/weather-modal.component';
import { PlacesService } from '../services/places/places.service';
//import { Preferences } from '@capacitor/preferences';

// npm install @capacitor/preferences in the app folder
import { Preferences } from '@capacitor/preferences';



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
   // private placesService: PlacesService
    ) {


    const setName = async () => {
      await Preferences.set({
        key: "name",
        value: "Filip"
      });
    };

   // setName();

    const checkName = async () => {
      const { value } = await Preferences.get({
        key: "name"
      });

      alert(`Hello ${value}`);
    }

   // checkName();


    // Step 1 for countries fetch in HomePage constructor
    const getCountryData = async () => {
      const { value } = await Preferences.get({
        key: "homeFetchData"
      });

      if (value) {
        const fetchedItems = JSON.parse(value); // T F T F
        this.countriesDataArray = fetchedItems;
      }
    }


    getCountryData();









    /*  const setName = async () => {
        await Preferences.set({
          key: 'name',
          value: 'Max',
        });
      };


      setName();

      const checkName = async () => {
        const { value } = await Preferences.get({ key: 'name' });
      
        console.log(`Hello ${value}!`);
      };


      checkName();*/



    }

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
    this.placesService.data = data;
  }





  //sendData(data: any){
  //  console.log("Send");
   // console.log(data);
   // this.placesService.data = data;
  //}

  fetchData(countries: any){ // countries = [{label: Czechia.., checked: ....}.....]
    this.countriesDataArray = [];

    for (var c of countries){
      const url = `https://restcountries.com/v3.1/name/${c.label}`;

      this.http.get(url).subscribe(data => {
        console.log(data);
        this.countriesDataArray.push(data);

        // Step 3 save data
      const saveStoredItems = async () => {
        await Preferences.set({
          key: "homeFetchData",
          value: JSON.stringify(this.countriesDataArray)
        });
      };
  
      saveStoredItems();


      });

      console.warn(this.countriesDataArray);
    }

    console.log("Load data from API");
    
  }

}
