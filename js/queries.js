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
        var whereString = ' where ' + formattedFieldName + ' like "' + fieldValue + '"';

        for (var i = 0; i < Merquery.databaseConstants.query.length; i++) {
           if (i == 0) {
                queryString += Merquery.databaseConstants.query[i].columnNames;
                fromString += " FROM " + Merquery.databaseConstants.query[i].fromStatement;
            }
            else {
                queryString += ", " + Merquery.databaseConstants.query[i].columnNames;
                fromString += " LEFT JOIN EACH " + Merquery.databaseConstants.query[i].fromStatement;
            }
        }
        formedQuery += "SELECT " + queryString + fromString + whereString + " GROUP each BY " + queryString + ' Limit ' + limit + ';';

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
        var whereString = ' where ' + formattedFieldName + ' like "' + fieldValue + '"';

        for (var i = 0; i < Merquery.databaseConstants.query.length; i++) {
           if (i == 0) {
                queryString += Merquery.databaseConstants.query[i].columnNames;
                fromString += " FROM " + Merquery.databaseConstants.query[i].fromStatement;
            }
            else {
                queryString += ", " + Merquery.databaseConstants.query[i].columnNames;
                fromString += " LEFT JOIN EACH " + Merquery.databaseConstants.query[i].fromStatement;
            }
        }
        formedQuery += "SELECT " + queryString + fromString + whereString + " GROUP each BY " + queryString + ' Limit 5 ;';

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


