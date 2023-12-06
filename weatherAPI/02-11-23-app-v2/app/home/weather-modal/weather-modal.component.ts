import { Component } from '@angular/core';
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

    const storedItems = localStorage.getItem('selectedItems');

    if (storedItems){
      const selectedItems = JSON.parse(storedItems); // T F T F


      // items = [F F F F]
      this.items.forEach(item => {
        item.checked = selectedItems.some((selectedItem: { label: string; }) => selectedItem.label ===  item.label);
      });
    }

   }


   dismissModal(){
    this.modalCTRL.dismiss(null, "cancel");
   }

   submit(){
    const selectedItems = this.items.filter((item) => item.checked);
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
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
