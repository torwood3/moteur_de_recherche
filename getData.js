/**
 * Created by Tor on 17/10/2015.
 */

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');


className = ["SUP2", "SUP3", "SUP1", "SUP4",  "SUP5",   "SUP6",   "SUP7",   "SUP8",   "SUPI",   "SUPP",   "SUPY",   "SPE1",
    "SPE2",   "SPE3",   "SPE4",   "SPE5",    "SPE6",    "SPEI",    "SPEY",    "1A",    "1B",    "1C",    "1D",    "1I",
    "1Y",    "2X",    "2Y",    "2Z",    "A1",    "A1E",    "A1R",    "A2",    "A2E",    "A2R",    "3A",    "3AA",    "3AE",
    "3AG",    "3AU",    "3AX",    "3B",    "3BR",    "3BS",    "3BG",    "3BU",    "3BX",    "3C",    "3CB",    "3CI",
    "3CT",    "3CG",    "3CX",    "3D",    "3DE",    "3DG",    "3DU",    "3DX",    "3E",    "A3",    "A3E"];
//*/
var student = [];

className.forEach(function (name) {
    request.get({url: "https://*****:*****@URL/pscripts/annuaire?section= " + name + "&filtre=*"}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var studentTable = extractStudentTable(body);
            var studentList = extractStudent(studentTable);
            student.push(studentList);
        } else {
            console.log(response.statusCode);
            //res.status(response.statusCode).end();
        }
    });
});

setTimeout(function(){
    save();
}, 30000);



function save(){
    fs.writeFile("students.json", JSON.stringify(student), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    console.log(student.length)
    console.log(className.length)
}


function extractStudentTable(html){
    $ = cheerio.load(html);
    var studentListRaw = [];
    var className = $("caption > b").html();

    $('td.nom').each(function(i, tr){
        studentListRaw.push( $(this).html() + "###" +className);
    });
    return studentListRaw;
};

function extractStudent(tableList){
    var studentList = [];
    var regWithPhoneNumber = /(.*)<br><script>.*k\('(.*)','','',''\);.*phone:(.*)">.*###(.*)/g;
    var regWithoutPhoneNumber = /(.*)<br><script>.*k\('(.*)','','',''\);.*###(.*)/g;

    //var result = regWithPhoneNumber.exec(tableList[2]);
    //    if( !result ) {
    //        result = regWithoutPhoneNumber.exec(tableList[2]);
    //    }
    //    console.log(result)
    //
    tableList.forEach(function(element){
        var result = regWithPhoneNumber.exec(element);

        if(result == null){
            result = regWithoutPhoneNumber.exec(element);
            if(result == null){
                result = regWithoutPhoneNumber.exec(element);
            }
            var student = { name: result[1], username: result[2], mail: result[2]  + "@esme.fr",phone: "", className: result[3] };
        }else {
            var student = { name: result[1], username: result[2], mail: result[2]  + "@esme.fr", phone: result[3], className: result[4]  };
        }
        studentList.push(student);
    });
    return studentList;
};