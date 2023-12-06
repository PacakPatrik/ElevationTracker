
https://datausa.io/api/data?drilldowns=Nation&measures=Population


home.page.html
```html
<ion-content [fullscreen]="true">
  <div id="container">
   <h1>USA Data</h1>

   <div *ngIf="jsonData">
    We have data
    
    <ul>
      <li *ngFor="let item of jsonData.data">
        <h3>Year: {{  item.Year }}</h3>
      </li>
    </ul>
   </div>
  </div>
</ion-content>
```




home.page.ts
```ts

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  jsonData: any;

// https://datausa.io/api/data?drilldowns=Nation&measures=Population
  constructor(public httpClient: HttpClient) {
    this.loadData();
  }


  loadData() {
    const url = "https://datausa.io/api/data?drilldowns=Nation&measures=Population";

    this.httpClient.get(url)
                  .subscribe(data => {
                    console.log(data);
                    this.jsonData = data;
                  });

  }

}

```

app.module.ts

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'

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
