var MyDataSource = function () {
};

MyDataSource.prototype = {
    getUser: function (userId) {
        return {
            id: userId,
            name: userId + "_'s name"

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
var origin = "http://localhost:63342";
var config = {
    'client_id': client_id,
    'scope': 'https://www.googleapis.com/auth/bigquery'
};

// Schema based on GBQ
var schema = {
    CRM_EmailMD5: "EmailMD5",
    CRM_birthdate: "Birthdate", // Associated with Age
    CRM_gender: "Gender",
    CRM_city: "City",
    CRM_ethnicity: "Ethnicity",
    CRM_marital: "Marital",
    CRM_children: "Children",
    CRM_region: "Region",
    CRM_postalcode: "Postal Code",
    CRM_education: "Education",
    CampaignAdvertiserID: "CampaignAdvertiserID",
    CampaignID: "CampaignID",
    CampaignImps: "CampaignImps",
    CampaignLastSeen: "CampaignLastSeen",
    DeviceID: "DeviceID",
    DeviceType: "Device Type",
    OperatingSystem: "Operating System",
    DeviceLastSeen: "DeviceLastSeen",
    BehaviorID: "BehaviorID",
    BehaviorGroupID: "BehaviorGroupID",
    BehaviorCountry: "BehaviorCountry",
    BehaviorCount: "BehaviorCount",
    BehaviorSource: "BehaviorSource",
    BehaviorLastSeen: "BehaviorLastSeen"
}

function standardQuery(fieldValue, fieldName) {
    var request = gapi.client.bigquery.jobs.query({
        'projectId': project_id,
        'timeoutMs': '30000',
        'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where '+ fieldName + ' like "' + fieldValue + '" Limit 10;'
    });
    console.log('SELECT * FROM [formal-cascade-571:uci.uci_db] where '+ fieldName + ' like "' + fieldValue + '" Limit 10;');
    //request.execute(renderIndivResultswithPopUp);
    request.execute(renderResults);

}

function queryServer(fieldName, value) {

    var query = 'SELECT * FROM [formal-cascade-571:uci.uci_db] where ' + fieldName + ' like "' + value + '" Limit 10;';
    var request = gapi.client.bigquery.jobs.query({
        'projectId': project_id,
        'timeoutMs': '30000',
        'query': query
    });
    request.execute(renderIndivResultswithPopUp);
}

function makeSchema(fields) {

    for (var i = 0; i < fields.length; i++) {
        var fieldName = fields[i].name;
        if (!schema[fieldName]) {
            console.log("There is a field without UI name [" + fieldName + "]");
            schema[fieldName] = fieldName;
        }

    }
}


function popUp() {
    $('#popup').bPopup({
        easing: 'easeOutBack', //uses jQuery easing plugin
        speed: 450,
        transition: 'slideDown'
    });
    console.log("popup "+ fieldValue);
    //$('#popup').bPopup().empty();
    //standardQuery(fieldValue, fieldName)
    //$('#popup').bPopup().append(indivInfo);
}


var indivInfo; //Stores individual info for popUp functionality

var renderResults = function (response) {
    console.log(response);
    if ($('#header').empty()) {
        $('#header').append("Results");
        $('#header').addClass("page-header");
    }
    $('#result').empty();

    var values = [[]];

    var fields = response.result.schema.fields;
    var data = [];
    makeSchema(fields);
    $.each(response.result.rows, function (j, row) {
        var thisData = {};

    for (var prop in schema) {
        if (schema.hasOwnProperty(prop)) {
                for (var i = 0; i < fields.length; i++) {
                    if (fields[i].name == prop) {
                            thisData[fields[i].name] = row.f[i].v;

                    }
                }
        }
    }
        data.push(thisData);
    });

    //Appends table header
    for(var i=0; i < fields.length; i++){
        var header = $("<th></th>");
        header.append(schema[fields[i].name]);
        $('#result').append(header);
    }

    console.log("DATA FROM SERVER");
    console.log(data);

    //Appends data to the table
    for(var i=0; i < data.length; i++){
        var test = data[i];
        var row = $("<tr></tr>");
        indivInfo += '<h1 style="text-align:center;">Individual Profile</h1><br/>';
        for (var j = 0; j < fields.length; j++) {
            if(test.hasOwnProperty(fields[j].name)){
                var column = $("<td></td>");
                var field = $("<a></a>");
                var fieldName = fields[j].name;
                field.attr("href", "javascript:void(0)");
                //field.data(schema[fieldName], test[fields[j].name]); //field.data("emailmd5", email);
                field.text(test[fields[j].name]);                //field.text(emailMD5);

                field.data("queryField", fields[j].name);            //field.data("queryField", "CRM_EmailMD5");
                field.data("value", test[fields[j].name]);

                var fieldValue = field.data("value");
                indivInfo += schema[fieldName] + ": " + test[fields[j].name] + '<br/>';
                field.click(function () {
                    //fieldValue = $(this).data("value");
                    console.log($(this).data("value"));
                    console.log($(this).data("queryField"));

                    standardQuery($(this).data("value"), $(this).data("queryField"));
                });

                if(fields[j].name == "CRM_EmailMD5") {
                    var queryField = fields[j].name;
                   // var queryValue = test[fields[j].name];
                    var queryValue = $("<a></a>");
                    queryValue.attr("href", "javascript:void(0)");
                    queryValue.data("value", test[fields[j].name]);
                    queryValue.text(test[fields[j].name]);
                    column.append(field);
                    console.log("queryval "+queryValue.data("value"));
                    // column.append("<button type = 'button' onclick='popUp("+$(this).data("value"), $(this).data("queryField"))+"); class = 'btn btn-default btn-sm'><span class = 'glyphicon glyphicon-user'></span></button>");
                    column.append("<button type = 'button' id = 'popUpButton' value = '"+queryValue.data("value")+"'class = 'btn btn-default btn-sm'>" +
                    //column.append("<button type = 'button' id = 'popUpButton' onclick='popUp(' +queryValue.data("value")+');' class = 'btn btn-default btn-sm'>" +
                        "<span class = 'glyphicon glyphicon-user'></span></button>");

                    var myButton = document.getElementById("popUpButton");

                   /* if(myButton != null){
                        console.log(myButton.value);
                    }
*/
                   // myButton.value = field.data("value");
                    if (myButton !== null) {
                        myButton.value = queryValue.data("value");
                        console.log("but but but " +myButton.value);
                    console.log("in here");
                        myButton.addEventListener('click', function () {
                            var fieldValue = $(this).data(schema[queryField]);
                            console.log("buttonval "+myButton.value);
                            //standardQuery(myButton.value, schema[queryField]);
                            //$('#popup').bPopup().append(indivInfo);
                        }, false);

                    }
                }else{
                    column.append(field);

                }

                //column.append(field );
            }
            row.append(column);
        }
        indivInfo += indivInfo;
        $('#result').append(row);
    }

};
function runQuery() {

    createQueryArray();
    var request = gapi.client.bigquery.jobs.query({

        'projectId': project_id,
        'timeoutMs': '30000',
        'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where CRM_city like"' + stringCity + '" Limit 10;'
    });
    request.execute(renderResults);
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
var createQueryArray = function () {

    var myInputs = $("input[data-group='input']");
    var queryObject = {};
    var queriesArray = [];


    for (var i = 0; i < myInputs.length; i++) {
        var textBox = $(myInputs[i]);
        var field = $(textBox).data("field"); //name, age,
        if (textBox.val()) {
            if (field == "email") {
                queryObject.email = textBox.val();
            } else if (field == "demo_city") {
                queryObject.city = textBox.val();
                stringCity = textBox.val();
                // alert(stringCity);
            } else if (field == "demo_age") {
                queryObject.age = textBox.val();
            } else if (field == "demo_gender") {
                queryObject.gender = textBox.val();
            } else if (field == "demo_ethnicity") {
                queryObject.ethnicity = textBox.val();
            } else if (field == "demo_maritalStatus") {
                queryObject.maritalStatus = textBox.val();
            } else if (field == "demo_childrenStatus") {
                queryObject.childrenStatus = textBox.val();
            } else if (field == "demo_sexualOrientation") {
                queryObject.sexualOrientation = textBox.val();
            } else if (field == "demo_income") {
                queryObject.income = textBox.val();
            } else if (field == "demo_education") {
                queryObject.education = textBox.val();
            } else if (field == "geo_address") {
                queryObject.address = textBox.val();
            } else if (field == "geo_region") {
                queryObject.region = textBox.val();
            } else if (field == "geo_city") {
                queryObject.geoCity = textBox.val();
            } else if (field == "geo_zipCode") {
                queryObject.zipCode = textBox.val();
            } else if (field == "geo_country") {
                queryObject.country = textBox.val();
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

$(function () {
    $('#pop').click(function () {
        $('#popup').bPopup();
    });
});
$(document).ready(function () {

    $("#get_user").click(function () {
        document.getElementById("theImage").style.visibility = "hidden";

        auth(function () {
            var user = new MyDataSource().getUser($("#user_id").val());

            var id = $("<div></div>");
            var name = $("<div></div>");
            id.text(user.id);
            name.text(user.name);
            $("#result").empty();
            setTimeout(function () {
                runQuery();
            }, 1000);
        });
    });


});

function handle(e){
    if(e.keyCode === 13){
        document.getElementById("theImage").style.visibility = "hidden";
        auth(function () {
        $("#result").empty();
        setTimeout(function () {
            runQuery();
        }, 1000);
        });

    }

    return false;
}




