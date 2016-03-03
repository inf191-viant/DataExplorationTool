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
            var minValue;
            var maxValue;

            // hashes the email
            if (userInputs[i].queryField == "Demographics_emailmd5"){
                input = hex_md5(userInputs[i].input).toLowerCase()
            }
            // forms the range for birthdate
            else if(userInputs[i].queryField == "Demographics_birthdate") {
                if (userInputs[i].minOrMax == "min") {
                    minValue = Merquery.birthdateCalculator.ageToBirthdate(userInputs[i].input); }
                if (userInputs[i].minOrMax == "max") {
                    maxValue = Merquery.birthdateCalculator.ageToBirthdate(parseInt(userInputs[i].input) +1);}
                if (userInputs[i].minOrMax == "equalTo") {
                    input = Merquery.birthdateCalculator.ageToBirthdate(userInputs[i].input); }
            }
            else{
                if(userInputs[i].querytype == 'STRING')
                    input = (userInputs[i].input).toLowerCase();
                else
                    input = userInputs[i].input;
            }

            // forms the where clause in the sql statement

            if (userInputs[i].queryField == "Demographics_birthdate"){
                formattedFieldName = Merquery.TableAndFieldsFormatter.formatFieldName(userInputs[i].queryField);
                if (i==0) {
                    if (userInputs[i].minOrMax == "min") {
                        whereString += formattedFieldName + " <= " + minValue;}
                    if (userInputs[i].minOrMax == "max") {
                        whereString += formattedFieldName + " >= " + maxValue;}
                    if (userInputs[i].minOrMax == "equalTo") {
                        whereString += formattedFieldName + " = " + input;}
                } else {
                    if (userInputs[i].minOrMax == "min") {
                        whereString += ' AND ' + formattedFieldName + " <= " + minValue;}
                    if (userInputs[i].minOrMax == "max") {
                        whereString += ' AND ' + formattedFieldName + " >= " + maxValue;}
                    if (userInputs[i].minOrMax == "equalTo") {
                        whereString += ' AND ' + formattedFieldName + " = " + input;}
                }
            }
            else if(i ==0){
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
        console.log(formedQuery);
        return formedQuery;
    }
};

