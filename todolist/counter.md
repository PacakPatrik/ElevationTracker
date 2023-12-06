

```html

<ion-content [fullscreen]="true">
  <div id="container">
    <strong>Ready to create an app test?</strong>
    <p>Start with Ionic <a target="_blank" rel="noopener noreferrer"
        href="https://ionicframework.com/docs/components">UI Components</a></p>

    <h1>Count: {{ count}}</h1>

    <ion-button shape="round" (click)="increase()">
      Increase
    </ion-button>

  </div>
</ion-content>

```

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
count = 0;

increase(){
  this.count++;
}

  constructor() {}

}
```

