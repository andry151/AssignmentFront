import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../model/assignment.model';
import {AuthService} from "../../shared/auth.service";
import {Matiere} from "../model/matiere.model";

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
})
export class EditAssignmentComponent implements OnInit {
  assignment!: Assignment | undefined;
  nomAssignment!: string;
  dateDeRendu!: Date;
  auteur!: string;
  remarques!: string;
  note!: number;
  matiere!: Matiere;
  matieres!:Matiere[];
  erreur?:string;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private authService : AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.assignmentsService.getMatieres().subscribe( reponse => {
      this.matieres = reponse;
    });

    this.getAssignment();
  }

  getAssignment() {
    const id = this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (!assignment) return;

      this.assignment = assignment;
      this.nomAssignment = assignment.nom;
      this.dateDeRendu = assignment.dateDeRendu;
      this.auteur = assignment.auteur;
      if (assignment.note) this.note = assignment.note;
      if (assignment.remarques) this.remarques = assignment.remarques;
      this.matiere = assignment.matiere;
    });
  }

  onSaveAssignment() {
    if (!this.assignment) return;
    if(this.note<0){
      this.erreur ="La note doit être supérieur à 0";
      return;
    }
    if(this.note>20){
      this.erreur ="La note doit être inférieur à 20";
      return;
    }

    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignment.auteur = this.auteur;
    if (this.note)
    {
      if (this.assignment.rendu === false) {
        this.assignment.rendu = true;
      }
      this.assignment.note = this.note;
    }
    if (this.remarques) this.assignment.remarques = this.remarques;
    this.assignment.matiere = this.matiere;


    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((reponse) => {
        this.router.navigate(['/home']);
      });
  }
}
