if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.queryMaker = {


    // queryPieces are the pieces of information used to form the query based on the selection of checkboxes
    queryPieces: [
        {
            category: "Demographics",
            columnNames: "Demographics.firstname, Demographics.lastname, Demographics.emailmd5, Demographics.birthdate, Demographics.gender, Demographics.city, " +
            "Demographics.ethnicity, Demographics.sexorient, Demographics.marital, Demographics.children",
            fromStatement: "(SELECT firstname, lastname, emailmd5, birthdate,gender, city, ethnicity, sexorient, marital, children " +
            "FROM [formal-cascade-571:uci.demo_info] where emailmd5 is not null ) AS Demographics"
        },
        {
            category: "Address",
            columnNames: "Address.Address1, Address.Address2, Address.City, Address.State, Address.Zip",
            fromStatement: "(SELECT emailmd5, Address1, Address2, City, State, Zip FROM [formal-cascade-571:uci.address_info]) " +
            "AS Address ON Address.emailmd5 = Demographics.emailmd5"
        },
        {
            category: "Campaign",
            columnNames: "Campaign.advertiser_id, Campaign.advertiser_name, Campaign.campaign_id, Campaign.campaign_name," +
            " Campaign.impression_count, Campaign.click_count, Campaign.conversion_count",
            fromStatement: "(SELECT emailmd5, advertiser_id, advertiser_name, campaign_id, campaign_name, impression_count, " +
            "click_count, conversion_count FROM [formal-cascade-571:uci.campaign_info]) AS Campaign ON Campaign.emailmd5 = Demographics.emailmd5"
        },
        {
            category: "Behavior",
            columnNames: "Behavior.id, Behavior.name, Behavior.last_seen, Behavior.count",
            fromStatement: "(SELECT emailmd5, id, name, last_seen, count FROM [formal-cascade-571:uci.behavior_info]) " +
            "AS Behavior ON Behavior.emailmd5 = Demographics.emailmd5"
        },
        {
            category: "Device",
            columnNames: "Device.device_id, Device.device_name, Device.device_type_id, Device.device_type_name, " +
            "Device.operating_system, Device.last_seen",
            fromStatement: "(SELECT emailmd5, device_id, device_name, device_type_id, device_type_name, operating_system, " +
            "last_seen FROM [formal-cascade-571:uci.device_info]) AS Device ON Device.emailmd5 = Demographics.emailmd5"
        },
        {
            category: "Purchase",
            columnNames: "Purchase.advertiser_id, Purchase.last_sales_amount, Purchase.last_purchase_date, " +
            "Purchase.ltv_online, Purchase.ltv_offline",
            fromStatement: "(SELECT emailmd5, advertiser_id, last_sales_amount, last_purchase_date, ltv_online, " +
            "ltv_offline FROM [formal-cascade-571:uci.purchase_info]) AS Purchase ON Purchase.emailmd5 = Demographics.emailmd5"
        }
    ],

    // formQuery: Uses the queryPieces object to form the queries based on the breadcrumbs and selected checkboxes
    formQuery: function() {
        var checkedBoxes = Merquery.checkboxes.checkedBoxes;
        var formedQuery = "";
        var queryString = "";
        var fromString = "";
        var whereString = "";
        var endString = "";
        var queryPieces = Merquery.queryMaker.queryPieces;
        var userInputs= Merquery.BreadCrumbs.crumbs;
        for (var i=0; i<checkedBoxes.length; i++) {
            for (var j = i; j < queryPieces.length; j++) {
                var categoryNotInFromString = fromString.indexOf(queryPieces[j].category) == -1;
                var categoryNotSelected = checkedBoxes.indexOf(queryPieces[j].category) == -1;
                if (i == 0) {
                    if (j!=0 && queryPieces[j].category == checkedBoxes[i] && categoryNotInFromString) {
                        queryString += "Demographics.emailmd5, " + queryPieces[j].columnNames;
                        fromString += " LEFT JOIN EACH " + queryPieces[j].fromStatement;
                    }
                    else if (j==0 && queryPieces[j].category == checkedBoxes[i] && categoryNotInFromString) {
                        queryString += queryPieces[j].columnNames;
                        fromString += " FROM " + queryPieces[j].fromStatement;
                    }
                    else if (j==0 && categoryNotInFromString) {
                        fromString += " FROM " + queryPieces[j].fromStatement;
                    }
                    else if ((queryPieces[j].category != checkedBoxes[i]) && categoryNotInFromString && categoryNotSelected) {
                        fromString += " LEFT JOIN EACH " + queryPieces[j].fromStatement;
                    }
                }
                else {
                    if ((queryPieces[j].category == checkedBoxes[i]) && categoryNotInFromString) {
                        queryString += ", " + queryPieces[j].columnNames;
                        fromString += " LEFT JOIN EACH " + queryPieces[j].fromStatement;
                    }
                    else if ((queryPieces[j].category != checkedBoxes[i]) && categoryNotInFromString && categoryNotSelected) {
                        console.log("elseIF2: " + queryPieces[j].category + " " + checkedBoxes[i]);
                        fromString += " LEFT JOIN EACH " + queryPieces[j].fromStatement;
                    }

                }
            }
        }

        whereString += ' WHERE ';


        for(var i=0; i<userInputs.length; i++){
            var formattedFieldName;
            if(i ==0){
                formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(userInputs[i].queryField);
                whereString +=  'lower(' + formattedFieldName + ') ' + ' like "%' + userInputs[i].input + '%"';
            }
            else if(i>0){
                whereString += ' AND ';
                formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(userInputs[i].queryField)
                if(userInputs[i].querytype == 'STRING')
                    whereString += 'lower(' + formattedFieldName + ') ' + ' like "%' + userInputs[i].input + '%"';
                else
                    whereString += formattedFieldName + ' = ' + userInputs[i].input;
            }
        }

        formedQuery += "SELECT " + queryString + fromString + whereString + " GROUP each BY " + queryString + ' Limit ' + "20" + ';';
        return formedQuery;
    }
};

