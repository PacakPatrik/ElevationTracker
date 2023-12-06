import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services/places/places.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  allData: any; 
  imageURL: string = "empty"; 
  region = "";
  population = "";
  startOfWeek = "";
  myDomain = "";


  constructor(
    private placeService: PlacesService 
  ) { }

  ngOnInit() {
    this.allData = this.placeService.data[0]; 

    console.log("All data");
    console.log(this.allData);

    //new 
    const url = this.allData.coatOfArms.png;
    this.imageURL = url;
    this.myDomain = this.allData.tld[0];
    
    this.startOfWeek = this.allData.startOfWeek;
    this.population = this.allData.population;
    this.region = this.allData.region;



   // const map = this.allData.maps.googleMaps;
   // this.mapURL = map;


    //this.myIframe = `<iframe src="${this.mapURL}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;


  
    console.log(url);
  }

}
