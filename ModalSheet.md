## Modal sheet 


### 1) Create app
```sh
ionic start sheet blank --type=angular
cd sheet
ionic serve
```

### 2) Create component
```sh
cd sheet/src/app/home/
ionic g c deposit-modal
```


src/app/home/home.page.html

```html
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
   <h2>Balances</h2>

   <h3>Location: {{ selectedLocation }}</h3>

   <ion-item button *ngFor="let account of balances" (click)="openModal(account)">
    <ion-label>
      <h2>{{ account.name}}</h2>
      <h2>{{ account.balance}}</h2>
    </ion-label>
   </ion-item>

   <div *ngIf="jsonData != null">
      <h2>We have data</h2>
      <table class="styled">
        <th>Name</th>
        <th>Flag</th>
        <tr>
         <td>{{ jsonData[0].capital}}</td> <td>{{ jsonData[0].flag}}</td>
       </tr>
      </table>

      <style>
        .styled {
          border: 1px solid green;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid green;
        }

      </style>
   </div>

  </div>
</ion-content>

```



```ts
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DepositModalComponent } from './deposit-modal/deposit-modal.component';
import { HttpClient } from '@angular/common/http';

class Account {
  name: string;
  balance: number;

  constructor(name: string, balance: number){
    this.name = name;
    this.balance = balance;
  }
}



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  balances: Account[] = [
   {
    name: "Filip",
    balance: 100000
   },
   {
    name: "Karel",
    balance: 80000
   },
   {
    name: "Vašek",
    balance: 90000
   },
  ];

  selectedLocation: any;
  jsonData:any;

  constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, public httpClient: HttpClient) {}

  async openModal(account: Account){

    const modal = await this.modalCtrl.create({
      component: DepositModalComponent,
      componentProps: { name: account.name, balance: account.balance }
    });

    await modal.present();

    const {data: newBalance, role} = await modal.onWillDismiss();

    if (role === "deposited"){
      const index = this.balances.findIndex(acc => acc.name === account.name);
      this.balances[index].balance = newBalance;

      const alert = await this.alertCtrl.create({header: "Success", message: "Amount has been deposited", buttons: ["OK",]})
      await alert.present();
    }

    if (role === "location"){
      this.selectedLocation = newBalance;
      this.loadData(newBalance);
     
    }

    


    // alert(data.data);
  }

  loadData(city: any) {
    const url = `https://restcountries.com/v3.1/name/${city}` //"https://datausa.io/api/data?drilldowns=Nation&measures=Population";

    this.httpClient.get(url)
                  .subscribe(data => {
                    console.log(data);
                    this.jsonData = data;
                  });

  }

  // cd sheet/src/app/home/
  // ionic g c deposit-modal
}
```


## Deposit modal component.html
```ts
<p>
  deposit-modal works!
</p>

<ion-header>

  <ion-toolbar>
    <ion-title>{{ name }}</ion-title>
    <ion-button (click)="dismissModal()">Close</ion-button>
  </ion-toolbar>
</ion-header>



<ion-content class="ion-padding">
<ion-item>
    <ion-label position="floating">Amount</ion-label>
    <ion-input [formControl]="balanceInput" type="number"></ion-input>
</ion-item>

<ion-list>
    <ion-item (click)="onLocationClick('Czechia')">Czechia</ion-item>
    <ion-item (click)="onLocationClick('Slovakia')">Slovakia</ion-item>
    <ion-item (click)="onLocationClick('Germany')">Germany</ion-item>
</ion-list>


<ion-button [disabled]="balanceInput.invalid" expand="block" (click)="onDeposit()" class="ion-margin-top">Deposit</ion-button>

</ion-content>
```


deposit modal component.ts
```ts

import { Component, Input } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss'],
})
export class DepositModalComponent  {

  @Input() name: string = "";
  @Input() balance: number = 0;
  
  balanceInput = new FormControl("", Validators.required);

  constructor(private modalCtrl: ModalController) { }

  dismissModal() {
    this.modalCtrl.dismiss(null, "cancel");
  }

  onDeposit(){

    if (this.balanceInput.value != null){
      const newBalance = this.balance + this.balanceInput.value;
      this.modalCtrl.dismiss(newBalance, "deposited");
    //  alert(newBalance);
    }
    
  }


  onLocationClick(locations: any){
   // alert(location);

   this.modalCtrl.dismiss(locations, "location");
  }
}

```




home.module.ts
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { DepositModalComponent } from './deposit-modal/deposit-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, DepositModalComponent]
})
export class HomePageModule {}
```


app.module.ts
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
