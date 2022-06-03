const { ObjectId } = require("mongodb");

class EnseignantAPI {

    getEnseignantInformationById(app,UserModel){
            app.post("/api/enseignant/informations" , async (req,res) => {
                      const {enseignantID} = req.body;
                      const response = await UserModel.findOne({"_id" : enseignantID})
                      if(response){
                          res.json(response);
                      }
                      else{
                        res.json({success: false , message : "Failed to retrieve teacher information"})
                      }
            })
   }

   getListModulesEnseignees(app,UserModel){
            app.post("/api/enseignant/modulesEnseignee" , async (req,res) => {
              const {enseignantID} = req.body;
              const response = await UserModel.aggregate(
              [
                  {$match : {"_id" : ObjectId(enseignantID)}},
                  {$lookup: {from : "enseignements", localField :  "_id" ,foreignField : "idEnseignant", as : "teaches"}},
                  {$lookup: {from : "formations" , localField : "teaches.idEnseignement" , foreignField : "_id", as : "modulesEnseignee" }}
              ])
              if(response){
                //console.log(response[0].modulesEnseignee)
                  res.json(response[0].modulesEnseignee);
              }
              else{
                res.json({success: false , message : "Failed to retrieve teacher information"})
              }
            })
   }

   inscriptionEnseignantModule(app,EnseignementModel){
    app.post("/api/enseignant/inscriptionEnseignantEnseignement" , async (req,res) => {
      const {idEnseignant,idEnseignement,nombreCM,nombreTD,nombreTP} = req.body;
       const response = await EnseignementModel.create({idEnseignement: idEnseignant , idEnseignant: idEnseignement , nombreCM: nombreCM , nombreTD: nombreTD , nombreTP: nombreTP})
      if(response){
          res.json({success: true , message : "Teacher enrolled in the module successfully"});
      }
      else{
        res.json({success: false , message : "Failed to enroll the teacher in the module"})
      }
    })
}
}


module.exports = EnseignantAPI;
