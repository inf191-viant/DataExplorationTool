if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.Util = {};
//$Todo$ replace all console logs with this method
Merquery.Util.log = function(info) {
    console.log(info);
}

Merquery.TableAndFieldsFormatter = {
    formatFieldName: function(fieldName) {
        var name = fieldName.split("_");
        var formatted = name[0].concat(".", name[1]);

        if (name.length > 2) {
            for (var i=2; i<name.length; i++)
            {
                formatted = formatted.concat("_", name[i]);
            }
        }
        console.log("Formatted fieldName: " + formatted);
        return formatted;
    }
};


Merquery.SchemaManager = {
    // end http://uniondesign.ca/simple-accordion-without-jquery-ui/
    //Cross checks the schema variable with the fields variable.
    //If a field does not exist, then it is added to the schema.
    //parameters: {var fields}
    makeSchema: function (fields) {

        for (var i = 0; i < fields.length; i++) {
            var fieldName = fields[i].name;
            if (!schema[fieldName]) {
                console.log("There is a field without UI name [" + fieldName + "]");
                schema[fieldName] = fieldName;
            }

        }
    }
}

//for pagination of table
//http://www.bilalakil.me/simplepagination/comment-page-1/
Merquery.Paginator = {
    paginate: function(toPag) {
        toPag.addClass("paginate");
    },
    initPagination: function(){
        jQuery(function($) {
             // Grab whatever we need to paginate
             var pageParts = $(".paginate");
             // How many parts do we have?
             var numPages = pageParts.length;
             // How many parts do we want per page?
             var perPage = 10;

             // When the document loads we're on page 1
             // So to start with... hide everything else
             pageParts.slice(perPage).hide();
             // Apply simplePagination to our placeholder

            $("#page-nav").pagination({
                 items: numPages,
                 itemsOnPage: perPage,
                 cssStyle: "light-theme",
                 // We implement the actual pagination
                 //   in this next function. It runs on
                 //   the event that a user changes page
                 onPageClick: function(pageNum) {
                     // Which page parts do we show?
                     var start = perPage * (pageNum - 1);
                     var end = start + perPage;

                     // First hide all page parts
                     // Then show those just for our page
                     pageParts.hide()
                              .slice(start, end).show();
                 }
             });
        });
    }

}


Merquery.AuthenticationManager = {
    //Authorizes the connection to GBQ
    auth: function(onSuccess) {
        gapi.auth.authorize(config, function() {
            gapi.client.load('bigquery', 'v2', onSuccess);
        });
    }
}