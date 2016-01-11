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

// Takes in fieldValue and splits the string and formats it to run the query
function formatFieldName(fieldName) {
    var name = fieldName.split("_");
    var formatted = name[0].concat(".", name[1]);

    if (name.length > 2) {
        for (var i=2; i<name.length; i++)
        {
            formatted = formatted.concat("_", name[i]);
        }
    }
    console.log("Formatted fieldName: " + formatted);
    return formatted;
}

//StandardQuery takes the fieldValue and fieldName and runs another query
//parameters: {var fieldValue, var fieldName}
function standardQuery(fieldValue, fieldName) {
    var formattedFieldName = formatFieldName(fieldName);

    var request = gapi.client.bigquery.jobs.query({
        'projectId': project_id,
        'timeoutMs': '30000',
        /* v1.0 query for old database */
        //'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where ' + fieldName + ' like "' + fieldValue + '" Limit ' + selText + ';'

        /* v2.0 Full query format using new database but some searches don't come through therefore commented some out
         * feel free to play around with them and adjust as needed */
        'query': 'SELECT * FROM [formal-cascade-571:uci.demo_info] AS demo ' +
        'JOIN EACH [formal-cascade-571:uci.address_info] AS addr ON demo.emailmd5 = addr.Emailmd5 ' +
        'JOIN EACH [formal-cascade-571:uci.campaign_info] AS camp ON demo.emailmd5 = camp.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.device_info] AS dev ON demo.emailmd5 = dev.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.behavior_info] AS beh ON demo.emailmd5 = beh.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.purchase_info] AS purch ON demo.emailmd5 = purch.emailmd5 ' +
        'where ' + formattedFieldName + ' like "' + fieldValue + '" Limit ' + selText + ';'
    });
    request.execute(renderResults);
}


//PopUpQuery takes the fieldValue and fieldName and runs another query
//parameters: {var fieldValue, var fieldName}
function popupQuery(fieldValue, fieldName) {
    var formattedFieldName = formatFieldName(fieldName);

    var request = gapi.client.bigquery.jobs.query({
        'projectId': project_id,
        'timeoutMs': '30000',
        /* v1.0 query for old database */
        //'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where ' + fieldName + ' like "' + fieldValue + '" Limit ' + selText + ';'

        /* v2.0 Full query format using new database but some searches don't come through therefore commented some out
         * feel free to play around with them and adjust as needed */
        'query': 'SELECT * FROM [formal-cascade-571:uci.demo_info] AS demo ' +
        'JOIN EACH [formal-cascade-571:uci.address_info] AS addr ON demo.emailmd5 = addr.Emailmd5 ' +
        'JOIN EACH [formal-cascade-571:uci.campaign_info] AS camp ON demo.emailmd5 = camp.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.device_info] AS dev ON demo.emailmd5 = dev.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.behavior_info] AS beh ON demo.emailmd5 = beh.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.purchase_info] AS purch ON demo.emailmd5 = purch.emailmd5 ' +
        'where ' + formattedFieldName + ' like "' + fieldValue + '" Limit ' + selText + ';'
    });

    request.execute(renderPopUp);

}

//deciding how many results to show
//http://stackoverflow.com/questions/17127572/bootstrap-dropdown-get-value-of-selected-item
$(document).on('click', '.dropdown-menu li a', function () {
            selText = $(this).text();
            $('#dLabel').html(selText + '<span class="caret"</span>');
        });


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

// variable to store breadcrumbs
var crumbs = {};

//Forms the breadcrumbs
var formBreadcrumb = function () {


    if ($('#breadcrumbs').empty()){
        $('#breadcrumbs').append("<a>initalSearch </a>/ ");
    }

    for (var prop in crumbs) {
        if (crumbs.hasOwnProperty(prop)) {
            var test = $("<li></li>");
            var link = $("<a></a>");
            link.attr("href", "javascript:void(0)");
            link.append(prop + " : " + crumbs[prop] + " ");
            link.data("value", crumbs[prop]);
            link.data("queryField", prop);
            test.append(link);
            $('#breadcrumbs').append(test);

            link.click(function () {
                standardQuery($(this).data("value"), $(this).data("queryField"));
            });
        }
    }

};


//for pagination of table
//http://www.bilalakil.me/simplepagination/comment-page-1/
var paginate = function (toPag) {
toPag.addClass("paginate");
 };

var initpag = function(){


        jQuery(function($) {
     // Grab whatever we need to paginate
     var pageParts = $(".paginate");


     // How many parts do we have?
     var numPages = pageParts.length;
     // How many parts do we want per page?
     var perPage = 10;

     // When the document loads we're on page 1
     // So to start with... hide everything else
     pageParts.slice(perPage).hide();
     // Apply simplePagination to our placeholder

    $("#page-nav").pagination({
         items: numPages,
         itemsOnPage: perPage,
         cssStyle: "light-theme",
         // We implement the actual pagination
         //   in this next function. It runs on
         //   the event that a user changes page
         onPageClick: function(pageNum) {
             // Which page parts do we show?
             var start = perPage * (pageNum - 1);
             var end = start + perPage;

             // First hide all page parts
             // Then show those just for our page
             pageParts.hide()
                      .slice(start, end).show();
         }
     });
 });

};
//Renders the results into a table after the query is run
var renderResults = function (response) {

    console.log(response);
    if ($('#header').empty()) {
        $('#header').append("Results for city: "+ stringCity);
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
    var thTag = $("<thead></thead>");
    var trTag = $("<tr></tr>");
    for(var i=0; i < fields.length; i++){
        var header = $("<th></th>");
        header.append(schema[fields[i].name]);
        trTag.append(header);
        thTag.append(trTag);
    }
    $('#result').append(thTag);

    console.log(result);
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
                    crumbs[$(this).data("queryField")]= $(this).data("value");
                    formBreadcrumb();
                });

                // switch the commented line to return to old database
                //if(fields[j].name == "CRM_EmailMD5") {
                if (fields[j].name == "demo_emailmd5") {
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
        paginate(row);
    }

//Calls the sort function to add sorting functionality to the table

        sort();
        initpag();
};


//Adds sorting functionality to the table so that the user can sort data by clicking on the column headers
function sort() {
    initTable("result");
}


//Runs the query when the search button is clicked
function runQuery() {

    createQueryArray();
    var request = gapi.client.bigquery.jobs.query({

        'projectId': project_id,
        'timeoutMs': '30000',
        /* v1.0 query for old database */
        //'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where CRM_city like"' + stringCity + '" Limit ' + selText + ';'

        /* v2.0 Full query format using new database but some searches don't come through therefore commented some out
        * feel free to play around with them and adjust as needed */
        'query': 'SELECT * FROM [formal-cascade-571:uci.demo_info] AS demo ' +
        'JOIN EACH [formal-cascade-571:uci.address_info] AS addr ON demo.emailmd5 = addr.Emailmd5 ' +
        'JOIN EACH [formal-cascade-571:uci.campaign_info] AS camp ON demo.emailmd5 = camp.emailmd5 ' +
        //'JOIN EACH [formal-cascade-571:uci.device_info] AS dev ON demo.emailmd5 = dev.emailmd5 ' +
        //'JOIN EACH [formal-cascade-571:uci.behavior_info] AS beh ON demo.emailmd5 = beh.emailmd5 ' +
        //'JOIN EACH [formal-cascade-571:uci.purchase_info] AS purch ON demo.emailmd5 = purch.emailmd5 ' +
        'where demo.city like "' + stringCity + '" Limit ' + selText + ';'
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
            crumbs = [];
            $('#breadcrumbs').empty();
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
        crumbs = [];
        $('#breadcrumbs').empty();
        setTimeout(function () {
            runQuery();
        }, 1000);
        });

    }

    return false;
}

//Exports the data in the table to an xls file
$(document).ready(function () {
    $("#export").click(function (e) {
    if(result.firstChild != null){
        window.open('data:application/vnd.ms-excel,' + encodeURIComponent(result.innerText));
        e.preventDefault();
        }
    });


});