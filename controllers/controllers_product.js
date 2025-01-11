const model = require("../models/models_product")



//get
/**
 * @param {*} req 
 * @param {*} res 
 */
const list = function(req, res) {
    const genderFilter = req.query.gender ? { gender: req.query.gender } : {}; // If gender is provided, use it as a filter, otherwise use an empty filter

    model.Product.find(genderFilter)
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error');
        });
};

//get by id

const listById = function(req, res) {
    model.Product.findById(req.params.id)
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error' + error);
        });
};


//post
const create = function (req,res) {
    const new_Product = new model.Product({
        name: req.body.name,
        type: req.body.type,
        stock: req.body.stock,
        gender: req.body.gender,
        price: req.body.price,
        color: req.body.color,
        sizes: req.body.sizes,
        promotion: req.body.promotion || 0, // Default promotion is 0 
        recent:req.body.recent,
        image:req.body.image
    })

    new_Product.save().then((result)=>{     
        res.status(200).json(result)
    }).catch((error)=> {
        res.status(400).send("Error: " + error)
    })
}


const update = function (req,res) {     //put
    let updateData = {
        name: req.body.name,
        type: req.body.type,
        stock: req.body.stock,
        gender: req.body.gender,
        price: req.body.price,
        color:req.body.color,
        sizes: req.body.sizes,
        promotion: req.body.promotion 
    } 

    model.Product.findByIdAndUpdate(req.params.id,updateData,{ new: true ,upsert: false})
    .then((result)=>{ 
        res.status(200).json(result)
    }).catch((error)=> {
        res.status(400).send("Error: " + error)
    })
}

const deleteData = function(req,res){                  //delete by id
    model.Product.findByIdAndDelete(req.params.id).then((result)=>{
            res.status(200).json(result)
    }).catch((error)=>{
        res.status(400).send("Error: " + error)
    })
}


exports.list = list
exports.create = create
exports.update = update
exports.deleteData = deleteData
exports.listById = listById
