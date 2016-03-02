if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.Queries = {
    //StandardQuery takes the fieldValue and fieldName and runs another query
    //parameters: {var fieldValue, var fieldName}
    standardQuery: function(fieldValue, fieldName, limit, callback) {
        var formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(fieldName);
        var formedQuery = "";
        var queryString = "";
        var fromString = "";
        var groupByString = "";
        var whereString = ' where ' + formattedFieldName + ' like "' + fieldValue + '"';

        for (var i = 0; i < Merquery.databaseConstants.query.length; i++) {
           if (i == 0) {
                queryString += Merquery.databaseConstants.query[i].columnNames;
                fromString += " FROM " + Merquery.databaseConstants.query[i].fromStatement;
                groupByString += Merquery.databaseConstants.query[i].groupByStatement;
            }
            else {
                queryString += ", " + Merquery.databaseConstants.query[i].columnNames;
                fromString += " LEFT JOIN EACH " + Merquery.databaseConstants.query[i].fromStatement;
                groupByString += ", " +Merquery.databaseConstants.query[i].groupByStatement;
            }
        }
        formedQuery += "SELECT " + queryString + fromString + whereString + " GROUP each BY " + groupByString + ' Limit ' + limit + ';';
        var request = gapi.client.bigquery.jobs.query({
            'projectId': Merquery.Constants.project_id,
            'timeoutMs': '30000',
            'query': formedQuery

        });
        request.execute(callback || Merquery.renderResults);
    },

    //PopUpQuery takes the fieldValue and fieldName and runs another query
    //parameters: {var fieldValue, var fieldName}
    popupQuery: function(fieldValue, fieldName) {
        var formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(fieldName);
        var formedQuery = "";
        var queryString = "";
        var fromString = "";
        var groupByString = "";
        var whereString = ' where ';

        if(formattedFieldName == 'Device.device_id')
           whereString +=  formattedFieldName + ' = ' + fieldValue ;
        else
            whereString +=  'lower(' + formattedFieldName + ') ' + ' like "%' + fieldValue + '%"';

        for (var i = 0; i < Merquery.databaseConstants.query.length; i++) {
           if (i == 0) {
                queryString += Merquery.databaseConstants.query[i].columnNames;
                fromString += " FROM " + Merquery.databaseConstants.query[i].fromStatement;
                groupByString += Merquery.databaseConstants.query[i].groupByStatement;
            }
            else {
                queryString += ", " + Merquery.databaseConstants.query[i].columnNames;
                fromString += " LEFT JOIN EACH " + Merquery.databaseConstants.query[i].fromStatement;
                groupByString += ", " + Merquery.databaseConstants.query[i].groupByStatement;
            }
        }
        formedQuery += "SELECT " + queryString + fromString + whereString + " GROUP each BY " + groupByString + ' Limit 5 ;';
        //console.log(formedQuery);
        var request = gapi.client.bigquery.jobs.query({
            'projectId': Merquery.Constants.project_id,
            'timeoutMs': '30000',
            'query': formedQuery
        });

        request.execute(Merquery.Popup.renderPopUp);

    },

    //Runs the query when the search button is clicked
    runQuery: function(userInputs) {

        // For loading indicator
        Merquery.hideNav();
        Merquery.showLoad();
        Merquery.Paginator.hideResultsCount();
        Merquery.BreadCrumbs.hideBreadcrumbs();
        $('#export').empty();
        $('#result').empty();
        $("#export-button").prop('disabled', true);

        if (Merquery.BreadCrumbs.crumbs.length ==0){
            Merquery.ClearHeader();
            Merquery.ClearMessage();
            Merquery.hideLoad();
        } else {
            var request = gapi.client.bigquery.jobs.query({

                'projectId': Merquery.Constants.project_id,
                'timeoutMs': '30000',
                'query': Merquery.queryMaker.formQuery()

            });
            request.execute(Merquery.renderResults);
        }

        if(userInputs.length ==0){
           Merquery.ShowMessage(null, userInputs);
        }
    }


};


