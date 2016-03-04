if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.Util = {};
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
                //console.log("There is a field without UI name [" + fieldName + "]");
                schema[fieldName] = fieldName;
            }

        }
    }
}



    Merquery.showLoad = function() {
    $("#divADV").show();
    Merquery.ClearHeader();
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
       gapi.auth.authorize(Merquery.config, function() {
            gapi.client.load('bigquery', 'v2', onSuccess);
        });
    }
}

//If enter is pressed in a text box then the search functionality will be activated
Merquery.handle = function(event){
    if(event.which == 13 || event.keyCode == 13){
        Merquery.search();
    }
    return false;
}

//Reset button functionality
Merquery.reset = function (){
    var userInputs= {};

    //Clears all the input fields except the checkbox fields
    var inputFields = document.getElementsByTagName("input");
    var input = inputFields.length;
    for (var i = 0; i < input; ++i){
        if(inputFields[i].type !="checkbox"){
            inputFields[i].value="";
        }else{
            inputFields[i].checked = true;
        }
    }

    //Clears all the dropdown fields
    var dropDownFields = document.getElementsByTagName("select");
    var dropdown = dropDownFields.length;
    for (var i = 0; i < dropdown; ++i){
      dropDownFields[i].value="u";
    }

    //Clear the table of results
    Merquery.ClearHeader();
    Merquery.ClearMessage();
    Merquery.Paginator.hideResultsCount();
    Merquery.hideNav();
    $('#result').empty();
    $('#breadcrumbs').empty();
    $('#export').empty();
    $("#export-button").prop('disabled', true);

}

//Search button functionality
Merquery.search = function (){
    window.scrollTo(0,0);
    Merquery.showLoad();
    Merquery.hideNav();
    Merquery.ClearMessage();
    $("#result").empty();
    Merquery.BreadCrumbs.clearBreadcrumbs();
    $('#breadcrumbs').empty();

    // Capture the checked boxes to know which tables to display
    Merquery.checkboxes.getSelectedCheckboxes();

    //Capture user inputs
    var userValues = {};
    var genderValues = {};
    var userInputs= Merquery.BreadCrumbs.crumbs;
    var x = document.getElementById("genderSelect").value;

    //If Gender is not specified ("u")
    if(x != 'u'){
        genderValues  = {
             queryField: "Demographics_gender",
             input: x,
             querytype: "STRING"
             };
        userInputs.push(genderValues);
    }
    $('input').each(function () {
        if ($(this).val().length !=0 && $(this).attr('type') != "checkbox") {
            if($(this).attr('queryField') == "Demographics_birthdate"){
                userValues = {
                    queryField: $(this).attr('queryfield'),
                    input: $(this).val().toLowerCase(),
                    querytype: $(this).attr('type'),
                    minOrMax: $(this).attr('minOrMax')
                };
            }
            else {
                userValues = {
                    queryField: $(this).attr('queryfield'),
                    input: $(this).val().toLowerCase(),
                    querytype: $(this).attr('type')
                };
            }
            userInputs.push(userValues);
        }
    });

    console.log(userInputs);
    Merquery.Queries.runQuery(userInputs);
}

Merquery.ClearHeader = function() {
    $('#header').empty();
    $('#header').removeAttr();
    $('#header').removeClass();
}
Merquery.AddHeader = function() {
    Merquery.ClearHeader();
    $('#header').append("Results");
    $('#header').addClass("page-header");

}

Merquery.ClearMessage = function() {
    $("#message").empty();
    $("#message").removeClass();
}




//Display message when a query has no results or fails
Merquery.ShowMessage = function (response, userInputs){
   if(response != null){
        if(response.code == "400"){
            Merquery.ClearHeader();
            Merquery.ClearMessage();
            Merquery.hideLoad(); 
            $("#message").addClass("glyphicon glyphicon-exclamation-sign"); 
            $("#message").addClass("alert alert-danger"); 
            if(response.message == "Field 'undefined' not found on either side of the JOIN"
            || response.message.substr(0,11) == "Encountered"){ 
               $("#message").append(" All search fields are blank. Please enter a search value and try again."); 
            }else if(response.message.indexOf("Argument type mismatch") >=0){ 
               var columnName = response.message.split("'");
               $("#message").append("You entered '");
               $("#message").append(userInputs[0].input);
               if(columnName[2].indexOf(" is type int64") >=0){
                    $("#message").append("'. Please enter an Integer such as '5' for the field ");
               }
               if(columnName[2].indexOf(" is type string") >=0){
                    $("#message").append("'. Please enter a String such as 'test' for the field ");
               }
               if(columnName[2].indexOf(" is type double") >=0){
                   $("#message").append("'. Please enter a Double such as '5.0' for the field ");
               }
               var format = columnName[1].split(".");
               var formattedName = format[1].split("_");
               var errorFieldName;
               if(formattedName.length >0){
                    errorFieldName = formattedName[0].substr(0,1).toUpperCase() + formattedName[0].substr(1).toLowerCase();
                    for(var i=1; i < formattedName.length; i++){
                         errorFieldName = errorFieldName.concat(" ", formattedName[i].substr(0,1).toUpperCase()+formattedName[i].substr(1).toLowerCase());
                    }
               }else{
                    errorFieldName = formattedName[0].substr(0,1).toUpperCase() + formattedName[0].substr(1).toLowerCase();
               }
               $("#message").append(errorFieldName);
               //$("#message").append(". Please try again."); 
               $("#message").append(".");
            }else if(response.message.indexOf("Field") >=0){ 
                var columnName = response.message.split("'");
                if(columnName[2].indexOf(" not found on either side of the JOIN") >=0){
                    $("#message").append("'"+columnName[1] + "'" + " is an invalid entry. Please try again.");
                }else{
                    $("#message").append(response.message); 
                }

            }

           }
         if(response.result.jobComplete && response.result.totalRows > 0){
            Merquery.ClearMessage();
            Merquery.ClearHeader();
            Merquery.AddHeader();

         }
         if(response.result.jobComplete && response.result.totalRows ==0){
             Merquery.ClearHeader();
             Merquery.ClearMessage();
             Merquery.AddHeader();
             Merquery.hideLoad();
             $("#message").addClass("glyphicon glyphicon-ok");
             $("#message").addClass("alert alert-success");
             $("#message").append("No Results");

          }
      }

      if(userInputs.length ==0){
          $("#message").addClass("glyphicon glyphicon-exclamation-sign"); 
          $("#message").addClass("alert alert-danger"); 
          $("#message").append(" All search fields are blank. Please enter a search value and try again."); 
       }

}



//Exports the data in the table to an xls file
Merquery.Export = function (){
    if(result.firstChild != null){
            $('#exportedTable').removeAttr('style');
            var encodedUri = encodeURIComponent(exportedTable.innerText);
            var uri = 'data:application/vnd.ms-excel,';
            var link = document.createElement("a");
            link.setAttribute("href", uri + encodedUri);
            link.setAttribute("download", "MerQueryData.xls");
            link.click();
            $('#exportedTable').attr('style', 'display: none;');
        }
}