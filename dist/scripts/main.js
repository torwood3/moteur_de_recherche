/**
 * Created by Tor on 17/10/2015.
 */

var url = "http://localhost:3000/search";

$().ready(function(){
    $("div.searchEngine > button").click(getSearch);

    function getSearch(){
        var search = $("input[name=searchField]").val();
        $.getJSON(url + "/" + search, function(data){
            console.log(data);
        }).fail(function(){
            alert("Error, try again !");
        });

    }


});