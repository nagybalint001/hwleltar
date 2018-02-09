import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { ItemService } from '../item.service';
import { Item } from '../item';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  params: {type:string, id:number};
  item: Item;

  constructor(private itemService: ItemService, private route: ActivatedRoute) {
    this.route.params.subscribe(res => { this.params = {type:res.type, id:res.id}});
  }

  ngOnInit() {
    this.itemService.getItem(this.params.id).subscribe(item => this.item = item);
  }

}
