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
            'query': 'SELECT Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
                'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
                'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
                'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
                'Campaign.click_count, Campaign.conversion_count ' +

                'FROM (SELECT * FROM [formal-cascade-571:uci.demo_info]) AS Demographics ' +
                'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.address_info]) AS Address ON Address.emailmd5 = Demographics.emailmd5 ' +
                'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5 ' +

                'where ' + formattedFieldName + ' like "' + fieldValue +

                '" GROUP BY Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
                'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
                'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
                'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
                'Campaign.click_count, Campaign.conversion_count ' +

                'ORDER BY Demographics.emailmd5 Limit ' + limit + ';'

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

            'query': 'SELECT Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
            'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
            'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
            'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
            'Campaign.click_count, Campaign.conversion_count ' +

            'FROM (SELECT * FROM [formal-cascade-571:uci.demo_info]) AS Demographics ' +
            'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.address_info]) AS Address ON Address.emailmd5 = Demographics.emailmd5 ' +
            'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5 ' +

            'where ' + formattedFieldName + ' like "' + fieldValue +

            '" GROUP BY Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
            'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
            'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
            'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
            'Campaign.click_count, Campaign.conversion_count ' +

            'ORDER BY Demographics.emailmd5 Limit ' + "20" + ';'
        });

        request.execute(Merquery.Popup.renderPopUp);

    },

    //breadCrumbQuery takes the breadcrumbs and formulates the query with additional conditions
    //parameters: {var queryCrumbs}
    breadCrumbQuery: function(queryCrumbs) {
        Merquery.hideNav();
        Merquery.showLoad();
        $('#result').empty();
        var whereClause = Merquery.sqlWhereClause.formWhereClause(queryCrumbs);

        var request = gapi.client.bigquery.jobs.query({
            'projectId': project_id,
            'timeoutMs': '30000',
            /* v1.0 query for old database */
            //'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where ' + fieldName + ' like "' + fieldValue + '" Limit ' + selText + ';'

            /* v2.0 Full query format using new database but some searches don't come through therefore commented some out
             * feel free to play around with them and adjust as needed */
            'query': 'SELECT Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
            'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
            'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
            'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
            'Campaign.click_count, Campaign.conversion_count ' +

            'FROM (SELECT * FROM [formal-cascade-571:uci.demo_info]) AS Demographics ' +
            'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.address_info]) AS Address ON Address.emailmd5 = Demographics.emailmd5 ' +
            'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5 ' +

            whereClause +

            'GROUP BY Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
            'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
            'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
            'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
            'Campaign.click_count, Campaign.conversion_count ' +

            'ORDER BY Demographics.emailmd5 Limit ' + "20" + ';'

        });
        request.execute(Merquery.renderResults);
    },


    //Runs the query when the search button is clicked
    runQuery: function(userInputs) {
        //Merquery.Queries.createQueryArray();
        var queryString;
        var endString;
        var inputs;

       queryString='SELECT Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
                   'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
                   'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
                   'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
                   'Campaign.click_count, Campaign.conversion_count ' +
                   'FROM (SELECT * FROM [formal-cascade-571:uci.demo_info]) AS Demographics ' +
                   'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.address_info]) AS Address ON Address.emailmd5 = Demographics.emailmd5 ' +
                   'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5 ' +
                   'where ';

         for(var i=0; i<userInputs.length; i++){
            var formattedFieldName;
            if(i ==0){
                formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(userInputs[i].queryField)
                inputs =  formattedFieldName + ' like "' + userInputs[i].input + '"';
            }
            else if(i>0){
                inputs = inputs + ' AND ';
                formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(userInputs[i].queryField)
                if(userInputs[i].querytype == 'STRING')
                    inputs =  inputs + formattedFieldName + ' like "' + userInputs[i].input + '"';
                else
                    inputs =  inputs + formattedFieldName + ' = ' + userInputs[i].input;
            }
         }

          endString=' GROUP BY Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
                  'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
                  'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
                  'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
                  'Campaign.click_count, Campaign.conversion_count ' +

                  //'ORDER BY Demographics.emailmd5 Limit ' + "" +Merquery.getLimit() +"" +';'
                  'ORDER BY Demographics.emailmd5 Limit ' + "20" + ';';

                  Merquery.Util.log(queryString + inputs + endString);

        var request = gapi.client.bigquery.jobs.query({

            'projectId': project_id,
            'timeoutMs': '30000',
            /* v1.0 query for old database */
            //'query': 'SELECT * FROM [formal-cascade-571:uci.uci_db] where CRM_city like"' + stringCity + '" Limit ' + selText + ';'

            /* v2.0 Full query format using new database but some searches don't come through therefore commented some out
            * feel free to play around with them and adjust as needed */
            /*'query': 'SELECT Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity, ' +
            'Demographics.sexorient, Demographics.marital, Demographics.children, ' +
            'Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip, ' +
            'Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name, Campaign.impression_count, ' +
            'Campaign.click_count, Campaign.conversion_count ' +

            'FROM (SELECT * FROM [formal-cascade-571:uci.demo_info]) AS Demographics ' +
            'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.address_info]) AS Address ON Address.emailmd5 = Demographics.emailmd5 ' +
            'JOIN EACH (SELECT * FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5 ' +

            'where Demographics.city like "' +*/

            'query': queryString + inputs + endString

        });
        request.execute(Merquery.renderResults);
    },


};


