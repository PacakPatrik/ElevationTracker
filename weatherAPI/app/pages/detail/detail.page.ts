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
