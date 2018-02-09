import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Item } from '../item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  items: Item[];

  constructor(private itemService: ItemService) { }

  ngOnInit() {
    this.getItems();    
  }

  getItems() : void {
    this.itemService.getItems().subscribe(items => this.items = items);
    //this.itemService.getItem(2).subscribe(item => console.log(item));
  }

}
