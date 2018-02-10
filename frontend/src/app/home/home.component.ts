import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ItemService } from '../item.service';
import { Item } from '../item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  params: any;
  items: Item[];

  constructor(private itemService: ItemService, private route:ActivatedRoute, private router:Router) {
    this.params = {};
    this.route.params.subscribe(res => {
      this.params = {type: res.type};
    });
    this.route.queryParams.subscribe(res => {
      Object.assign(this.params, res);
    }); 

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.getItems();
      }
    });
  }

  ngOnInit() {
    this.getItems();
  }
  onSubmit(form:NgForm){
    this.router.navigate([this.params.type], {queryParams:form.value});
  }

  getItems() : void {
    this.itemService.getItems(this.params).subscribe(items => this.items = items);
    //this.itemService.getItem(2).subscribe(item => console.log(item));
  }

  viewDetails(id: number) {
    this.router.navigate([this.params.type+'/'+id+'/details']);
  }

  deleteItem(id: number){
    this.itemService.deleteItem(id).subscribe(x => {
      this.getItems(); //refresh
    });
  }

}
