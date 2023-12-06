## Bank app with modal window
19/10/2023  


V nové složce
```sh
ionic start sheet blank --type=angular
cd sheet
ionic serve
```

sheet/src/app/home
```sh
ionic g c deposit-modal
```





### home.page.html

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


    <ion-list>
      <ion-item 
      *ngFor="let account of balances"
      (click)="openModal(account)">
        <ion-label>
          <h2>{{ account.name}}</h2>
          <h3>{{ account.balance}}</h3>
        </ion-label>
      </ion-item>
    </ion-list>
  </div>




</ion-content>

```


home.page.ts

```ts
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { DepositModalComponent } from './deposit-modal/deposit-modal.component';


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
      name: "Jana",
      balance: 70000
    }
];

  constructor(private modalCTRL: ModalController, private alertCTRL: AlertController) {}

  async openModal(account: Account){
   // alert(account.name);

    const modal = await this.modalCTRL.create({
      component: DepositModalComponent,
      componentProps: {
        name: account.name,
        balance: account.balance
      }
   });

   await modal.present();

   // Continue
   // Cancel/Deposited

   const {data: newBalance, role} = await modal.onWillDismiss();

   if (role === "deposited"){
   // alert(newBalance);

    const index = this.balances.findIndex(acc => acc.name === account.name);
    this.balances[index].balance = newBalance;

    const alert = await this.alertCTRL.create({
      header: "Success",
      message: "Amount has been deposited",
      buttons: ["Okay"]
    });

    await alert.present();
   }



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

// added
import { DepositModalComponent } from './deposit-modal/deposit-modal.component';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    // added
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, DepositModalComponent]
})
export class HomePageModule {}

```





### deposit modal component.html

```html
<ion-header>
  <ion-toolbar>
    <ion-title>{{ name }}</ion-title>
    <ion-button (click)="dismissModal()">Close</ion-button>
  </ion-toolbar>
</ion-header>


<ion-content>
  <ion-input 
  [formControl] = "balanceInput"
   type="number"></ion-input>

   <ion-button 
   expand="block" 
   [disabled]="balanceInput.invalid"
   (click)="onDeposit()">Deposit</ion-button>


</ion-content>
```


### deposit modal component.ts

```ts
import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-deposit-modal',
  templateUrl: './deposit-modal.component.html',
  styleUrls: ['./deposit-modal.component.scss'],
})
export class DepositModalComponent {
@Input() name: string = "";
@Input() balance: number = 0;

balanceInput = new FormControl("",Validators.required);

  constructor(private modalCTRL: ModalController) { }

dismissModal() {
  this.modalCTRL.dismiss(null, "cancel");
}

onDeposit(){
  // alert("Deposit");

  if (this.balanceInput.value != null){
    const newBalance = this.balance + this.balanceInput.value;
    this.modalCTRL.dismiss(newBalance, "deposited");
  }
}

}

```

