if(typeof Merquery == "undefined" ) {
    Merquery = {};
}
Merquery.Popup  = {

    popUp: function (info) {
        $('#popup').bPopup({
            easing: 'easeOutBack',
            speed: 450,
            transition: 'slideDown'
        });
    
        $('#popup').bPopup().empty();
        $('#popup').bPopup().append(info);
    },
    
    //Renders the results in the popUp after the query is run
    renderPopUp: function (response) {
        var indivInfo ; //Stores individual info for popUp functionality
        var fields = response.result.schema.fields;
        var arrayOfUserProfiles = [];
        Merquery.SchemaManager.makeSchema(fields);

        if (response.result.rows) {
            $.each(response.result.rows, function (j, row) {
                var userProfileDictionary = {};

                for (var prop in schema) {
                    if (schema.hasOwnProperty(prop)) {
                        for (var i = 0; i < fields.length; i++) {
                            if (fields[i].name == prop) {

                                userProfileDictionary[fields[i].name] = row.f[i].v;
                            }
                        }
                    }
                }

                arrayOfUserProfiles.push(userProfileDictionary);

            });
        }
        //Appends arrayOfUserProfiles to indivInfo variable
        indivInfo = '<table><thead><h1 id="userPopup" style="text-align:center;">Individual Profile</h1></thead><tbody>';
        for (var userProfileArrayItemPosition = 0; userProfileArrayItemPosition < arrayOfUserProfiles.length; userProfileArrayItemPosition++) {
            var itemInUserProfile = arrayOfUserProfiles[userProfileArrayItemPosition];
            var newTableLine;
            for (var j = 0; j < fields.length; j++) {
                if (itemInUserProfile.hasOwnProperty(fields[j].name)) {
                    var fieldName = fields[j].name;
                    newTableLine = "<tr><td>" + schema[fieldName].displayName + "</td><td>" + itemInUserProfile[fields[j].name] + '</td></tr>';
                }
                indivInfo += newTableLine;
            }
            indivInfo += "</tbody></table>";
            if(userProfileArrayItemPosition < arrayOfUserProfiles.length-1) {
                indivInfo += '<table><thead><h1 id="userPopup" style="text-align:center;">Individual Profile</h1></thead></tbody>';
        }
        }
        Merquery.Popup.popUp(indivInfo);
    },
    
    
}
    