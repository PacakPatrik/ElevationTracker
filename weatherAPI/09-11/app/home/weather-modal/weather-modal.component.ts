import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ModalController } from '@ionic/angular';



@Component({
  selector: 'app-weather-modal',
  templateUrl: './weather-modal.component.html',
  styleUrls: ['./weather-modal.component.scss'],
})

export class WeatherModalComponent {
 

  items = [
    { label: "Czechia", checked: false},
    { label: "Slovakia", checked: false},
    { label: "Austria", checked: false},
    { label: "Germany", checked: false}
  ]

  constructor(private modalCTRL: ModalController) {
    this.items = this.getItems();



   

// Capacitor step 2




const getStoredItems = async () => {
const {value} = await Preferences.get({
  key: "jsonData"
});

if (value){
  const selectedItems = JSON.parse(value); // get array of objects from string

  this.items.forEach(item => {
    item.checked = selectedItems.some((selectedItem: { label: string; }) => selectedItem.label ===  item.label);
  });

}
}


getStoredItems();

/*
    const storedItems = localStorage.getItem('selectedItems');

    if (storedItems){
      const selectedItems = JSON.parse(storedItems); // T F T F
      // items = [F F F F]
      this.items.forEach(item => {
        item.checked = selectedItems.some((selectedItem: { label: string; }) => selectedItem.label ===  item.label);
      });
    }*/






   }


   dismissModal(){
    this.modalCTRL.dismiss(null, "cancel");
   }

   submit(){
    const selectedItems = this.items.filter((item) => item.checked);

    const saveStoredItems = async() => {
      await Preferences.set({ 
        key: "jsonData",
        value: JSON.stringify(selectedItems)
      });
    }

    saveStoredItems();





    this.modalCTRL.dismiss(selectedItems, "location");
   }


   getItems(){
    return [
      { label: "Czechia", checked: false},
      { label: "Slovakia", checked: false},
      { label: "Austria", checked: false},
      { label: "Germany", checked: false}
    ]
   }



}
