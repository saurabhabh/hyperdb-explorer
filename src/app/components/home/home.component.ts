import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import {MatListItem, MatDialog, MatDialogConfig} from '@angular/material';
import { ViewNodeComponent } from '../view-node/view-node.component';
import { nodeClass } from '../../model/nodeClass';
const autosuggestTrie = require('autosuggest-trie');
const sortBy = require('sort-by');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  maxRecords:number = 30;
  nodes:Array<nodeClass> = [];
  folderPath: string = "";
  listItems:Array<any> = [];
  isExploring:boolean = false;
  isLoading: boolean = true;
  
  constructor(public electronservice: ElectronService,
    public confirmdialog: MatDialog, ) {
  }

  ngOnInit() {
    // DO nothing
  }

  // Update Nodes based on the filter that is passed. 
  updateNodes(filter:String){
  
    let list = this.listItems;
    
    list.sort(sortBy('key'))
    const autosuggest = autosuggestTrie(list, 'key')
    
    const line = filter;
    let items = [];
    if(filter){
      items = line ? autosuggest.getMatches(line) : list
    }
    else{
      items = list;
    }
    
    if(items && items.length > 0){
      this.nodes = [];
    }
    let i = 0;
    items.forEach(item => {
      if(i < this.maxRecords){
        let node = new nodeClass();
        node.isViewing = false;
        node.nodeId = item.i;
        node.key = item.key
        this.nodes.push(node);
        i = i + 1;
      }
     
    });
  }

  // Filter the Nodes. 
  filerClicked(filter:String){
    this.updateNodes(filter);
  }

  // Fetch the details of the selected Node. 
  viewClicked(node:nodeClass){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.position = {
    
    }
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: node.nodeId,
      title: 'View Node',
    };

    const dialogRefPhotoSlection  = this.confirmdialog.open(ViewNodeComponent,dialogConfig)

    dialogRefPhotoSlection.afterClosed().subscribe(result => {
      console.log(result)  
     
    })
  }

  // Browse the DB you want to explore
  browseDB(){
    this.electronservice.browse(function(folderPath){
      this.folderPath = folderPath;
    }.bind(this));
  }

  // Explore the DB for Viewing
  exploreDB(){
    this.isExploring = true;
    this.isLoading = true;
    this.electronservice.explore(function(nodes){
      console.log("Exploring...")
      let i = 0;
      this.listItems =  nodes.map(([node, ...conflicts], i) => ({
        i,
        key: node.key,
        conflicts: conflicts.length,
      }));

      this.listItems.forEach(item => {
        if(i < this.maxRecords){
          let node = new nodeClass();
          node.isViewing = false;
          node.nodeId = item.i;
          node.key = item.key
          this.nodes.push(node);
          i = i + 1;
        }
        else{
          this.isLoading = false;
        }
      });
    }.bind(this));
  }
}
