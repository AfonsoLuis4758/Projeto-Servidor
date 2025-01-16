const model = require("../models/models_product")


const listAll = function(req, res) {

    model.Product.find()
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error');
        });
};


/**
 * @param {*} req 
 * @param {*} res 
 */
const listNew = function(req, res) {
    
    
    const Filter = req.query.gender ? { gender: req.query.gender, recent: true } : {recent: true}; // If gender is provided, use it as a filter, otherwise use an empty filter


    model.Product.find(Filter)
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error');
        });
};

const listPromotion = function(req, res) {
    
    
    const Filter = req.query.gender ? { gender: req.query.gender, promotion: { "$ne": 0 }} : {promotion: { "$ne": 0 }}; // If gender is provided, use it as a filter, otherwise use an empty filter


    model.Product.find(Filter)
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error');
        });
};

const listByType = function(req, res) {
    
    
    const Filter = req.query.gender ? { gender: req.query.gender, type: req.params.type } : {type: req.params.type }; // If gender is provided, use it as a filter, otherwise use an empty filter


    model.Product.find(Filter)
        .then((list) => {
            res.status(200).json(list);
        })
        .catch((error) => {
            res.status(400).send('Error');
        });
};

const listSearch = function(req, res) {
    
    nameRegex = new RegExp(req.params.name.replaceAll("_"," "))
    const Filter = req.query.gender ? { gender: req.query.gender, name:  {$regex: nameRegex, $options: 'i'}} : {name:  {$regex: nameRegex, $options: 'i'}}; // If gender is provided, use it as a filter, otherwise use an empty filter


    model.Product.find(Filter)
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
        promotion: req.body.promotion, 
        recent: req.body.recent, 
        image: req.body.image 
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

exports.listAll = listAll
exports.listNew = listNew
exports.listPromotion = listPromotion
exports.listByType = listByType
exports.listSearch = listSearch
exports.create = create
exports.update = update
exports.deleteData = deleteData
exports.listById = listById
