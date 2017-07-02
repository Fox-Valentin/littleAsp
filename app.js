var express = require("express")
var app = express()
var formidable = require("formidable")
var ObjectId = require("mongodb").ObjectID;
var db = require("./models/db.js")
app.set("view engine","ejs")
app.use(express.static("./public"))
app.get("/",function(req,res){
  db.getAllCount("asp",function(count){
    res.render("index",{
      "pageMount":Math.ceil(count/4)
    })
  })
})
app.post("/",function(req,res){
  var form = new formidable.IncomingForm()
  form.parse(req,function(err,fields){
    if(err){
      throw err
    }
    db.insertOne("asp",{
      "nickname":fields.nickname,
      "content":fields.content,
      "dateStamp":fields.dateStamp
    },function(err,result){
        if(err){
          console.log(err)
          return
        }
        res.json({"status":1,"data":result})
    })
  })
})
app.get("/getAllMessage",function(req,res){
  db.find("asp",{"findSkip":req.query.pageNum * 4,"findLimit":4,"sort":{"dateStamp":-1}},function(err,result){
    res.json({"status":1,"data":result})
  })
})
app.get("/deleteById",function(req,res){
  var id = ObjectId(req.query.id)
  db.deleteMany("asp",{"_id":id},function(err,result){
    res.json({"status":1,"data":result})
  })
})
app.listen(3000)