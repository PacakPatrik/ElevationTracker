# WeatherAPI 
FIX problému:

Ve funkci ```checkItemsThatAreInLocalStorage()``` nahraďte řádek:
```ts
const selectedItems = JSON.parse("selectedItems");
```
řádkem:
```ts
const selectedItems = JSON.parse(storedItems);
```
Pak bude vše fungovat a pole se budou správně zaškrtávat. :)



Zde máte celý kód, příště ho doděláme:

Commands  
ionic start sheet blank --type=angular   
cd sheet  
ionic serve  
 
weatherApp/src/app  
ionic g service services/places/places  

weatherApp/src/app/home  
ionic g c deposit-modal  

home.page.html
```html
home.page.html
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>
      Blank
    </ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">Blank</ion-title>
    </ion-toolbar>
  </ion-header>

  <div id="container">
    <h1>USA Data</h1>

    <ion-button (click)="openModal()">Open modal</ion-button>

    <div *ngIf="countriesData">
      <h2>Country selected</h2>
      <ion-item *ngFor="let item of countriesDataArray">
        <h2>{{item[0].flag}}</h2>
      
        <ion-item [routerLink]="['/detail', item[0].capital[0]]" (click)="sendData(item)">
          {{ item[0].name.common }}
        </ion-item>
      </ion-item>
      </div>

    <div *ngIf="jsonData" style="display: none">
      <ion-item *ngFor="let item of jsonData.data" [routerLink]="['/detail', item['ID Year']]" (click)="sendData(item)">
        {{ item['ID Year'] }}
      </ion-item>
      <!---app folder ionic g service services/places/places-->
    </div>
  </div>

  <!---https://datausa.io/api/data?drilldowns=Nation&measures=Population-->
</ion-content>

```

home/home.page.ts

```ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlacesService } from '../services/places/places.service';
import { ModalController } from '@ionic/angular';
import { MyModalComponent } from './my-modal/my-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  jsonData: any
  countriesData: any
  countriesDataArray: any[] = [];
  backup: any
  filterYear: any

  constructor(public httpClient: HttpClient,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    ) { // quick fix imports this
    this.loadData();
  }

  async openModal(){
    const modal = await this.modalCtrl.create({
      component: MyModalComponent,
    });

    await modal.present();

    const {data: newBalance, role} = await modal.onWillDismiss();

    if (role === "deposited"){
    }

    if (role === "location"){
      this.fetchCountryData(newBalance);
     }
  }


  fetchCountryData(country: any){

    this.countriesDataArray = [];
    for (var c of country) {
      const url = `https://restcountries.com/v3.1/name/${c.label}`;
    this.httpClient.get(url)
    .subscribe(data => { 
      console.log(data); 
      this.countriesData = data;
      this.countriesDataArray.push(data);
      console.warn(this.countriesDataArray);
    });
    }
   
  }

  loadData(){
    this.httpClient.get("https://datausa.io/api/data?drilldowns=Nation&measures=Population")
    .subscribe(data => { // lze nahradit async
      console.log(data);
      this.backup = data;
      this.jsonData = data;
    });


    const storedItems = localStorage.getItem('selectedItems');
    if (storedItems) {
      const selectedItems = JSON.parse(storedItems);
      this.fetchCountryData(selectedItems);
    }
  }

  sendData(arg: any){
    this.placesService.data = arg;
  }


}
```


### src/app/app/app-routing-module.ts


```ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { // auto
    path: 'detail/:id',
    loadChildren: () => import('./pages/detail/detail.module').then( m => m.DetailPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```




```ts







```



### mymodalcomponent.html

```html

<ion-content class="ion-padding">
  <ion-button (click)="dismissModal()">Close</ion-button>

  <ion-list>
    <ion-item *ngFor="let item of items">
      <ion-label>{{ item.label }}</ion-label>
      <ion-checkbox [(ngModel)]="item.checked"></ion-checkbox>
    </ion-item>
  </ion-list>

  <ion-button expand="full" (click)="submit()">Submit</ion-button>

</ion-content>
```


### mymodalcomponent.ts
```ts
import { Component, Input, EventEmitter} from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrls: ['./my-modal.component.scss'],
})
export class MyModalComponent{
  name = "Filiop";
  @Input() balance: number = 0;

  items = [
    { label: 'Czechia', checked: false },
    { label: 'Slovakia', checked: false },
    { label: 'Austria', checked: false },
    { label: 'Germany', checked: false },
  ];

  constructor(private modalCtrl: ModalController) { 
/*
    const storedItems = localStorage.getItem('selectedItems');
    this.items = storedItems ? JSON.parse(storedItems) : this.getDefaultItems();
  */

    this.items = this.getDefaultItems(); // Fetch all items in the constructor

    const storedItems = localStorage.getItem('selectedItems');
    if (storedItems) {
      const selectedItems = JSON.parse(storedItems);
      // Update the checked state of items based on what's in localStorage
      this.items.forEach(item => {
        item.checked = selectedItems.some((selectedItem: { label: string; }) => selectedItem.label === item.label);
      });
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, "cancel");
  }

  onLocationClick(locations: any){
    // alert(location);
 
    locations.checked = !locations.checked;

    // Save the updated items to localStorage
    localStorage.setItem("selectedItems", JSON.stringify(this.items));


    this.modalCtrl.dismiss(locations, "location");
   }


   submit(){
    const selectedItems = this.items.filter((item) => item.checked);

    
   // localStorage.setItem("k", "O");
   localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    console.log('Selected Items:', selectedItems);
    this.modalCtrl.dismiss(selectedItems, "location");
   }

  onDeposit(){

   // if (this.balanceInput.value != null){
      const newBalance = 3000; //this.balance + this.balanceInput.value;
      this.modalCtrl.dismiss(newBalance, "deposited");
      alert(newBalance);
  //  }
    
  }

  private getDefaultItems() {
    return [
      { label: 'Czechia', checked: false },
      { label: 'Slovakia', checked: false },
      { label: 'Austria', checked: false },
      { label: 'Germany', checked: false },
    ];
  }
}
```


### app/home/home.module.ts)

```ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { MyModalComponent } from './my-modal/my-modal.component';
import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, MyModalComponent]
})
export class HomePageModule {}

```



## app/app.module.ts

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## /app/pages/detail/detail.page.html

```ts
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-buttons slot="start">
      <!----ALWAYS one level back-->
      <ion-back-button></ion-back-button>
    </ion-buttons>

    <ion-title>detail</ion-title>

    <ion-buttons slot="end">
      <!----ALWAYS one level back-->
      <ion-button>asdf</ion-button>
      
    </ion-buttons>
    
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">detail</ion-title>
    </ion-toolbar>
  </ion-header>

  <div id="info">
    <h1> {{ allData.name.common }}</h1> 
    <h2> {{ allData.flag }}</h2> 
    <h2> {{ allData.fifa }}</h2> 

  </div>
</ion-content>
```



### services/places/places.service.ts

```ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  data: any; // new
  constructor() { }
}
```


## detailPage.ts

```ts
import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places/places.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  allData: any; // new

  constructor(
    private placeService: PlacesService // new
  ) { }

  ngOnInit() {
    this.allData = this.placeService.data[0]; // new
  }

}


// ionic g page pages/detail root folder
// add the detail
// lazy loading

// ionic g service services/places/places
// make service
```



### detailPage.html (new)

```html

<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>detail</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">
  <ion-header collapse="condense">
    <ion-toolbar>
      <ion-title size="large">detail</ion-title>
    </ion-toolbar>
  </ion-header>


<!----NEW----->
  <h1> {{ allData.name.common }}</h1>

</ion-content>

```



