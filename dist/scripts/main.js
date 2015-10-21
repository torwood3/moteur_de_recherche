/**
 * Created by Tor on 17/10/2015.
 */

$().ready(function(){

    $("div.searchEngine > button").click(getSearch);
    $("input[name=searchField]").on("keyup",getSearch);
    $('#filtreClass').on('click', 'button', filtreClass);
    $("#stopFiltre").click(stopFiltre);

    function getSearch(){
        var search = $("input[name=searchField]").val();
        if( search.length < 2) { cleanAll(); return; }
        var regex = new RegExp(search,"gi");

        var beforeTimestamp = new Date();
        $.getJSON("http://moteur-recherche-esme.herokuapp.com/search/" + search, function(data){
            var afterTimestamp = new Date();
            var time = afterTimestamp - beforeTimestamp;
            displayResult(data, search, regex, time);
        }).fail(function(){
            alert("Error, try again !");
        });
    }

    var cleanAll = function(){
        $('#message').empty();
        $("#result").empty();
    };

    var displayResult = function( data, search, regex, time){
        var result = $("#result").empty(); $("#filtreClass").empty();
        var nbResult = 0;
        var filtreClassList = [];

        //On boucle sur la liste des classes repondant à la recherche
        data.forEach(function(classList){
            //Je compte le nombre d'eleve par classe
            nbResult += classList.length;

            if( filtreClassList.indexOf(classList[0].className) == -1){
                filtreClassList.push(classList[0].className);
                //Je crée les filtre par classe qui correspondent a ma recherche
                $("#filtreClass").append("<button type=\"button\" class='list-group-item "+classList[0].className+"'>" + classList[0].className + "</li>");
            }
            //J'affiche les classes avant d'afficher les eleves
            result.append("<tr class='className'><td>"+classList[0].className.replace( regex, "<span class='highLight'>" + search + "</span>" ) +"</td></tr>" );

            //Je boucles par classe
            classList.forEach(function(student){

                //J'affiche les eleves
                result.append( displayStudent(student, search, regex) );
            });
        });
        //On marque un petit message avec des stats (temps d'exec, etc..)
        $('#message').empty().append( nbResult + " r&eacute;sultats pour la recherche '" + search + "' en " + time +"ms" );
    };

    function filtreClass () {
        //On cache tout les resultats
        $('tr').hide();
        // Affichage des resultat correspondant et de la classe
        $('.'+this.classList[1]).show().prev().show();
    }

    function stopFiltre(){
        console.log("ee")
        $('tr').show();
    };

    // Je formate l'affichage des eleves
    var displayStudent = function( studentData, search, regex ) {
        var student = "<tr class='"+ studentData.className + "'>";
        student += "<td>"+ studentData.name.replace( regex, "<span class='highLight'>" + search + "</span>" ) + "</td>";
        student += "<td>"+ studentData.username.replace( regex, "<span class='highLight'>" + search + "</span>" ) + "</td>";
        student += "<td>"+ studentData.phone.replace( regex, "<span class='highLight'>" + search + "</span>" ) + "</td>";
        student += "<td>"+ studentData.mail.replace( regex, "<span class='highLight'>" + search + "</span>" ) + "</td>";
        student += "</tr>";

        return student;
    }



});