import { Component } from '@angular/core';
//import { AlertComponent } from '@ionic';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
  tasks: string[] = [];
  newTask:string = "";


  constructor(/*public alertCTRL: AlertController*/) { 


  }


  addTask() {
   if (this.newTask.trim() != ""){
    this.tasks.push(this.newTask);
    this.newTask = "";
   } else {
    this.showAlert();
   }
  }

  async showAlert(){



    /*const alert = await alertCTRL.create({
      header: "Alert",
      subHeader: "Subtitle",
      message: "Something is missing",
      buttons: ["OK"]
    });

    await alert.present();*/
  }

  

}
