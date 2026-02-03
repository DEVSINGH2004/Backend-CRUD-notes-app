const express = require("express")
const app = express();
const cors = require("cors")
const noteModel = require("./models/notes.model")
const path  = require("path")

app.use(express.json())
app.use(cors())
app.use(express.static("./public"))
// store notes into mongo database
app.post("/api/sendNotes",(req,res)=>{
    const {title,description} = req.body;
    noteModel.create({
        title,description
    })
    res.status(201).json({
        "message":"note saved successfully"
    })
})

//to get notes from db

app.get("/api/getNotes",async(req,res)=>{
    const notes = await noteModel.find()
    res.status(200).json({
        "message":"notes fetched successfully",
        notes
    })
})

//to update notes bu using id

app.patch("/api/updateNotes/:id",async(req,res)=>{
    const {id} = req.params;
    const {description}  = req.body;
    const updatednote = await noteModel.findByIdAndUpdate(id,{description});
    res.status(200).json({
        "message":"note updated successfully",
        updatednote
    })
})

//to delete a note by id

app.delete("/api/deleteNote/:id",async(req,res)=>{
    const {id} = req.params;
    await noteModel.findByIdAndDelete(id)
    res.status(200).json({
        "message":"note deleted successfully"
    })
})

//to handle any wild card route
app.use("*name",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"))
})


module.exports = app;