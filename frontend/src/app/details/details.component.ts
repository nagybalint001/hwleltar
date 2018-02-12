import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute} from '@angular/router';
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
  extras: any;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router:Router,
    private location:Location) {
    this.route.params.subscribe(res => { this.params = {type:res.type, id:res.id}});
    this.extras = {};
  }

  ngOnInit() {
    if(this.params.id){
      this.itemService.getItem(this.params.id).subscribe(item => {
        this.item = item;
        this.loadExtras();
      });
    } else {
      this.item = new Item();
      this.item.type = this.params.type;
    }
  }

  loadExtras() {
    if(this.item.type.toUpperCase() == "VGA"){
      let extras = JSON.parse(this.item.extras);
      this.extras.memorytype = extras.memorytype;
      this.extras.memory = extras.memory;
      this.extras.displayport = extras.displayport;
    }
    else if(this.item.type.toUpperCase() == "CPU"){
      let extras = JSON.parse(this.item.extras);
      this.extras.socket = extras.socket;
      this.extras.threads = extras.threads;
      this.extras.frequency = extras.frequency;
    }

  }

  uploadImage(){
    alert("Not Implemented!");
  }

  onCancel(){
    this.location.back();
  }

  onSubmit(id, data){
    if(this.item.type.toUpperCase() == "VGA") {
      data.extras = JSON.stringify({memorytype: data.memorytype, memory: data.memory, displayport: data.displayport})
      delete data.memorytype;
      delete data.memory;
      delete data.displayport;
    } else if (this.item.type.toUpperCase() == "CPU"){
      data.extras = JSON.stringify({socket: data.socket, threads: data.threads, frequency: data.frequency})
      delete data.socket;
      delete data.threads;
      delete data.frequency;
    }
    if(id){
      this.itemService.updateItem(id, data, () => this.location.back()).subscribe();
    } else {
      this.itemService.createItem(data, () => this.location.back()).subscribe();
    }
  }

}
