var MongoClient = require("mongodb").MongoClient
var setting = require("../settings.js")
exports.insertOne = insertOne
exports.find = find
exports.getAllCount = getAllCount
exports.deleteMany = deleteMany
exports.updateMany = updateMany
function __connetDb(callback){
  var url = setting.dbUrl
  MongoClient.connect(url,function(err,db){
    callback(err,db)
  })
}

function insertOne(collectionName,json,callback){
  __connetDb(function(err,db){
    if(err){
      callback(err,null)
      return
    }
    db.collection(collectionName).insertOne(json,function(err,result){
      if(err){
        callback(err,null)
        db.close()
        return
      }
      callback(null,result)
        db.close()
    })
  })
}

function find(collectionName,params,callback){
  __connetDb(function(err,db){
      if(err){
          callback(err,null)
          db.close()
          return
      }
      var findParams = params.findParams || {}
      var findSkip = parseInt(params.findSkip) || 0
      var findLimit = parseInt(params.findLimit) || 0
      var sort = params.sort || {}
      var cursor = db.collection(collectionName).find(findParams).limit(findLimit).skip(findSkip).sort(sort)
      var resultAry = []
      cursor.each(function(err,doc){
        if(err){
          callback(err,null)
          db.close()
          return
        }
        if(doc != null){
          resultAry.push(doc)
        }else{
          callback(null,resultAry)
          db.close()
        }
      })
  })
}

function getAllCount(collectionName,callback){
  __connetDb(function(err,db){
    db.collection(collectionName).count({}).then(function(count){
      callback(count)
      db.close()
    })
  })
}

function deleteMany(collectionName,json,callback){
    __connetDb(function(err,db){
        if(err){
          callback(err,null)
          db.close()
          return
        }
        db.collection(collectionName).deleteMany(json,function(err,result){
          callback(null,result)
          db.close()
        })
    })
}

function updateMany(collectionName,params,callback){
    __connetDb(function(err,db){
      if(err){
        callback(err,null)
        db.close()
      }
      db.collection(collectionName).updateMany(
        params.findParams,
        params.updateParams,
        function(err,result){
          callback(null,result)
        })
    })
}