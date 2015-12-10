//Configurations for connecting to Google BigQuery
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


//StandardQuery takes the fieldValue and fieldName and runs another query
//parameters: {var fieldValue, var fieldName}
function standardQuery(fieldValue, fieldName) {
    var request = gapi.client.bigquery.jobs.query({
        'projectId': project_id,
        'timeoutMs': '30000',
        'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where '+ fieldName + ' like "' + fieldValue + '" Limit 10;'
    });
    request.execute(renderResults);
}


//PopUpQuery takes the fieldValue and fieldName and runs another query
//parameters: {var fieldValue, var fieldName}
function popupQuery(fieldValue, fieldName) {
    var request = gapi.client.bigquery.jobs.query({
        'projectId': project_id,
        'timeoutMs': '30000',
        'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where '+ fieldName + ' like "' + fieldValue + '" Limit 10;'
    });

    request.execute(renderPopUp);

}


// code taken from uniondesign.ca/simple-accordion-without-jquery-ui/
  $(document).ready(function($) {
    $('#accordion').find('.accordion-toggle').click(function(){

      //Expand or collapse this panel
      $(this).next().slideToggle('fast');

      //Hide the other panels
      $(".accordion-content").not($(this).next()).slideUp('fast');

    });
  });
// end http://uniondesign.ca/simple-accordion-without-jquery-ui/

//Cross checks the schema variable with the fields variable.
//If a field does not exist, then it is added to the schema.
//parameters: {var fields}
function makeSchema(fields) {

    for (var i = 0; i < fields.length; i++) {
        var fieldName = fields[i].name;
        if (!schema[fieldName]) {
            console.log("There is a field without UI name [" + fieldName + "]");
            schema[fieldName] = fieldName;
        }

    }
}

//Stores the configuration for the popUp
function popUp(info) {
    $('#popup').bPopup({
        easing: 'easeOutBack',
        speed: 450,
        transition: 'slideDown'
    });

    $('#popup').bPopup().empty();
    $('#popup').bPopup().append(info);
}


//Renders the results in the popUp after the query is run
var renderPopUp = function (response) {
    var indivInfo ; //Stores individual info for popUp functionality
    var fields = response.result.schema.fields;
    var data = [];
    makeSchema(fields);

    if (response.result.rows) {
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
    }
    //Appends data to indvInfo variable
    indivInfo = '<h1 style="text-align:center;">Individual Profile</h1><br/>';
    for (var i = 0; i < data.length; i++) {
        var test = data[i];
        var line;

        for (var j = 0; j < fields.length; j++) {
            if (test.hasOwnProperty(fields[j].name)) {
                var fieldName = fields[j].name;
                line = schema[fieldName] + ": " + test[fields[j].name] + '<br/>';
            }
            indivInfo += line;
        }
        if(i < data.length-1)
            indivInfo += '<h1 style="text-align:center;">Individual Profile</h1><br/>';

    }
    popUp(indivInfo);
}

//Renders the results into a table after the query is run
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

    if (response.result.rows) {

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
    }

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

                field.click(function () {
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

                    var myButton = $("<button type = 'button' value = '"+queryValue.data("value")+"'class = 'btn btn-default btn-sm'>" +
                                    "<span class = 'glyphicon glyphicon-user'></span></button>");
                    column.append(myButton);
                    myButton.data("queryfield",fields[j].name);

                    myButton.click(function () {
                        popupQuery($(this).val(), $(this).data("queryfield"));

                    });
                }else{
                    column.append(field);

                }
            }
            row.append(column);
        }
        $('#result').append(row);
    }

};

//Runs the query when the search button is clicked
function runQuery() {

    createQueryArray();
    var request = gapi.client.bigquery.jobs.query({

        'projectId': project_id,
        'timeoutMs': '30000',
        'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where CRM_city like"' + stringCity + '" Limit 10;'
    });
    request.execute(renderResults);
}

//Authorizes the connection to GBQ
function auth(onSuccess) {
    gapi.auth.authorize(config, function () {
        gapi.client.load('bigquery', 'v2');

        if (onSuccess) {
            onSuccess();
        }

    });


}
var stringCity;
//Creates a query object and puts all the values entered by the user via the left nav in an array
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

//Left navigation specifications
$(document).ready(function () {
    $('label.tree-toggle').parent().children('ul.tree').toggle(0);
    $('.tree-toggle').click(function () {
        $(this).parent().children('ul.tree').toggle(200);
    });

});

//Search button functionality
$(document).ready(function () {
    $("#get_user").click(function () {
        document.getElementById("theImage").style.visibility = "hidden";
        auth(function () {
            $("#result").empty();
            setTimeout(function () {
                runQuery();
            }, 1000);
        });
    });


});

//If enter is pressed in a textbox then the search functionality will be activated.
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




