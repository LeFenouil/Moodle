import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/services/users/admin/admin.service';


export interface IStatut {
  value : string,
  viewValue : string
}

@Component({
  selector: 'app-modifier-enseignant',
  templateUrl: './modifier-enseignant.component.html',
  styleUrls: ['./modifier-enseignant.component.css']
})
export class ModifierEnseignantComponent implements OnInit {

  formSubmitted : boolean = false;
  enseignants : any;
  enseignantSelectionner : any;
  
  statuts : IStatut[] = [
    {value: 'TR', viewValue: 'Teacher-Researcher'},
    {value: 'AST', viewValue: 'Associate secondary teacher seconded to higher education'},
    {value: 'ATR' , viewValue: 'Associate or guest teacher-researcher'},
    {value: 'TC' , viewValue: "Teaching contract"},
    {value: 'TTRA' , viewValue: "Temporary Teaching and Research Associates"},
    {value: 'Contractor' , viewValue: "Person from outside the university who intervenes for a few hours"}
  ];

  modifierEnseignantForm = new FormGroup({
   nom: new FormControl('',[Validators.required]),
   prenom: new FormControl('',[Validators.required]),
   email: new FormControl('',[Validators.required , Validators.email]),
   statut : new FormControl('',[Validators.required , Validators.email]), 
 });

 constructor(private adminService : AdminService, private _snackBar : MatSnackBar) { }

 ngOnInit(): void {
     this.adminService.listeDeToutLesEnseignants().subscribe((data) => {
              this.enseignants = data as [];
     });
 }

 selectEnseignant(enseignant: any){
  this.enseignantSelectionner = enseignant;
  this.modifierEnseignantForm.controls['nom'].setValue(this.enseignantSelectionner.nom);
  this.modifierEnseignantForm.controls['prenom'].setValue(this.enseignantSelectionner.prenom);
  this.modifierEnseignantForm.controls['statut'].setValue(this.enseignantSelectionner.statut);
  this.modifierEnseignantForm.controls['email'].setValue(this.enseignantSelectionner.email);
 }

 onSubmit() : void{

   if(this.modifierEnseignantForm.valid){

     const id = this.enseignantSelectionner._id;

     // données du formulaire
     const nom = this.modifierEnseignantForm.value.nom;
     const prenom = this.modifierEnseignantForm.value.prenom;
     const email = this.modifierEnseignantForm.value.email;
     const statut = this.modifierEnseignantForm.value.statut;
     const role = "Enseignant";


     this.adminService.modifierUnEnseignant({id,nom,prenom,email,statut,role}).subscribe((data) => {
            this._snackBar.open("Edit successfully" , "Close")
            this.modifierEnseignantForm.reset();
     });
   }
    this.formSubmitted = true;
 }

}
