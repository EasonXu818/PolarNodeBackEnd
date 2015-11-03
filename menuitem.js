var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbOptions = {
      host: 'localhost',
      user: 'root',
      password: 'wuid',
      port: 3306,
      database: 'polargeosystem'
    };
var pool  = mysql.createPool(dbOptions);


// //query by id
router.get('/:id', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    if (err) return next(err);

      connection.query('SELECT * from menuitems ', function(err, rows, fields) {
        if (err) throw err;
        //get all data
        var result = [];
        var allMenu = rows;
        for(i=0;i<allMenu.length;i++){
          if(allMenu[i].id == req.params.id){
            result.push(allMenu[i]) ;
            break;
          }
        }
       //judege result exist or not
        if(result.length==0){

           return res.json('Failed! id is not exist!');

        }else{

          result.sub=[];
          result.sub=getAllChild(result);
          res.json(result[0]);

        }
        //find some item all child
        function findItemChild(item){
          var arrayList=[];
          for(var i in allMenu){
            if(allMenu[i].parent == item.id){
              arrayList.push(allMenu[i]);
            }
          }
          return arrayList;
        }
        //get all child
        function getAllChild(array){
          var childList=findItemChild(array[0]);
          if(childList == null){
            return [];
          }
          else{
            for(var j in childList){
              childList[j].sub=[];
              childList[j].sub=getAllChild([childList[j]]);
            }
            array[0].sub=childList;
          }
          return childList;

        }

      });

  });

});

// //query all
router.get('/', function(req, res, next) {

  pool.getConnection(function(err, connection) {
    if (err) return next(err);
    connection.query('SELECT * from menuitems ', function(err, rows, fields) {
      if (err) throw err;
      //get all data
      //create a id= null root for forest
      var temp_parent={"id":null,"sub":[]};
      var result=[];
      var allMenu = rows;

       result.push(temp_parent) ;

      var output = getAllChild(result);
      if(output.length==0){
        //if our database do note have any data
        return res.json('Failed! do not have any data!');
      }else {
        res.json(output);
      }

      //find some item all child
      function findItemChild(item){
        var arrayList=[];
        for(var i in allMenu){
          if(allMenu[i].parent == item.id){
            arrayList.push(allMenu[i]);
          }
        }
        return arrayList;
      }
      //get all child
      function getAllChild(array){
        var childList=findItemChild(array[0]);
        if(childList == null){
          return [];
        }
        else{
          for(var j in childList){
            childList[j].sub=[];
            childList[j].sub=getAllChild([childList[j]]);
          }
          array[0].sub=childList;
        }
        return childList;

      }

      });

});
});


module.exports = router;
