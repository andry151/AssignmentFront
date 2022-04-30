import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { filter, map, pairwise, tap, throttleTime } from 'rxjs';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './model/assignment.model';
import {AuthService} from "../shared/auth.service";
import {Router} from "@angular/router";
import {User} from "./model/user.model";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit, AfterViewInit {
  assignments:Assignment[] = [];
  assignmentsRendu: Assignment[] = [];
  assignmentsNonRendu: Assignment[] = [];
  displayedColumns: string[] = ['id', 'nom', 'dateDeRendu', 'rendu'];
  user?:User;

  // pagination
  page=1;
  limit=10;
  totalPages=0;
  pagingCounter=0;
  hasPrevPage=false;
  hasNextPage=true;
  prevPage= 1;
  nextPage= 2;
  nbassignment!:number;

  constructor(private assignmentsService:AssignmentsService, private ngZone: NgZone, private authService : AuthService, private router: Router) {

  }

  @ViewChild('scroller') scroller!: CdkVirtualScrollViewport;

  ngAfterViewInit():void{
  }

  ngOnInit(): void {
    this.user=this.authService.user;
    this.getAssignments();
  }

  onDetails(id:any){
    this.router.navigate(['/assignment/'+id]);
  }

  getAssignments() {
      this.assignmentsService.getAssignments(this.page, this.limit)
      .subscribe(reponse => {
        this.assignments = reponse.docs;
        this.page = reponse.page;
        this.limit=reponse.limit;
        this.totalPages=reponse.totalPages;
        this.pagingCounter=reponse.pagingCounter;
        this.hasPrevPage=reponse.hasPrevPage;
        this.hasNextPage=reponse.hasNextPage;
        this.prevPage= reponse.prevPage;
        this.nextPage= reponse.nextPage;
        for(var ass of reponse.docs){
          if(ass.rendu ){
            this.assignmentsRendu.push(ass);
          }else{
            this.assignmentsNonRendu.push(ass);
          }
        }
        this.nbassignment=reponse.totalDocs;
      });

  }

  onchangePage(event:any) {
    this.assignmentsNonRendu = [];
    this.assignmentsRendu = [];
    this.assignmentsService.getAssignments(event.pageIndex, event.pageSize)
      .subscribe(reponse => {
        this.page = reponse.page;
        this.limit= reponse.limit;
        this.totalPages=reponse.totalPages;
        this.pagingCounter=reponse.pagingCounter;
        this.hasPrevPage=reponse.hasPrevPage;
        this.hasNextPage=reponse.hasNextPage;
        this.prevPage= reponse.prevPage;
        this.nextPage= reponse.nextPage;
        this.assignments = reponse.docs;
        for(var ass of this.assignments){
          if(ass.rendu){
            this.assignmentsRendu.push(ass);
          }else{
            this.assignmentsNonRendu.push(ass);
          }
        }
      });
  }

}
