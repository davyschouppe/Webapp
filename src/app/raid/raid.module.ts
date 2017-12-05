import { NgModule } from "@angular/core";
import { RaidComponent } from "./raid/raid.component";
import { PlayerComponent } from "./player/player.component";
import { AddRaidComponent } from "./add-raid/add-raid.component";
import { RaidListComponent } from "./raid-list/raid-list.component";
import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RaidDataService } from "./raid-data.service";
import { RouterModule } from "@angular/router";
import { RaidDetailsComponent } from './raid-details/raid-details.component';
import { RaidResolver } from "./raid-resolver";

const routes = [
    { path: 'list', component: RaidListComponent },
    { path: 'add', component: AddRaidComponent },
    { path: ':id', component: RaidDetailsComponent, resolve: { raid: RaidResolver} }
  ];

@NgModule({
    imports: [
        HttpModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
      RaidComponent,
      PlayerComponent,
      AddRaidComponent,
      RaidListComponent,
      RaidDetailsComponent],
      providers: [ RaidDataService,
        RaidResolver ]
  })
  export class RaidModule { }