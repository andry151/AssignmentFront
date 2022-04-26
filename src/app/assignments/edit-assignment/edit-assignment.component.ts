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

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private authService : AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.matieres = this.assignmentsService.matieres;
    // ici un exemple de récupération des query params et du fragment
    /*let queryParams = this.route.snapshot.queryParams;
    console.log("Query params :")
    console.log(queryParams);
    console.log("Fragment :")
    console.log(this.route.snapshot.fragment);*/

    this.getAssignment();
  }

  getAssignment() {
    // on récupère l'id dans le snapshot passé par le routeur
    // le "+" force l'id de type string en "number"
    const id = +this.route.snapshot.params['id'];

    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      if (!assignment) return;

      this.assignment = assignment;

      // Pour pré-remplir le formulaire
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

    // on récupère les valeurs dans le formulaire
    this.assignment.nom = this.nomAssignment;
    this.assignment.dateDeRendu = this.dateDeRendu;
    this.assignment.auteur = this.auteur;
    if (this.note)
    {
      if (this.assignment.rendu === false) {
        this.assignment.rendu = true;
        console.log("mande le true");
      }
      this.assignment.note = this.note;
    }
    if (this.remarques) this.assignment.remarques = this.remarques;
    this.assignment.matiere = this.matiere;


    this.assignmentsService
      .updateAssignment(this.assignment)
      .subscribe((reponse) => {
        console.log(reponse.message);

        // navigation vers la home page
        this.router.navigate(['/home']);
      });
  }
}
