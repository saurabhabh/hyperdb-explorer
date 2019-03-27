import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
const autosuggestTrie = require('autosuggest-trie')
const diffy = require('diffy')()
const input = require('diffy/input')()
import * as hyperdb from 'hyperdb';
import { nodeClass } from '../model/nodeClass';

const colors = require('kleur');
//import * as Menu from 'menu-string';

const sortBy = require('sort-by')

@Injectable()
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  hyperDB: typeof hyperdb;
  nodes:any = []
  listItems:any = []
  db: any;
  folder: string;
 
  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.hyperDB =  window.require('hyperdb');
    }
    
  }

  // Sets the hyper db for reading
  explore(cb){
    this.db = this.hyperDB(this.folder);

      this.db.createReadStream()
      .on('data', n => {
        this.nodes.push(n)
      })
      .on('end', m=>{
        console.log(JSON.stringify(this.nodes[0]))
        if(cb){
          cb(this.nodes);
        }
      })
  }

  // Allows to select the folder to where the hyperdb is situated
  browse(cb){
   
    this.remote.dialog.showOpenDialog({ title: 'Select a folder', properties: ['openDirectory'] }, function (folderPath){
      if (folderPath === undefined) {
        console.log("You didn't select a folder");
        return ;
      }
      if(cb){
        this.folder = folderPath[0];
        cb(this.folder);
      }
     
    }.bind(this));
  }
  
  // Fill the nodes object to show on the UI
  renderDetail(nodes) {
    const lines = [];
    let nodeClassObj = new nodeClass();
    nodeClassObj.key = nodes[0].key;
    let nodeCount = 0
    nodes.forEach(node => {
      nodeClassObj.nodesArray.push(nodeCount)
      lines.push(`${node.value}`)
      nodeClassObj.value = lines[nodeCount]
      nodeCount = nodeCount + 1;

    });

    return nodeClassObj;
  }



  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
