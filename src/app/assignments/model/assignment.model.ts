import {Matiere} from "./matiere.model";

export class Assignment {
  _id?:string;
  id!:number;
  nom!:string;
  dateDeRendu!:Date;
  rendu!:boolean;
  auteur!:string;
  note!:number;
  remarques!:string;
  matiere!:Matiere;
}
