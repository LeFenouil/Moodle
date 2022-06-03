import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/services/users/admin/admin.service';


export interface IStatut{
  value : string,
  viewValue : string
}

@Component({
  selector: 'app-ajouter-enseignant',
  templateUrl: './ajouter-enseignant.component.html',
  styleUrls: ['./ajouter-enseignant.component.css']
})


export class AjouterEnseignantComponent implements OnInit {

    statuts: IStatut[] = [
    {value: 'EC', viewValue: "Teacher-Researcher"},
    {value: 'PRAG', viewValue: "Associate secondary teacher seconded to higher education"},
    {value: 'PAST' , viewValue: "Associate or guest teacher-researcher"},
    {value: 'CDE' , viewValue: "Teaching contract"},
    {value: 'ATER' , viewValue: "Temporary Teaching and Research Associates"},
    {value: 'Contractor' , viewValue: "Person from outside the university (Contractor)"}
  ];

   formSubmitted : boolean = false;

    ajouteEnseignantForm = new FormGroup({
    nom: new FormControl('',[Validators.required]),
    prenom: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required , Validators.email]),
    password: new FormControl('',[Validators.required]),
    confirmPass: new FormControl('',[Validators.required]),
    statut : new FormControl('',[Validators.required]),
  });


  constructor(private adminService : AdminService,private _snackBar: MatSnackBar) { }


  ngOnInit(): void {}


  onSubmit() : void{


    if(this.ajouteEnseignantForm.valid){


      const nom = this.ajouteEnseignantForm.value.nom;
      const prenom = this.ajouteEnseignantForm.value.prenom;
      const email = this.ajouteEnseignantForm.value.email;
      const password = this.ajouteEnseignantForm.value.password;
      const confirmPass = this.ajouteEnseignantForm.value.confirmPass;
      const statut = this.ajouteEnseignantForm.value.statut;
      const role = "enseignant";
  
    // this.adminService.ajouterUnEnseignant(nom,prenom,email,password,role)
  
      if(password != confirmPass){ 
        this._snackBar.open("Password not identical" , "Closed")
      }
      else{
        this.adminService.ajouterUnEnseignant({nom,prenom,email,password,statut,role}).subscribe((data) => {
          console.log(data);
                if(data.success){
                  this._snackBar.open("Teacher Added successfully" , "Closed")
                  this.ajouteEnseignantForm.reset();
                }
                else{
                  this._snackBar.open("Failed to add teacher" , "Closed")
                }
        });
      }
    }
    
     this.formSubmitted = true;
  }
}
