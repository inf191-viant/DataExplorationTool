if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.Queries = {
    //StandardQuery takes the fieldValue and fieldName and runs another query
    //parameters: {var fieldValue, var fieldName}
    standardQuery: function(fieldValue, fieldName, limit, callback) {
        var formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(fieldName);

        var request = gapi.client.bigquery.jobs.query({
            'projectId': project_id,
            'timeoutMs': '30000',
            /* v1.0 query for old database */
            //'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where ' + fieldName + ' like "' + fieldValue + '" Limit ' + selText + ';'

            /* v2.0 Full query format using new database but some searches don't come through therefore commented some out
             * feel free to play around with them and adjust as needed */
              'query': 'SELECT * FROM [formal-cascade-571:uci.demo_info] AS Demographics ' +
                                    'JOIN EACH [formal-cascade-571:uci.address_info] AS Address ON Demographics.emailmd5 = Address.Emailmd5 ' +
                                    'JOIN EACH [formal-cascade-571:uci.campaign_info] AS Campaign ON Address.emailmd5 = Campaign.emailmd5 ' +
                //'JOIN EACH [formal-cascade-571:uci.device_info] AS dev ON demo.emailmd5 = dev.emailmd5 ' +
                //'JOIN EACH [formal-cascade-571:uci.behavior_info] AS beh ON demo.emailmd5 = beh.emailmd5 ' +
                //'JOIN EACH [formal-cascade-571:uci.purchase_info] AS purch ON demo.emailmd5 = purch.emailmd5 ' +
            'where ' + formattedFieldName + ' like "' + fieldValue + '" Limit ' + limit + ';'
        });
        request.execute(callback || Merquery.renderResults);
    },

    //PopUpQuery takes the fieldValue and fieldName and runs another query
    //parameters: {var fieldValue, var fieldName}
    popupQuery: function(fieldValue, fieldName) {
        var formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(fieldName);

        var request = gapi.client.bigquery.jobs.query({
            'projectId': project_id,
            'timeoutMs': '30000',
            /* v1.0 query for old database */
            //'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where ' + fieldName + ' like "' + fieldValue + '" Limit ' + selText + ';'

            /* v2.0 Full query format using new database but some searches don't come through therefore commented some out
             * feel free to play around with them and adjust as needed */
           'query': 'SELECT * FROM [formal-cascade-571:uci.demo_info] AS Demographics ' +
                                 'JOIN EACH [formal-cascade-571:uci.address_info] AS Address ON Demographics.emailmd5 = Address.Emailmd5 ' +
                                 'JOIN EACH [formal-cascade-571:uci.campaign_info] AS Campaign ON Address.emailmd5 = Campaign.emailmd5 ' +
                //'JOIN EACH [formal-cascade-571:uci.device_info] AS dev ON demo.emailmd5 = dev.emailmd5 ' +
                //'JOIN EACH [formal-cascade-571:uci.behavior_info] AS beh ON demo.emailmd5 = beh.emailmd5 ' +
                //'JOIN EACH [formal-cascade-571:uci.purchase_info] AS purch ON demo.emailmd5 = purch.emailmd5 ' +
            'where ' + formattedFieldName + ' like "' + fieldValue + '" Limit ' + "20" + ';'
        });

        request.execute(Merquery.Popup.renderPopUp);

    },

    //Runs the query when the search button is clicked
    runQuery: function() {
        //Merquery.Queries.createQueryArray();
        var request = gapi.client.bigquery.jobs.query({

            'projectId': project_id,
            'timeoutMs': '30000',
            /* v1.0 query for old database */
            //'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where CRM_city like"' + stringCity + '" Limit ' + selText + ';'

            /* v2.0 Full query format using new database but some searches don't come through therefore commented some out
            * feel free to play around with them and adjust as needed */
             'query': 'SELECT * FROM [formal-cascade-571:uci.demo_info] AS Demographics ' +
                       'JOIN EACH [formal-cascade-571:uci.address_info] AS Address ON Demographics.emailmd5 = Address.Emailmd5 ' +
                       'JOIN EACH [formal-cascade-571:uci.campaign_info] AS Campaign ON Address.emailmd5 = Campaign.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.device_info] AS dev ON demo.emailmd5 = dev.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.behavior_info] AS beh ON demo.emailmd5 = beh.emailmd5 ' +
            //'JOIN EACH [formal-cascade-571:uci.purchase_info] AS purch ON demo.emailmd5 = purch.emailmd5 ' +
            'where Demographics.city like "' + $("#City").val() + '" Limit ' + "20" + ';'
        });
        request.execute(Merquery.renderResults);
    },

    createQueryArray : function () {

            var myInputs = $("input[data-group='input']");
            var queryObject = {};
            var queriesArray = [];


            for (var i = 0; i < myInputs.length; i++) {
                var textBox = $(myInputs[i]);
                var field = $(textBox).data("field"); //name, age,
                if (textBox.val()) {
                    if (field == "email") {
                        queryObject.email = textBox.val();
                    } else if (field == "Demographics_city") {
                        queryObject.city = textBox.val();
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
            Merquery.Util.log(queryObject);
            queriesArray.push(queryObject);
            return queriesArray;
        }


};


