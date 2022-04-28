import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap } from 'rxjs';
import { Assignment } from '../assignments/model/assignment.model';
import { LoggingService } from './logging.service';
import { bdInitialAssignments } from './data';
import {Matiere} from "../assignments/model/matiere.model";
import {Prof} from "../assignments/model/prof.model";

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  assignments:Assignment[] = [];
  matieres:Matiere[] = [
    {
      idmatiere:1,
      nom:"Base de données",
      image:"https://miro.medium.com/max/1100/1*dYhDHdCt0lhVRdj0IjrI7A.png",
      prof:{
        idprof:1,
        nom:"Buffa",
        prenom:"Grinn",
        photo:"https://material.angular.io/assets/img/examples/shiba2.jpg",
      }
    },
    {
      idmatiere:2,
      nom:"Technologies Web",
      image:"https://miro.medium.com/max/1100/1*dYhDHdCt0lhVRdj0IjrI7A.png",
      prof:{
        idprof:2,
        nom:"Buffa",
        prenom:"Grinn",
        photo:"https://material.angular.io/assets/img/examples/shiba2.jpg",
      }
    },
    {
      idmatiere:3,
      nom:"Grails",
      image:"https://miro.medium.com/max/1100/1*dYhDHdCt0lhVRdj0IjrI7A.png",
      prof:{
        idprof:3,
        nom:"Sammy",
        prenom:"Grinn",
        photo:"https://material.angular.io/assets/img/examples/shiba2.jpg",
      }
    },
    {
      idmatiere:3,
      nom:"Oracle",
      image:"https://mma.prnewswire.com/media/467598/Oracle_Logo.jpg?p=twitter",
      prof:{
        idprof:3,
        nom:"Mopollo",
        prenom:"Grinn",
        photo:"https://univ-cotedazur.fr/medias/photo/rs9100-buffa-michel-scr_1623769953324-jpg?ID_FICHE=1094906",
      }
    }
  ];

  constructor(private loggingService:LoggingService, private http:HttpClient) {
    this.loggingService.setNiveauTrace(2);

  }


  url = "http://localhost:8010/api/assignments";
  //url= "https://mbdsmadagascar2022api.herokuapp.com/api/assignments";

  getAssignments(page:number, limit:number):Observable<any> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.url + "?page=" + page + "&limit=" + limit);
  }

  getAssignment(id:number):Observable<Assignment|undefined> {
    //let a = this.assignments.find(a => a.id === id);
    //return of(a);
    return this.http.get<Assignment>(`${this.url}/${id}`)
    .pipe(
      map(a => {
        //a.nom = a.nom + " MODIFIE PAR UN MAP AVANT DE L'ENVOYER AU COMPOSANT D'AFFICHAGE";
        a.nom = a.nom ;
        return a;
      }),
      tap(a => {
        console.log("Dans le tap, pour debug, assignment recu = " + a.nom)
      }),
      catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
    );
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    }
  }

  addAssignment(assignment:Assignment):Observable<any> {
   // this.assignments.push(assignment);

    this.loggingService.log(assignment.nom, "ajouté");

    return this.http.post<Assignment>(this.url, assignment);

    //return of("Assignment ajouté");
  }

  updateAssignment(assignment:Assignment):Observable<any> {
    this.loggingService.log(assignment.nom, "modifié");

    return this.http.put<Assignment>(this.url, assignment);
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    console.log("mande tsara");
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);

    //this.loggingService.log(assignment.nom, "supprimé");


    //return of("Assignment supprimé");
    return this.http.delete(this.url + "/" + assignment._id);
  }

  peuplerBD() {
    bdInitialAssignments.forEach(a => {
      let newAssignment = new Assignment();
      newAssignment.nom = a.nom;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.rendu = a.rendu;
      newAssignment.id = a.id;

      this.addAssignment(newAssignment)
      .subscribe(reponse => {
        console.log(reponse.message);
      })
    })
  }

  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment:any = [];

    bdInitialAssignments.forEach((a) => {
      const nouvelAssignment:any = new Assignment();

      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }

}
