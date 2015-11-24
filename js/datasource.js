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
        'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where CRM_city like"'+ stringCity+'" Limit 10;'
    });
    request.execute(function(response) {
        console.log(response);
        if ($('#header').empty()) {
            $('#header').append("Results");
            $('#header').addClass("page-header");
         }

        var values = [[ ]];
        var header = '<th>'+"EmailMD5"+'</th>'+ '<th>'+"Birthdate"+'</th>' + '<th>'+"Gender"+'</th>' + '<th>'+"City"+'</th>' +
            '<th>'+"Ethnicity"+'</th>' + '<th>'+"Marital Status"+'</th>' + '<th>'+"Children"+'</th>' + '<th>'+"Region"+'</th>' +
            '<th>'+"Postal Code"+'</th>' + '<th>'+"Education"+'</th>' + '<th>'+"CampaignAdvertiserID"+'</th>' + '<th>'+"CampaignID"+'</th>' +
            '<th>'+"CampaignImps"+'</th>' + '<th>'+"CampaignLastSeen"+'</th>' + '<th>'+"DeviceID"+'</th>' + '<th>'+"DeviceType"+'</th>' +
            '<th>'+"Operating System"+'</th>' + '<th>'+"Device Last Seen"+'</th>' + '<th>'+"BehaviorID"+'</th>' + '<th>'+"BehaviorGroupID"+'</th>' +
            '<th>'+"BehaviorCountry"+'</th>' + '<th>'+"BehaviorCount"+'</th>' + '<th>'+"BehaviorSource"+'</th>' + '<th>'+"BehaviorLastSeen"+'</th>';
        $('#result').append(header);

        $.each(response.result.rows, function(i, item) {
            var email = item.f[0].v;
            var birthdate = item.f[1].v;
            var gender = item.f[2].v;
            var city = item.f[3].v;
            var ethnicity = item.f[4].v;
            var maritalStatus = item.f[5].v;
            var children = item.f[6].v;
            var region = item.f[7].v;
            var postalCode = item.f[8].v;
            var education = item.f[9].v;
            var campaignAdvertiserID = item.f[10].v;
            var campaignID = item.f[11].v;
            var campaignImps = item.f[12].v;
            var campaignLastSeen = item.f[13].v;
            var deviceID = item.f[14].v;
            var deviceType = item.f[15].v;
            var operatingSys = item.f[16].v;
            var deviceLastSeen = item.f[17].v;
            var behaviorID = item.f[18].v;
            var behaviorGroupID = item.f[19].v;
            var behaviorCountry = item.f[20].v;
            var behaviorCount = item.f[21].v;
            var behaviorSource = item.f[22].v;
            var behaviorLastSeen = item.f[23].v;


            var finalResults = '<tr><td><a href="">' + email + '</td></a><td>' +  birthdate + '</td><td>' +  gender + '</td><td>' + city + '</td><td>' +
                ethnicity + '</td><td>' + maritalStatus + '</td><td>' + children + '</td><td>' + region + '</td><td>' + postalCode + '</td><td>' +
                education + '</td><td>' + campaignAdvertiserID + '</td><td>' + campaignID + '</td><td>' + campaignImps + '</td><td>' +
                campaignLastSeen + '</td><td>' + deviceID + '</td><td>' + deviceType + '</td><td>' + operatingSys + '</td><td>' + deviceLastSeen + '</td><td>' +
                behaviorID + '</td><td>' + behaviorGroupID + '</td><td>' + behaviorCountry + '</td><td>' + behaviorCount + '</td><td>' +
                behaviorSource + '</td><td>' + behaviorLastSeen + '</td></tr>';
            // $('.myTable').append(finalResults);

            $('#result').append(finalResults);
            //$('#result_box').append(stateValue);

        });


    });
}
function auth(onSuccess) {

        gapi.auth.authorize(config, function () {
            gapi.client.load('bigquery', 'v2');
            $('#client_initiated').html('BigQuery client authorized');
            $('#auth_button').fadeOut();
            $('#dataset_button').fadeIn();

            if (onSuccess) {
                onSuccess();
            }

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
        document.getElementById("theImage").style.visibility = "hidden";

        auth(function() {
            var user = new MyDataSource().getUser($("#user_id").val());

            var id = $("<div></div>");
            var name = $("<div></div>");
            id.text(user.id);
            name.text(user.name);
            $("#result").empty();
            setTimeout(function(){
                runQuery();
            }, 1000);
        });


    });

});


