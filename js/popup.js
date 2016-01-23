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
        var data = [];
        Merquery.SchemaManager.makeSchema(fields);
    
        if (response.result.rows) {
            $.each(response.result.rows, function (j, row) {
                var thisData = {};
    
                for (var prop in schema) {
                    if (schema.hasOwnProperty(prop)) {
                        for (var i = 0; i < fields.length; i++) {
                            if (fields[i].name == prop) {
                                thisData[fields[i].name] = row.f[i].v;
    
                            }
                        }
                    }
                }
                data.push(thisData);
            });
        }
        //Appends data to indvInfo variable
        indivInfo = '<h1 style="text-align:center;">Individual Profile</h1><br/>';
        for (var i = 0; i < data.length; i++) {
            var test = data[i];
            var line;
    
            for (var j = 0; j < fields.length; j++) {
                if (test.hasOwnProperty(fields[j].name)) {
                    var fieldName = fields[j].name;
                    line = schema[fieldName] + ": " + test[fields[j].name] + '<br/>';
                }
                indivInfo += line;
            }
            if(i < data.length-1)
                indivInfo += '<h1 style="text-align:center;">Individual Profile</h1><br/>';
    
        }
        Merquery.Popup.popUp(indivInfo);
    },
    
    
}
    