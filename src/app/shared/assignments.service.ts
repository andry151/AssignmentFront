import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, forkJoin, map, Observable, of, pairwise, tap } from 'rxjs';
import { Assignment } from '../assignments/model/assignment.model';
import { LoggingService } from './logging.service';
import { bdInitialAssignments } from './data';
import {Matiere} from "../assignments/model/matiere.model";
import {Prof} from "../assignments/model/prof.model";
import {User} from "../assignments/model/user.model";

@Injectable({
  providedIn: 'root'
})

export class AssignmentsService {
  assignments:Assignment[] = [];
  matieres:Matiere[] = [
    {
      idmatiere:1,
      nom:"Angular",
      image:"/assets/matiere/angular.png",
      prof:{
        idprof:1,
        sexe:"Mr",
        nom:"Michel Buffa",
        photo:"/assets/prof/buffa.jpg",
      }
    },
    {
      idmatiere:2,
      nom:"SQL3",
      image:"/assets/matiere/sql3.jpg",
      prof:{
        idprof:2,
        sexe:"Mr",
        nom:"Serge Miranda",
        photo:"/assets/prof/Miranda.jpg",
      }
    },
    {
      idmatiere:3,
      nom:"Grails",
      image:"/assets/matiere/grails.jpg",
      prof:{
        idprof:3,
        sexe:"Mr",
        nom:"Grégory Galli",
        photo:"/assets/prof/Galli.jpg",
      }
    },
    {
      idmatiere:4,
      nom:"Ingéniorie logicielle",
      image:"/assets/matiere/ing-logiciel.PNG",
      prof:{
        idprof:4,
        sexe:"Mme",
        nom:"Dominique RIBOUCHON",
        photo:"/assets/prof/ribouchon.PNG",
      }
    },
    {
      idmatiere:5,
      nom:"Langage R",
      image:"/assets/matiere/R.PNG",
      prof:{
        idprof:5,
        sexe:"Mr",
        nom:"Nicolas Pasquier",
        photo:"/assets/prof/Pasquier.jpg",
      }
    },
    {
      idmatiere:6,
      nom:"Oracle",
      image:"/assets/matiere/oracle.gif",
      prof:{
        idprof:6,
        sexe:"Mr",
        nom:"Gabriel MOPOLO-MOKE",
        photo:"/assets/prof/Mopolo.jpg",
      }
    },
    {
      idmatiere:7,
      nom:"NodeJs",
      image:"/assets/matiere/nodejs.png",
      prof:{
        idprof:7,
        sexe:"Mr",
        nom:"Rojo Rabenanahary",
        photo:"/assets/prof/raben.jpg",
      }
    }


  ];

  constructor(private loggingService:LoggingService, private http:HttpClient) {
    this.loggingService.setNiveauTrace(2);

  }

  //url = "http://localhost:8010/api/assignments";
  url= "https://assignments2022back.herokuapp.com/api/assignments";

  getAssignments(page:number, limit:number):Observable<any> {
    // en réalité, bientôt au lieu de renvoyer un tableau codé en dur,
    // on va envoyer une requête à un Web Service sur le cloud, qui mettra un
    // certain temps à répondre. On va donc préparer le terrain en renvoyant
    // non pas directement les données, mais en renvoyant un objet "Observable"
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.url + "?page=" + page + "&limit=" + limit);
  }

  getAssignment(id:string):Observable<Assignment|undefined> {
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
    this.loggingService.log(assignment.nom, "ajouté");
    return this.http.post<Assignment>(this.url, assignment);
  }


  updateAssignment(assignment:Assignment):Observable<any> {
    this.loggingService.log(assignment.nom, "modifié");
    return this.http.put<Assignment>(this.url, assignment);
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    //let pos = this.assignments.indexOf(assignment);
    //this.assignments.splice(pos, 1);
    //this.loggingService.log(assignment.nom, "supprimé");
    //return of("Assignment supprimé");
    return this.http.delete(this.url + "/" + assignment._id);
  }

  url2:string= "http://localhost:8010/api/matieres";
  addMatiere(mat:Matiere):Observable<any> {
    return this.http.post<Matiere>(this.url2, mat);
  }

  peuplerMatiere(){
    this.matieres.forEach(a => {
      let mat = new Matiere();
      mat = a;

      this.addMatiere(mat)
        .subscribe(reponse => {
          console.log(reponse.message);
        })
    })
  }

  getUsers():Observable<User[]> {
    return this.http.get<User[]>("https://assignments2022back.herokuapp.com/api/users");
  }

  peuplerBD() {
    /*
    Apina : createur(pseudo zany), matiere, de random rendu de ra oui de asina note /20
     */
    bdInitialAssignments.forEach(a => {
      let newAssignment = new Assignment();
      newAssignment.id = a.id;
      newAssignment.dateDeRendu = new Date(a.dateDeRendu);
      newAssignment.nom = a.nom;
      newAssignment.auteur = a.auteur;
      newAssignment.remarques = a.remarques;
      if((Math.random() < 0.5)){
        newAssignment.rendu = true;
        newAssignment.note=Math.floor(Math.random() * (20 - 0) + 0)
      }else{
        newAssignment.rendu = false;
      }
      let pseudos = ['ituadmin', 'itu1', 'itu7', 'itu1987', 'itu427', 'itu23091'];
      let pseudo = pseudos[Math.floor(Math.random() * pseudos.length)];
      newAssignment.createur = pseudo ;
      let mati = this.matieres[Math.floor(Math.random() * this.matieres.length)];
      newAssignment.matiere = mati;
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

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }

}
