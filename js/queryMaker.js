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
        var queryPieces = Merquery.databaseConstants.query;
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
                whereString +=  'lower(' + formattedFieldName + ') ' + ' like "%' + (userInputs[i].input).toLowerCase() + '%"';
            }
            else if(i>0){
                whereString += ' AND ';
                formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(userInputs[i].queryField)
                if(userInputs[i].querytype == 'STRING')
                    whereString += 'lower(' + formattedFieldName + ') ' + ' like "%' + (userInputs[i].input).toLowerCase() + '%"';
                else
                    whereString += formattedFieldName + ' = ' + (userInputs[i].input).toLowerCase();
            }
        }

        formedQuery += "SELECT " + queryString + fromString + whereString + " GROUP each BY " + queryString + ' Limit ' + "20" + ';';
        return formedQuery;
    }
};

