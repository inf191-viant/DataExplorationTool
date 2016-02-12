if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.Util = {};
//$Todo$ replace all console logs with this method
Merquery.Util.log = function(info) {
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



    Merquery.showLoad = function() {
    $("#divADV").show();
    }

    Merquery.hideLoad = function() {
    $("#divADV").hide();
    }
    Merquery.hideNav = function () {
    $("#page-nav").hide();
    }
    Merquery.showNav= function() {
    $("#page-nav").show();
    }

//for pagination of table
//http://www.bilalakil.me/simplepagination/comment-page-1/
Merquery.Paginator = {
    paginate: function(toPag) {
        toPag.addClass("paginate");
    },

    //Returns the total count of rows
    totalRowCount:function () {
        return rowCount;
    },

    showResultsCount: function(){
        $('#result-count').show();
    },

    hideResultsCount: function() {
        $('#result-count').hide();
    },

    // Checks whether the count of results returned from the query with the number
    // of how many profiles we want to show on a page
    checkResultCountPerPage: function() {
        var perPage = parseInt(Merquery.getLimit());
        var totalRowCount = Merquery.Paginator.totalRowCount();
        if (perPage > totalRowCount) {
            return totalRowCount;
        }
        return perPage;
    },

    startingCount: function() {
        var inititalNum = 0;
        if (Merquery.Paginator.totalRowCount() > 0){
            inititalNum = 1;
        }
        return inititalNum;
    },

    initPagination: function(){
        jQuery(function($) {
             // Grab whatever we need to paginate
             var pageParts = $(".paginate");
             // How many parts do we have?
             var numPages = pageParts.length;
             // How many parts do we want per page?
             var perPage = parseInt(Merquery.getLimit());

             // When the document loads we're on page 1
             // So to start with... hide everything else
             pageParts.slice(perPage).hide();

            var initialNum = Merquery.Paginator.startingCount();
            //Displays the number of rows on a page
            $('#result-count').empty();
            $('#result-count').append("<p>Showing: " + (parseInt(initialNum)) + "-" + Merquery.Paginator.checkResultCountPerPage() +
                " of "+Merquery.Paginator.totalRowCount() +" profiles</p>");


             // Apply simplePagination to our placeholder
            $("#page-nav").pagination({
                 items: numPages,
                 itemsOnPage: perPage,
                 cssStyle: "dark-theme",
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
                     //Displays the number of rows on a page
                     $('#result-count').empty();
                     $('#result-count').append("<p>Showing: "+ (parseInt(start)+1) + "-" + end + " of " +
                         Merquery.Paginator.totalRowCount() + " profiles</p>").show();

                 }
            });

        });
        $('#export').empty();
        $('#export').append("<button id='export-button' class='fixed-nav-bar'>Export data</button>");

    }

}

// code taken from uniondesign.ca/simple-accordion-without-jquery-ui/
    Merquery.initAccordion = function () {

        // code taken from uniondesign.ca/simple-accordion-without-jquery-ui/

            $('#accordion').find('.accordion-toggle').click(function(){

              //Expand or collapse this panel
              $(this).next().slideToggle('fast');

              //Hide the other panels
              $(".accordion-content").not($(this).next()).slideUp('fast');

            });

         };


Merquery.AuthenticationManager = {
    //Authorizes the connection to GBQ
    auth: function(onSuccess) {
        gapi.auth.authorize(config, function() {
            gapi.client.load('bigquery', 'v2', onSuccess);
        });
    }
}