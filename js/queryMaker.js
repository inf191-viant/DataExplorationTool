if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.queryMaker = {

    // formQuery: Uses the queryPieces object to form the queries based on the breadcrumbs and selected checkboxes
    formQuery: function() {
        var checkedBoxes = Merquery.checkboxes.checkedBoxes;
        var formedQuery = "";
        var queryString = "";
        var fromString = "";
        var whereString = "";
        var endString = "";
        var groupByString = "";
        var queryPieces = Merquery.databaseConstants.query;
        var userInputs= Merquery.BreadCrumbs.crumbs;
        for (var i=0; i<checkedBoxes.length; i++) {
            for (var j = i; j < queryPieces.length; j++) {
                var categoryNotInFromString = fromString.indexOf(queryPieces[j].category) == -1;
                var categoryNotSelected = checkedBoxes.indexOf(queryPieces[j].category) == -1;
                if (i == 0) {
                    if (j!=0 && queryPieces[j].category == checkedBoxes[i] && categoryNotInFromString) {
                        queryString += "Demographics.firstname, Demographics.lastname, " + queryPieces[j].columnNames;
                        fromString += " LEFT JOIN EACH " + queryPieces[j].fromStatement;
                        groupByString += "Demographics.emailmd5, " + queryPieces[j].groupByStatement;
                    }
                    else if (j==0 && queryPieces[j].category == checkedBoxes[i] && categoryNotInFromString) {
                        queryString += queryPieces[j].columnNames;
                        fromString += " FROM " + queryPieces[j].fromStatement;
                        groupByString += queryPieces[j].groupByStatement;
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
                        groupByString += ", " +queryPieces[j].groupByStatement;
                    }
                    else if ((queryPieces[j].category != checkedBoxes[i]) && categoryNotInFromString && categoryNotSelected) {
                        Merquery.Util.log("elseIF2: " + queryPieces[j].category + " " + checkedBoxes[i]);
                        fromString += " LEFT JOIN EACH " + queryPieces[j].fromStatement;
                    }

                }
            }
        }

        whereString += ' WHERE ';


        for(var i=0; i<userInputs.length; i++){
            var formattedFieldName;
            var input;

            // hashes the email
            if (userInputs[i].queryField == "Demographics_emailmd5"){
                input = hex_md5(userInputs[i].input).toLowerCase()
            }
            else{
                if(userInputs[i].querytype == 'STRING')
                    input = (userInputs[i].input).toLowerCase();
                else
                    input = userInputs[i].input;
            }

            // forms the where clause in the sql statement

            if(i ==0){
                formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(userInputs[i].queryField);
                if(userInputs[i].querytype == 'STRING')
                   whereString +=  'lower(' + formattedFieldName + ') ' + ' like "%' + input + '%"';
                else
                    whereString +=  formattedFieldName + ' = ' + input ;
            }
            else if(i>0){
                whereString += ' AND ';
                formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(userInputs[i].queryField)
                if(userInputs[i].querytype == 'STRING')
                    whereString += 'lower(' + formattedFieldName + ') ' + ' like "%' + input + '%"';
                else
                    whereString += formattedFieldName + ' = ' + input;
            }
        }

        formedQuery += "SELECT " + queryString + fromString + whereString + " GROUP each BY " + groupByString + ' Limit ' + "10" + ';';
        return formedQuery;
    }
};

