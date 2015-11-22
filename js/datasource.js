var MyDataSource = function() {
};

MyDataSource.prototype = {
    getUser : function(userId) {
        return {
            id: userId,
            name : userId + "_'s name"
			
        }
    }
};

function createTable() {
    var no = ["1", "2", "3", "4"];
    var names = ["Roger", "Steve", "Mike", "Charlie"];
    var countries = ["USA", "Canada", "UK", "Germany"];
    var cname = ["abc.com", "xyz.com", "123.com", "ABB.com"];

    //Test that if all array values were null then String "no data to be displayed" shows up
    //var names, countries, no, cname;
    if (no == null && names == null & countries == null && cname == null)
        $("#result").append("No data to be displayed.");
    else {
        for (i = 0; i < no.length; i++) {
            var $formrow = '<tr><td>' + no[i] + '</td><td>' + names[i] + '</td><td>' + countries[i] + '</td><td>' + cname[i] + '</td></tr>';
            // $('.myTable').append($formrow);
            $('#result').append($formrow);
        }
    }
}

var project_id = 'uci-student-project';
var client_id = '998087691315-p22i4ufoqh054dam6m5t7d03lb6hamcm.apps.googleusercontent.com';
var api_key = 'AIzaSyCi7NAyb8xu7D3KSEVKIIOQp2DpGl3T4gc';
var origin="http://localhost:63342";
var config = {
    'client_id': client_id,
    'scope': 'https://www.googleapis.com/auth/bigquery'
};



function runQuery() {

    createQueryArray();
    var request = gapi.client.bigquery.jobs.query({

        'projectId': project_id,
        'timeoutMs': '30000',
        'query': 'SELECT CRM_EmailMD5, CRM_city FROM [formal-cascade-571:uci.uci_db] where CRM_city ="'+ stringCity+'" Limit 10;'
    });
    request.execute(function(response) {
        console.log(response);
        var values = [[ "CRM_city"]];
        var header = '<th>'+"EmailMD5"+'</th>'+'<th>'+"City"+'</th>';
        $('#result').append(header);
        $.each(response.result.rows, function(i, item) {
            var email = item.f[0].v;
            var city = item.f[1].v;

            var singleValue = [email,city];

            values.push(singleValue);

            var finalResults = '<tr><td>' + email + '</td><td>' + city + '</td></tr>';
            // $('.myTable').append(finalResults);
            $('#result').append(finalResults);
            //$('#result_box').append(stateValue);

        });


    });
}
function auth() {
    gapi.auth.authorize(config, function() {
        gapi.client.load('bigquery', 'v2');
        $('#client_initiated').html('BigQuery client authorized');
        $('#auth_button').fadeOut();
        $('#dataset_button').fadeIn();

    });
}
var stringCity;
//Creates a query object and puts it into an array
var createQueryArray = function() {

    var myInputs = $("input[data-group='input']");
    var queryObject = {};
    var queriesArray = [];


    for(var i=0; i< myInputs.length; i++) {
        var textBox = $(myInputs[i]);
        var field = $(textBox).data("field"); //name, age,
        if(textBox.val()) {
            if (field == "email") {
                queryObject.email = textBox.val();
            } else if (field == "demo_city") {
                queryObject.name = textBox.val();
                stringCity = textBox.val();
               // alert(stringCity);
            } else if (field == "demo_age") {
                queryObject.age = textBox.val();
            } else if (field == "demo_gender") {
                queryObject.name = textBox.val();
            } else if (field == "demo_ethnicity") {
                queryObject.ethnicity = textBox.val();
            }
        }
    }

    console.log(queryObject);
    queriesArray.push(queryObject);
    return queriesArray;

}

$(document).ready(function () {
    $('label.tree-toggle').parent().children('ul.tree').toggle(0);
    $('.tree-toggle').click(function () {
        $(this).parent().children('ul.tree').toggle(200);
    });

});
$(document).ready(function() {

    $("#get_user").click(function() {

        var user = new MyDataSource().getUser($("#user_id").val());

        var id = $("<div></div>");
        var name = $("<div></div>");
        id.text(user.id);
        name.text(user.name);
        $("#result").empty();
      //  $("#result").append(id);
       // $("#result").append(name);

       // createTable();
       // auth();
        //runQuery();



    });

});


