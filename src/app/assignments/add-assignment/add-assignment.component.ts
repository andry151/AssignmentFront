import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssignmentsService } from 'src/app/shared/assignments.service';
import { Assignment } from '../model/assignment.model';
import {AuthService} from "../../shared/auth.service";
import {Matiere} from "../model/matiere.model";

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
})
export class AddAssignmentComponent implements OnInit {
  // Champ de formulaire
  nomAssignment: string = "Test";
  dateDeRendu: Date = new Date("2022-01-01");
  auteur: string = "Andry";
  note!: number ;
  remarques!: string ;
  matiere!:Matiere;
  matieres!:Matiere[];

  constructor(private assignmentsService:AssignmentsService, private router:Router , private authService : AuthService) {}

  ngOnInit(): void {
    this.matieres = this.assignmentsService.matieres;
  }

  onSubmit() {
    if((!this.nomAssignment) || (!this.dateDeRendu)) return;
    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu
    );

    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random()*10000000);
    newAssignment.nom = this.nomAssignment;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;
    newAssignment.matiere = this.matiere;
    newAssignment.auteur = this.auteur;
    if(this.note) {
      newAssignment.rendu = true;
      newAssignment.note= this.note;
    }
    if(this.remarques) {
      newAssignment.remarques = this.remarques;
    }
    console.log("nom="+this.matiere.nom);

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      console.log(reponse.message);

      // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
      // en gros, demander de naviguer vers /home
      this.router.navigate(["/home"]);
    })

  }
}
