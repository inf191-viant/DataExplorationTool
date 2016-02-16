if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.Queries = {
    //StandardQuery takes the fieldValue and fieldName and runs another query
    //parameters: {var fieldValue, var fieldName}
    standardQuery: function(fieldValue, fieldName, limit, callback) {
        var formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(fieldName);

        var queryString;
        var endString;

        queryString =  "SELECT Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity," +
            " Demographics.sexorient,Demographics.marital, Demographics.children, Address.Address1, Address.Address2, Address.City," +
            " Address.State, Address.Zip, Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name," +
            " Campaign.impression_count, Campaign.click_count, Campaign.conversion_count, Behavior.id, Behavior.name, Behavior.last_seen," +
            " Behavior.count, Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, Device.operating_system," +
            " Device.last_seen, Purchase.advertiser_id, Purchase.last_sales_amount, Purchase.last_purchase_date, Purchase.ltv_online," +
            " Purchase.ltv_offline " +


            "FROM (SELECT emailmd5, birthdate,gender, city, ethnicity, sexorient, marital, children FROM [formal-cascade-571:uci.demo_info] " +
            "where emailmd5 is not null ) AS Demographics " +

            "LEFT JOIN EACH (SELECT emailmd5, Address1, Address2, City, State, Zip FROM [formal-cascade-571:uci.address_info]) "+
            "AS Address ON Address.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, advertiser_id, advertiser_name, campaign_id, campaign_name, impression_count, " +
            "click_count, conversion_count FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, id, name, last_seen, count FROM [formal-cascade-571:uci.behavior_info]) " +
            "AS Behavior ON Behavior.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, device_id, device_name, device_type_id, device_type_name, operating_system, " +
            "last_seen FROM [formal-cascade-571:uci.device_info]) AS Device ON Device.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, advertiser_id, last_sales_amount, last_purchase_date, ltv_online, " +
            "ltv_offline FROM [formal-cascade-571:uci.purchase_info]) AS Purchase ON Purchase.emailmd5 = Demographics.emailmd5 " +

        'where ' + formattedFieldName + ' like "' + fieldValue;

        endString = '" GROUP each BY Demographics.emailmd5, Demographics.birthdate, Demographics.gender, ' +
            "Demographics.city, Demographics.ethnicity, Demographics.sexorient, Demographics.marital, " +
            "Demographics.children, Address.Address1, Address.Address2, Address.City, Address.State, " +
            "Address.Zip, Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, "+
            "Campaign.campaign_name, Campaign.impression_count,Campaign.click_count, Campaign.conversion_count, " +
            "Behavior.id, Behavior.name, Behavior.last_seen, Behavior.count, " +
            "Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, " +
            "Device.operating_system, Device.last_seen, " +
            " Purchase.advertiser_id, Purchase.last_sales_amount, Purchase.last_purchase_date, Purchase.ltv_online, Purchase.ltv_offline " +
            'ORDER BY Demographics.emailmd5 Limit ' + limit + ';';


        var request = gapi.client.bigquery.jobs.query({
            'projectId': project_id,
            'timeoutMs': '30000',
            'query': queryString + endString

        });
        request.execute(callback || Merquery.renderResults);
    },

    //PopUpQuery takes the fieldValue and fieldName and runs another query
    //parameters: {var fieldValue, var fieldName}
    popupQuery: function(fieldValue, fieldName) {
        var formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(fieldName);

        var queryString;
        var endString;

        queryString =  "SELECT Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity," +
            " Demographics.sexorient,Demographics.marital, Demographics.children, Address.Address1, Address.Address2, Address.City," +
            " Address.State, Address.Zip, Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name," +
            " Campaign.impression_count, Campaign.click_count, Campaign.conversion_count, Behavior.id, Behavior.name, Behavior.last_seen," +
            " Behavior.count, Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, Device.operating_system," +
            " Device.last_seen, Purchase.advertiser_id, Purchase.last_sales_amount, Purchase.last_purchase_date, Purchase.ltv_online," +
            " Purchase.ltv_offline " +


            "FROM (SELECT emailmd5, birthdate,gender, city, ethnicity, sexorient, marital, children FROM [formal-cascade-571:uci.demo_info] " +
            "where emailmd5 is not null ) AS Demographics " +

            "LEFT JOIN EACH (SELECT emailmd5, Address1, Address2, City, State, Zip FROM [formal-cascade-571:uci.address_info]) "+
            "AS Address ON Address.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, advertiser_id, advertiser_name, campaign_id, campaign_name, impression_count, " +
            "click_count, conversion_count FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, id, name, last_seen, count FROM [formal-cascade-571:uci.behavior_info]) " +
            "AS Behavior ON Behavior.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, device_id, device_name, device_type_id, device_type_name, operating_system, " +
            "last_seen FROM [formal-cascade-571:uci.device_info]) AS Device ON Device.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, advertiser_id, last_sales_amount, last_purchase_date, ltv_online, " +
            "ltv_offline FROM [formal-cascade-571:uci.purchase_info]) AS Purchase ON Purchase.emailmd5 = Demographics.emailmd5 " +

            'where ' + formattedFieldName + ' like "' + fieldValue;

        endString = '" GROUP each BY Demographics.emailmd5, Demographics.birthdate, Demographics.gender, ' +
            "Demographics.city, Demographics.ethnicity, Demographics.sexorient, Demographics.marital, " +
            "Demographics.children, Address.Address1, Address.Address2, Address.City, Address.State, " +
            "Address.Zip, Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, "+
            "Campaign.campaign_name, Campaign.impression_count,Campaign.click_count, Campaign.conversion_count, " +
            "Behavior.id, Behavior.name, Behavior.last_seen, Behavior.count, " +
            "Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, " +
            "Device.operating_system, Device.last_seen, " +
            " Purchase.advertiser_id, Purchase.last_sales_amount, Purchase.last_purchase_date, Purchase.ltv_online, Purchase.ltv_offline " +
            'ORDER BY Demographics.emailmd5 Limit ' + '20' + ';';

        var request = gapi.client.bigquery.jobs.query({
            'projectId': project_id,
            'timeoutMs': '30000',
            'query': queryString + endString
        });

        request.execute(Merquery.Popup.renderPopUp);

    },


    //Runs the query when the search button is clicked
    runQuery: function(userInputs) {
        //Merquery.Queries.createQueryArray();

        // For loading indicator
        Merquery.hideNav();
        Merquery.showLoad();
        Merquery.Paginator.hideResultsCount();
        $('#export').empty();
        $('#result').empty();

        var queryString;
        var endString;
        var inputs;

        queryString =  "SELECT Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, Demographics.ethnicity," +
            " Demographics.sexorient,Demographics.marital, Demographics.children, Address.Address1, Address.Address2, Address.City," +
            " Address.State, Address.Zip, Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name," +
            " Campaign.impression_count, Campaign.click_count, Campaign.conversion_count, Behavior.id, Behavior.name, Behavior.last_seen," +
            " Behavior.count, Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, Device.operating_system," +
            " Device.last_seen, Purchase.advertiser_id, Purchase.last_sales_amount, Purchase.last_purchase_date, Purchase.ltv_online," +
            " Purchase.ltv_offline " +


            "FROM (SELECT emailmd5, birthdate,gender, city, ethnicity, sexorient, marital, children FROM [formal-cascade-571:uci.demo_info] " +
            "where emailmd5 is not null ) AS Demographics " +

            "LEFT JOIN EACH (SELECT emailmd5, Address1, Address2, City, State, Zip FROM [formal-cascade-571:uci.address_info]) "+
            "AS Address ON Address.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, advertiser_id, advertiser_name, campaign_id, campaign_name, impression_count, " +
            "click_count, conversion_count FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, id, name, last_seen, count FROM [formal-cascade-571:uci.behavior_info]) " +
            "AS Behavior ON Behavior.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, device_id, device_name, device_type_id, device_type_name, operating_system, " +
            "last_seen FROM [formal-cascade-571:uci.device_info]) AS Device ON Device.emailmd5 = Demographics.emailmd5 " +

            "LEFT JOIN EACH (SELECT emailmd5, advertiser_id, last_sales_amount, last_purchase_date, ltv_online, " +
            "ltv_offline FROM [formal-cascade-571:uci.purchase_info]) AS Purchase ON Purchase.emailmd5 = Demographics.emailmd5 " +

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

        endString = " GROUP each BY Demographics.emailmd5, Demographics.birthdate, Demographics.gender, " +
            "Demographics.city, Demographics.ethnicity, Demographics.sexorient, Demographics.marital, " +
            "Demographics.children, Address.Address1, Address.Address2, Address.City, Address.State, " +
            "Address.Zip, Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, "+
            "Campaign.campaign_name, Campaign.impression_count,Campaign.click_count, Campaign.conversion_count, " +
            "Behavior.id, Behavior.name, Behavior.last_seen, Behavior.count, " +
            "Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, " +
            "Device.operating_system, Device.last_seen, " +
            " Purchase.advertiser_id, Purchase.last_sales_amount, Purchase.last_purchase_date, Purchase.ltv_online, Purchase.ltv_offline " +
            'Limit ' + "20" + ';';


                  Merquery.Util.log(queryString + inputs + endString);

        var request = gapi.client.bigquery.jobs.query({

            'projectId': project_id,
            'timeoutMs': '30000',
            'query': queryString + inputs + endString

        });
        request.execute(Merquery.renderResults);
    },


};


