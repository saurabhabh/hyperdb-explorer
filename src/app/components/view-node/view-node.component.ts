import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-view-node',
  templateUrl: './view-node.component.html',
  styleUrls: ['./view-node.component.scss']
})
export class ViewNodeComponent implements OnInit {

  nodeInfo:any = "";
  nodeId:string = "";
  constructor(private dialogRef: MatDialogRef<ViewNodeComponent>,
    public electronservice: ElectronService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      if(data){
        this.nodeId = data.id;
      }
    }

  ngOnInit() {
    
    // Will render the nodes in the JSON Format
    let jsonString =  this.electronservice.renderDetail(this.electronservice.nodes[this.nodeId]);
    let jsonNode;
    try{
       jsonNode = JSON.parse(jsonString.value);  
    }
    catch{
      jsonNode = jsonString.value;
    }
    
    jsonString.value = jsonNode;
    this.nodeInfo = jsonString;
    
  }



  dismiss(){
    this.dialogRef.close(null);
  }

}
