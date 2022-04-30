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
  nomAssignment!: string;
  dateDeRendu!: Date ;
  auteur!:string;
  note!: number ;
  remarques!: string ;
  matiere!:Matiere;
  matieres!:Matiere[];
  erreur?:string;
  constructor(private assignmentsService:AssignmentsService, private router:Router , private authService : AuthService) {}

  ngOnInit(): void {
    this.matieres = this.assignmentsService.matieres;
  }

  onSubmit() {
    if((!this.nomAssignment) || (!this.dateDeRendu)) return;
    console.log(
      'nom = ' + this.nomAssignment + ' date de rendu = ' + this.dateDeRendu
    );

    if(this.note<0){
      this.erreur ="La note doit être supérieur à 0";
      return;
    }
    if(this.note>20){
      this.erreur ="La note doit être inférieur à 20";
      return;
    }
    if(!this.nomAssignment){
      this.erreur ="Le devoir doit avoir un nom";
      return ;
    }
    if(!this.auteur){
      this.erreur ="Un nom d'élèvde doit être entré";
      return ;
    }
    if(!this.dateDeRendu){
      this.erreur ="Veuillez insérez une date";
      return ;
    }
    if(!this.matiere){
      this.erreur ="Veuillez sélectionner une matière";
      return ;
    }

    let newAssignment = new Assignment();
    newAssignment.id = Math.round(Math.random()*10000000);
    newAssignment.nom = this.nomAssignment;
    newAssignment.dateDeRendu = this.dateDeRendu;
    newAssignment.rendu = false;
    newAssignment.matiere = this.matiere;
    newAssignment.auteur = this.auteur;
    if(this.authService.user){
      newAssignment.createur = this.authService.user.pseudo;
    }
    if(this.note) {
      newAssignment.rendu = true;
      newAssignment.note= this.note;
    }
    if(this.remarques) {
      newAssignment.remarques = this.remarques;
    }

    this.assignmentsService.addAssignment(newAssignment)
    .subscribe(reponse => {
      // il va falloir naviguer (demander au router) d'afficher à nouveau la liste
      // en gros, demander de naviguer vers /home
      this.router.navigate(["/home"]);
    })
  }

}
