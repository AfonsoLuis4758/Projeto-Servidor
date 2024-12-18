const model = require("../models/models_image")



//get by id

const listById = function(req, res) {
    model.Image.findById(req.params.id)
        .then((image) => {
            res.setHeader("Content-Type", image.type);
            res.status(200).send(image);
        })
        .catch((error) => {
            res.status(400).send('Error' + error);
        });
};


//post
const create = function (req,res) {
    const imageData = req.body.image;
    const imageBuffer = Buffer.from(imageData.data, "base64");

    let new_Image = new model.Image({
        name: imageData.name,
        type: imageData.type,
        data: imageBuffer
    })

    new_Image.save().then((result)=>{     
        res.status(200).json(result)
    }).catch((error)=> {
        res.status(400).send("Error: " + error)
    })
}


const update = function (req,res) {     //put
    let updateData = {
        name: req.body.name,
        type: req.body.type,
        data: req.body.data
    } 

    model.Image.findByIdAndUpdate(req.params.id,updateData,{ new: true ,upsert: false})
    .then((result)=>{ 
        res.status(200).json(result)
    }).catch((error)=> {
        res.status(400).send("Error: " + error)
    })
}

const deleteData = function(req,res){                  //delete by id
    model.Image.findByIdAndDelete(req.params.id).then((result)=>{
            res.status(200).json(result)
    }).catch((error)=>{
        res.status(400).send("Error: " + error)
    })
}


exports.create = create
exports.update = update
exports.deleteData = deleteData
exports.listById = listById
