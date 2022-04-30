import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Assignment } from '../model/assignment.model';
import {User} from "../model/user.model";

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis?: Assignment;
  message?: string;
  user= this.authService.user;

  constructor(
    private assignmentsService: AssignmentsService,
    private authService:AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.getAssignment(id);

  }

  getAssignment(id: string) {
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment;
    });
  }

  onAssignmentRendu() {
    if (this.assignmentTransmis) {
      this.assignmentTransmis.rendu = true;

      this.assignmentsService
        .updateAssignment(this.assignmentTransmis)
        .subscribe((reponse) => {
          this.router.navigate(['/home']);
        });
    }
  }

  onDelete() {
    if (!this.assignmentTransmis) return;
    if(this.authService.user){
      if (!this.authService.user.admin) {
        this.message ="vous n'êtes pas admin, vous n'êtes pas autorisé à supprimer";
        return;
      }

    }

    this.assignmentsService
      .deleteAssignment(this.assignmentTransmis)
      .subscribe((reponse) => {
        console.log(reponse.message);
        this.router.navigate(['/home']);
      });
  }

  onClickEdit() {
    if(this.authService.user){
      if (!this.authService.user.admin) {
        this.message ="vous n'êtes pas admin, vous n'êtes pas autorisé à modifier";
        return;
      }
    }
    this.router.navigate(['/assignment', this.assignmentTransmis?._id, 'edit'], {
      queryParams: {
        name: 'Michel Buffa',
        job: 'Professeur',
      },
      fragment: 'edition',
    });
  }

  isLoggedIn() {
    return this.authService.loggedIn;
  }

  testAdmin(){
    if(this.user) return this.user.admin;
    else return false;
  }
}
