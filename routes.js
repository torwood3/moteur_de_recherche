/**
 * Created by Tor on 17/10/2015.
 */
var express = require('express');
var students = require('./students');

module.exports = function() {

    var router = express.Router();
    router.get('/', function (req, res) {
        res.end("TD");
        //res.render("index");
    });

    router.get('/search/:search', function(req, res){
        searchMatch(req.params.search.toLowerCase(), function(data){
            res.json(data).end();
        })
    });
    return router;
};


var searchMatch = function(search, callback) {
    var result = [];
    students.forEach( function(studentClass){
        result.push(studentClass.filter(
            function(student) { return (student.name.toLowerCase().indexOf(search) != -1 || student.phone.toLowerCase().indexOf(search) != -1 ||
            student.username.toLowerCase().indexOf(search) != -1  || student.mail.toLowerCase().indexOf(search) != -1 || student.className.toLowerCase().indexOf(search) != -1)  }
        ) );
    });
    var  len = result.length, i;
    for(i = 0; i < len; i++ )
        result[i] && result[i][0] && result.push(result[i]);  // copy non-empty values to the end of the array

    result.splice(0 , len);
    callback(result);
};