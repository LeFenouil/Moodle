const { response } = require("express");
const { ObjectId } = require("mongodb");

class AdminAPI{

    ajouterEnseignant(app,UserModel){
        app.post('/api/admin/ajouterEnseignant' , async (req,res) => {
                const {nom,prenom,email,password,statut,role} =  req.body;
                const response = await UserModel.create([{nom , prenom , email, password,statut,role}])
                if(!response){
                    res.json({
                        success : false,
                        message : "Fail to add the teacher"
                    });
                }
                else{

                    res.json({
                        success : true,
                        message : "Teacher added"
                    });
                }
        })
    }

    modifierEnseignant(app,UserModel){
        app.post('/api/admin/modifierEnseignant' , async (req,res) => {
               const user = await UserModel.findOneAndUpdate({"_id" : req.body.id} , {"nom" : req.body.nom , "prenom" : req.body.prenom  , "email" : req.body.email  , "statut" : req.body.statut , "role" : req.body.role } , {new : true});
               console.log(user);
               if(user){
                console.log("User Found !")
                console.log(user)
                    res.json({
                        success : true,
                        message : "User Found"
                    });
                }
                else{
                console.log("User Not Found !")
                res.json({
                    success : false,
                    message : "User Not Found "
                    });
                    }
               })
    }

    supprimerEnseignant(app,UserModel){
        app.post('/api/admin/supprimerEnseignant' , async (req,res) => {
              const {id} = req.body;
              const response = await UserModel.deleteOne({"_id" : id})
              if(response){
                    console.log("Teacher deleted")
                    res.json({
                        success : true,

                    })
              }
              else{
                res.json({
                    success : false,

                })
                    console.log("Fail to delete the teacher")
              }
        })
    }

    listeEnseignants(app,UserModel){
        app.post('/api/admin/listeEnseignant' , async (req,res) => {
            const resp =  await UserModel.find({role : 'enseignant'});
            res.json(resp)
      })
    }

    inscriptionEnseignantModules(app,EnseignementModel){
         app.post('/api/admin/inscriptionEnseignantModules', async(req,res) => {
                    const {idEnseignant , modulesIDs} = req.body;
                    const success = true;
                    for(let i = 0; i < modulesIDs.length; i++){
                    const response = await EnseignementModel.create({"idEnseignant" : ObjectId(idEnseignant), "idEnseignement" : ObjectId(modulesIDs[i]),  nombreCM: 0 , nombreTD: 0 , nombreTP: 0})
                    if(response){
                            console.log("Ok !")
                    }
                    else{
                         success = false;
                    }
                }

                  res.json({success : success , message:  "Insertion success !"});
         })
    }


    desinscriptionEnseignantModules(app,EnseignementModel){
      app.post('/api/admin/desinscriptionEnseignantModules', async(req,res) => {
                 const {idEnseignant , modulesIDs} = req.body;
                 const success = true;
                 for(let i = 0; i < modulesIDs.length; i++){
                 const response = await EnseignementModel.deleteOne({"idEnseignant" : ObjectId(idEnseignant), "idEnseignement" : ObjectId(modulesIDs[i])})
                 if(response){
                         console.log("deleted module !")
                 }
                 else{
                      success = false;
                 }
             }
                 res.json({success : success , message:  "Unsubscribe successfully"});
      })
 }

    attributionGroupeEnseignant(app,GroupeModel){
       app.post('/api/admin/attributionGroupeEnseignant', async(req,res) => {
                const{nomGroupe,typeGroupe,nombreEtudiants,idEnseignant,idEnseignement} =  req.body;
                const response = await GroupeModel.create({"nomGroupe" : nomGroupe, "typeGroupe": typeGroupe, "nombreEtudiants"  : nombreEtudiants , "idEnseignant" : ObjectId(idEnseignant),"idEnseignement" : ObjectId(idEnseignement)})
                if(response){
                        res.json({success : true , message:  "Group assignment successfully"});
                }
                else{
                  res.json({success : false , message:  "Failed to assign group"});
                }
      })
    }


  getGroupesAttribuerACetEnseignant(app,GroupeModel){
      app.post('/api/admin/groupesSuiviParCetEnseignant', async(req,res) => {
        const {idEnseignant} = req.body;
        const response = await GroupeModel.aggregate([
                  {$match: {idEnseignant: ObjectId(idEnseignant)}},
                  {$lookup: {from : "formations" , localField: "idEnseignement" , foreignField: "_id" , as: "Enseignement_Details"}},
                  {$lookup: {from : "users" , localField: "idEnseignant" , foreignField: "_id" , as: "Enseignant_Details"}},
        ])
          if(response){
                res.json(response);
          }
        else{
                res.json({success : false , message:  "No groups found"});
        }
      })
     }

}

module.exports = AdminAPI;
