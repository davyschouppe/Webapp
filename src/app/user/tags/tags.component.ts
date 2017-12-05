import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RaidDataService } from '../../raid/raid-data.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [RaidDataService]
})
export class TagsComponent implements OnInit {
  private _taglist: string[];
  public tagForm: FormGroup;

  constructor(private fb: FormBuilder,private raidDataService: RaidDataService,) {
    //this._taglist = ["aalst","Aalst","AALST"];
   }

  ngOnInit() {
    this.tagForm = this.fb.group({
      tag: ['', [Validators.required]]
    });
    this.raidDataService.getTags().subscribe(items => this._taglist=items);
  }

  get taglist() : string[]{
    return this._taglist;
  }

  delete(tag: string){
    this.raidDataService.deleteTag(tag).subscribe(() =>{
      this._taglist.splice(this._taglist.indexOf(tag),1);
    });
  }

  onSubmit() {
    let tag = this.tagForm.get("tag").value;
    if(this._taglist.indexOf(tag)>=0){
      this.tagForm.setErrors({"double": "true"});
    }
    else{
      this.raidDataService.addTag(tag).subscribe(() => {this._taglist.push(tag);this.tagForm.get("tag").setValue("")});
    }
  }

}
