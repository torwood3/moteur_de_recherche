/**
 * Created by Tor on 17/10/2015.
 */

$().ready(function(){
    $("div.searchEngine > button").click(getSearch);

    function getSearch(){
        var search = $("input[name=searchField]").val();
        $.getJSON("/search/" + search, function(data){
            console.log(data);
        }).fail(function(){
            alert("Error, try again !");
        });

    }


});