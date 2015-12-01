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

function emailQuery(emailMD5) {
    var request = gapi.client.bigquery.jobs.query({
        'projectId': project_id,
        'timeoutMs': '30000',
        'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where CRM_EmailMD5 like"' + emailMD5 + '" Limit 10;'
    });

    request.execute(renderResults);
}

function birthdateQuery(Date) {
    var request = gapi.client.bigquery.jobs.query({
        'projectId': project_id,
        'timeoutMs': '30000',
        'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where CRM_birthdate like"' + Date + '" Limit 10;'
    });

    request.execute(renderResults);
}

var renderResults = function (response) {
    console.log(response);
    if ($('#header').empty()) {
        $('#header').append("Results");
        $('#header').addClass("page-header");
    }
    $('#result').empty();

    var values = [[]];
    var header = '<th>' + "EmailMD5" + '</th>' + '<th>' + "Birthdate" + '</th>' + '<th>' + "Gender" + '</th>' + '<th>' + "City" + '</th>' +
        '<th>' + "Ethnicity" + '</th>' + '<th>' + "Marital Status" + '</th>' + '<th>' + "Children" + '</th>' + '<th>' + "Region" + '</th>' +
        '<th>' + "Postal Code" + '</th>' + '<th>' + "Education" + '</th>' + '<th>' + "CampaignAdvertiserID" + '</th>' + '<th>' + "CampaignID" + '</th>' +
        '<th>' + "CampaignImps" + '</th>' + '<th>' + "CampaignLastSeen" + '</th>' + '<th>' + "DeviceID" + '</th>' + '<th>' + "DeviceType" + '</th>' +
        '<th>' + "Operating System" + '</th>' + '<th>' + "Device Last Seen" + '</th>' + '<th>' + "BehaviorID" + '</th>' + '<th>' + "BehaviorGroupID" + '</th>' +
        '<th>' + "BehaviorCountry" + '</th>' + '<th>' + "BehaviorCount" + '</th>' + '<th>' + "BehaviorSource" + '</th>' + '<th>' + "BehaviorLastSeen" + '</th>';
    $('#result').append(header);

    $.each(response.result.rows, function (i, item) {
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

        // hardcoded for now
        var row = $("<tr></tr>");
        var emailColumn = $("<td></td>");
        var emailField = $("<a></a>");
        emailField.attr("href", "javascript:void(0)");
        emailField.text(email);
        emailField.data("emailmd5", email);
        emailField.click(function () {
            var emailMD5 = $(this).data("emailmd5");
            console.log(emailMD5);
            emailQuery(emailMD5);
        });

        emailColumn.append(emailField);
        row.append(emailColumn);

        var birthdateColumn = $("<td></td>");
        var birthdateField = $("<a></a>");
        birthdateField.attr("href", "javascript:void(0)");
        birthdateField.text(birthdate);
        birthdateField.data("date", birthdate);
        birthdateField.click(function () {
            var date = $(this).data("date");
            console.log(date);
            birthdateQuery(date);
        });

        birthdateColumn.append(birthdateField);
        row.append(birthdateColumn);

        var genderColumn = $("<td></td>");
        var genderField = $("<a></a>");
        genderField.attr("href", "javascript:void(0)");
        genderField.text(gender);
        genderField.data("gender", gender);
        genderField.click(function () {
            var gender = $(this).data("gender");
            console.log(gender);
            //genderQuery(gender);
        });

        genderColumn.append(genderField);
        row.append(genderColumn);

        var cityColumn = $("<td></td>");
        var cityField = $("<a></a>");
        cityField.attr("href", "javascript:void(0)");
        cityField.text(city);
        cityField.data("city", city);
        cityField.click(function () {
            var city = $(this).data("city");
            console.log(city);
            //cityQuery(city);
        });

        cityColumn.append(cityField);
        row.append(cityColumn);

        var ethnicityColumn = $("<td></td>");
        var ethnicityField = $("<a></a>");
        ethnicityField.attr("href", "javascript:void(0)");
        ethnicityField.text(ethnicity);
        ethnicityField.data("ethnicity", ethnicity);
        ethnicityField.click(function () {
            var ethnicity = $(this).data("ethnicity");
            console.log(ethnicity);
            //ethnicityQuery(ethnicity);
        });

        ethnicityColumn.append(ethnicityField);
        row.append(ethnicityColumn);

        var maritalColumn = $("<td></td>");
        var maritalField = $("<a></a>");
        maritalField.attr("href", "javascript:void(0)");
        maritalField.text(maritalStatus);
        maritalField.data("marital", maritalField);
        maritalField.click(function () {
            var marital = $(this).data("marital");
            console.log(marital);
            //maritalQuery(marital);
        });

        maritalColumn.append(maritalField);
        row.append(maritalColumn);

        var childrenColumn = $("<td></td>");
        var childrenField = $("<a></a>");
        childrenField.attr("href", "javascript:void(0)");
        childrenField.text(children);
        childrenField.data("child", children);
        childrenField.click(function () {
            var child = $(this).data("child");
            console.log(child);
            //childrenQuery(child);
        });

        childrenColumn.append(childrenField);
        row.append(childrenColumn);

        var regionColumn = $("<td></td>");
        var regionField = $("<a></a>");
        regionField.attr("href", "javascript:void(0)");
        regionField.text(region);
        regionField.data("region", region);
        regionField.click(function () {
            var region = $(this).data("region");
            console.log(region);
            //regionQuery(region);
        });

        regionColumn.append(regionField);
        row.append(regionColumn);

        var educationColumn = $("<td></td>");
        var educationField = $("<a></a>");
        educationField.attr("href", "javascript:void(0)");
        educationField.text(education);
        educationField.data("education", education);
        educationField.click(function () {
            var education = $(this).data("education");
            console.log(education);
            //educationQuery(postalCode);
        });

        educationColumn.append(educationField);
        row.append(educationColumn);

        var campaignAdvertiserIDColumn = $("<td></td>");
        var campaignAdvertiserIDField = $("<a></a>");
        campaignAdvertiserIDField.attr("href", "javascript:void(0)");
        campaignAdvertiserIDField.text(campaignAdvertiserID);
        campaignAdvertiserIDField.data("campaignAdID", campaignAdvertiserID);
        campaignAdvertiserIDField.click(function () {
            var campaignAdID = $(this).data("campaignAdID");
            console.log(campaignAdID);
            //campaignAdvertiserIDQuery(campaignAdID);
        });

        campaignAdvertiserIDColumn.append(campaignAdvertiserIDField);
        row.append(campaignAdvertiserIDColumn);

        var campaignIDColumn = $("<td></td>");
        var campaignIDField = $("<a></a>");
        campaignIDField.attr("href", "javascript:void(0)");
        campaignIDField.text(campaignID);
        campaignIDField.data("campaignID", campaignID);
        campaignIDField.click(function () {
            var campaignID = $(this).data("campaignID");
            console.log(campaignID);
            //campaignIDQuery(campaignID);
        });

        campaignIDColumn.append(campaignIDField);
        row.append(campaignIDColumn);

        var campaignImpsColumn = $("<td></td>");
        var campaignImpsField = $("<a></a>");
        campaignImpsField.attr("href", "javascript:void(0)");
        campaignImpsField.text(campaignImps);
        campaignImpsField.data("campaignImps", campaignImps);
        campaignImpsField.click(function () {
            var campaignImps = $(this).data("campaignImps");
            console.log(campaignImps);
            //campaignImpsQuery(campaignImps);
        });

        campaignImpsColumn.append(campaignImpsField);
        row.append(campaignImpsColumn);

        var campaignLastSeenColumn = $("<td></td>");
        var campaignLastSeenField = $("<a></a>");
        campaignLastSeenField.attr("href", "javascript:void(0)");
        campaignLastSeenField.text(campaignLastSeen);
        campaignLastSeenField.data("campaignLastSeen", campaignLastSeen);
        campaignLastSeenField.click(function () {
            var campaignLastSeen = $(this).data("campaignLastSeen");
            console.log(campaignLastSeen);
            //campaignLastSeenQuery(campaignLastSeen);
        });

        campaignLastSeenColumn.append(campaignLastSeenField);
        row.append(campaignLastSeenColumn);

        var deviceIDColumn = $("<td></td>");
        var deviceIDField = $("<a></a>");
        deviceIDField.attr("href", "javascript:void(0)");
        deviceIDField.text(deviceID);
        deviceIDField.data("deviceID", deviceID);
        deviceIDField.click(function () {
            var deviceID = $(this).data("deviceID");
            console.log(deviceID);
            //deviceIDQuery(deviceID);
        });

        deviceIDColumn.append(deviceIDField);
        row.append(deviceIDColumn);


        var deviceTypeColumn = $("<td></td>");
        var deviceTypeField = $("<a></a>");
        deviceTypeField.attr("href", "javascript:void(0)");
        deviceTypeField.text(deviceType);
        deviceTypeField.data("deviceType", deviceType);
        deviceTypeField.click(function () {
            var deviceType = $(this).data("deviceType");
            console.log(deviceType);
            //deviceTypeQuery(deviceType);
        });

        deviceTypeColumn.append(deviceTypeField);
        row.append(deviceTypeColumn);

        var operatingSysColumn = $("<td></td>");
        var operatingSysField = $("<a></a>");
        operatingSysField.attr("href", "javascript:void(0)");
        operatingSysField.text(operatingSys);
        operatingSysField.data("OS", operatingSys);
        operatingSysField.click(function () {
            var OS = $(this).data("OS");
            console.log(OS);
            //OSQuery(OS);
        });

        operatingSysColumn.append(operatingSysField);
        row.append(operatingSysColumn);

        var deviceLastSeenColumn = $("<td></td>");
        var deviceLastSeenField = $("<a></a>");
        deviceLastSeenField.attr("href", "javascript:void(0)");
        deviceLastSeenField.text(deviceLastSeen);
        deviceLastSeenField.data("deviceLastSeen", deviceLastSeen);
        deviceLastSeenField.click(function () {
            var deviceLastSeen = $(this).data("deviceLastSeen");
            console.log(deviceLastSeen);
            //deviceLastSeenQuery(deviceLastSeen);
        });

        deviceLastSeenColumn.append(deviceLastSeenField);
        row.append(deviceLastSeenColumn);

        var behaviorIDColumn = $("<td></td>");
        var behaviorIDField = $("<a></a>");
        behaviorIDField.attr("href", "javascript:void(0)");
        behaviorIDField.text(behaviorID);
        behaviorIDField.data("behaviorID", behaviorID);
        behaviorIDField.click(function () {
            var behaviorID = $(this).data("behaviorID");
            console.log(behaviorID);
            //behaviorIDQuery(behaviorID);
        });

        behaviorIDColumn.append(behaviorIDField);
        row.append(behaviorIDColumn);

        var behaviorGroupIDColumn = $("<td></td>");
        var behaviorGroupIDField = $("<a></a>");
        behaviorGroupIDField.attr("href", "javascript:void(0)");
        behaviorGroupIDField.text(behaviorGroupID);
        behaviorGroupIDField.data("behaviorGroupID", behaviorGroupID);
        behaviorGroupIDField.click(function () {
            var behaviorGroupID = $(this).data("behaviorGroupID");
            console.log(behaviorGroupID);
            //behaviorGroupIDQuery(behaviorGroupID);
        });

        behaviorGroupIDColumn.append(behaviorGroupIDField);
        row.append(behaviorGroupIDColumn);

        var behaviorCountryColumn = $("<td></td>");
        var behaviorCountryField = $("<a></a>");
        behaviorCountryField.attr("href", "javascript:void(0)");
        behaviorCountryField.text(behaviorCountry);
        behaviorCountryField.data("behaviorCountry", behaviorCountry);
        behaviorCountryField.click(function () {
            var behaviorCountry = $(this).data("behaviorCountry");
            console.log(behaviorCountry);
            //behaviorCountryQuery(behaviorCountry);
        });

        behaviorCountryColumn.append(behaviorCountryField);
        row.append(behaviorCountryColumn);

        var behaviorCountColumn = $("<td></td>");
        var behaviorCountField = $("<a></a>");
        behaviorCountField.attr("href", "javascript:void(0)");
        behaviorCountField.text(behaviorCount);
        behaviorCountField.data("behaviorCount", behaviorCount);
        behaviorCountField.click(function () {
            var behaviorCount = $(this).data("behaviorCount");
            console.log(behaviorCount);
            //behaviorCountQuery(behaviorCount);
        });

        behaviorCountColumn.append(behaviorCountField);
        row.append(behaviorCountColumn);

        var behaviorSourceColumn = $("<td></td>");
        var behaviorSourceField = $("<a></a>");
        behaviorSourceField.attr("href", "javascript:void(0)");
        behaviorSourceField.text(behaviorSource);
        behaviorSourceField.data("behaviorSource", behaviorSource);
        behaviorSourceField.click(function () {
            var behaviorSource = $(this).data("behaviorSource");
            console.log(behaviorSource);
            //behaviorSourceQuery(behaviorSource);
        });

        behaviorSourceColumn.append(behaviorSourceField);
        row.append(behaviorSourceColumn);

        var behaviorLastSeenColumn = $("<td></td>");
        var behaviorLastSeenField = $("<a></a>");
        behaviorLastSeenField.attr("href", "javascript:void(0)");
        behaviorLastSeenField.text(behaviorLastSeen);
        behaviorLastSeenField.data("behaviorLastSeen", behaviorLastSeen);
        behaviorLastSeenField.click(function () {
            var behaviorLastSeen = $(this).data("behaviorLastSeen");
            console.log(behaviorLastSeen);
            //behaviorLastSeenQuery(behaviorLastSeen);
        });

        behaviorLastSeenColumn.append(behaviorLastSeenField);
        row.append(behaviorLastSeenColumn);


        var finalResults = '<tr><td><a href="">' + email + '</td></a><td>' + birthdate + '</td><td>' + gender + '</td><td>' + city + '</td><td>' +
            ethnicity + '</td><td>' + maritalStatus + '</td><td>' + children + '</td><td>' + region + '</td><td>' + postalCode + '</td><td>' +
            education + '</td><td>' + campaignAdvertiserID + '</td><td>' + campaignID + '</td><td>' + campaignImps + '</td><td>' +
            campaignLastSeen + '</td><td>' + deviceID + '</td><td>' + deviceType + '</td><td>' + operatingSys + '</td><td>' + deviceLastSeen + '</td><td>' +
            behaviorID + '</td><td>' + behaviorGroupID + '</td><td>' + behaviorCountry + '</td><td>' + behaviorCount + '</td><td>' +
            behaviorSource + '</td><td>' + behaviorLastSeen + '</td></tr>';
        // $('.myTable').append(finalResults);

        $('#result').append(row);
        //$('#result_box').append(stateValue);

    });


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
            } else if (field =="demo_maritalStatus") {
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


