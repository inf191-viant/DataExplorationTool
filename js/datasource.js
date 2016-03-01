(function(){

    if(typeof Merquery == "undefined" ) {
        Merquery = {};
    }


    Merquery.renderResults = function (response) {
        Merquery.showLoad();
        Merquery.ShowMessage(response, Merquery.BreadCrumbs.crumbs);

        Merquery.Util.log(response);

        $('#result').empty();
        $('#breadcrumbs').empty();
        Merquery.BreadCrumbs.displayBreadcrumbs();
    
        var values = [[]];
        var fields = response.result.schema.fields;
        var data = [];
        var crumbs = Merquery.BreadCrumbs.crumbs;
        rowCount = response.result.totalRows;
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
    
        //Appends table header
        var thTag = $("<thead></thead>");
        var trTag = $("<tr></tr>");
        for(var i=0; i < fields.length; i++) {
            var header = $("<th></th>");
            header.append(Merquery.getDisplayName(schema[fields[i].name].fieldName));

            trTag.append(header);
            thTag.append(trTag);
        }
        $('#result').append(thTag);
    
        Merquery.Util.log(result);
        Merquery.Util.log("DATA FROM SERVER");
        Merquery.Util.log(data);
    
    
        //Appends data to the table
        for(var i=0; i < data.length; i++){
            var test = data[i];
            var row = $("<tr></tr>");
            for (var j = 0; j < fields.length; j++) {
                if(test.hasOwnProperty(fields[j].name)){
                    var column = $("<td></td>");
                    var field = $("<a></a>");
                    var fieldName = fields[j].name;
                    field.attr("href", "javascript:void(0)");
                    //field.data(schema[fieldName], test[fields[j].name]); //field.data("emailmd5", email);
                    field.text(test[fields[j].name]);                //field.text(emailMD5);
    
                    field.data("queryField", fields[j].name);            //field.data("queryField", "CRM_EmailMD5");
                    field.data("value", test[fields[j].name]);
                    field.data("type", fields[j].type);

                    var fieldValue = field.data("value");
                    var userValues;
                    field.click(function () {
                        Merquery.BreadCrumbs.clearBreadcrumbs();
                        $('breadcrumbs').empty();
                        crumbs = Merquery.BreadCrumbs.crumbs;
                        userValues = {
                            queryField: $(this).data("queryField"),
                            input: $(this).data("value"),
                            querytype: $(this).data("type")
                        };

                        if (Merquery.BreadCrumbs.checkForDuplicateInputs(userValues)) {
                            crumbs.push(userValues);
                            Merquery.Queries.runQuery(crumbs);
                        }
                    });

                    if (fields[j].name == "Demographics_emailmd5") {
                        var queryField = fields[j].name;
                       // var queryValue = test[fields[j].name];
                        var queryValue = $("<a></a>");
                        queryValue.attr("href", "javascript:void(0)");
                        queryValue.data("value", test[fields[j].name]);
                        queryValue.text(test[fields[j].name]);
                        column.append(field);
    
                        var myButton = $("<button type = 'button' value = '"+queryValue.data("value")+"'class = 'btn btn-default btn-sm' data-toggle='modal' data-target='#myModal'>" +
                                        "<span class = 'glyphicon glyphicon-user'></span></button>");
                        column.append(myButton);
                        myButton.data("queryfield",fields[j].name);

                        myButton.click(function () {
                            $('#myModal').find('.modal-body').empty();
                            $('#popimg').show();
                            $('#myModal').find('.modal-body').append("<img id='popimg' src= 'loading_indicator.gif'/>");
                            Merquery.Queries.popupQuery($(this).val(), $(this).data("queryfield"));
                            //console.log($(this).val());
    
                        });
                    }else{
                        column.append(field);
    
                    }
                }
                row.append(column);
            }
            $('#result').append(row);
            Merquery.Paginator.paginate(row);
        }
    

            //Calls the sort function to add sorting functionality to the table
            $("#result").tablesorter();
            $("#export-button").prop('disabled', false);
            Merquery.Paginator.initPagination();
            Merquery.Paginator.showResultsCount();
            Merquery.BreadCrumbs.showBreadcrumbs();
            Merquery.hideLoad();
            Merquery.showNav();


	    //Copies the entire table from result to exportedTable
            var source = document.getElementById('result');
            var destination = document.getElementById('exportedTable');
            var copy = source.cloneNode(true);
            copy.setAttribute('id', 'exportedTable');
            destination.parentNode.replaceChild(copy, destination);
            $('#exportedTable tr').removeAttr('class');
            $('#exportedTable tr').removeAttr('style');
            $('#exportedTable').attr('style', 'display: none;');

    };

Merquery.getDisplayName =function(fieldName) {
        var name = fieldName.split("_");
        var formatted;
        if(name.length >2){
            formatted = name[1].substr(0,1).toUpperCase() + name[1].substr(1).toLowerCase();
            for(var i=2; i < name.length; i++){
                formatted = formatted.concat(" ", name[i].substr(0,1).toUpperCase()+name[i].substr(1).toLowerCase());
            }
        }
        else{
            formatted = name[1].substr(0,1).toUpperCase() + name[1].substr(1).toLowerCase();
        }
        return formatted;
    }

 //   var createSchema = function(data) {
Merquery.createSchema = function(data) {
        var fields = data.schema.fields;
        var list = {};
        category = {};
        columnNames = {};
        type = {};
        schema = {};
        for(var i=0; i<fields.length; i++) {

        var originalCategoryName = fields[i].name;

        var categoryIndex = originalCategoryName.indexOf("_");
        var categoryName = originalCategoryName.substr(0, categoryIndex);
        var fieldName = originalCategoryName.substr(categoryIndex + 1);
    
        schema[originalCategoryName] = {
            displayName: Merquery.getDisplayName(originalCategoryName),
            type: fields[i].type,
            fieldName: originalCategoryName
        };

          if(!category[categoryName]) {
            category[categoryName] = [];
          }
          if(!columnNames[categoryName]) {
             columnNames[categoryName] = [];
          }
          if(!type[categoryName]) {
             type[categoryName] = [];
          }
          category[categoryName].push(schema[originalCategoryName].displayName);
          columnNames[categoryName].push(schema[originalCategoryName].fieldName);
          type[categoryName].push(schema[originalCategoryName].type);
          }
        Merquery.Util.log("category " + category);
        Merquery.Util.log( category);
        var num = 0;
        var tbodyTag = $("<div id='accordion'><tbody></tbody></div>");
        var categoryCounter = -1;
        for(var prop in category) {
            if(category.hasOwnProperty(prop)) {
                num++;
                categoryCounter++;
                var accordionTag= $("<div class='accordion-content'></div>")
                if (num==1) {
                var accordionTag=$("<div class='accordion-content default'></div>")
                }
                var divider = $("<li class='divider'></li>");
                var labelTag = $("<label class='accordion-toggle'></label>");
                labelTag.append(""+prop+ '<br>');
                tbodyTag.append(labelTag);

                var placeholders = Merquery.databaseConstants.query[categoryCounter].placeholder.split(", ");
                var databaseCoumns = columnNames[prop];
                var columnHeaders  = category[prop];
                var columnType = type[prop];
                for(var i =0; i< columnHeaders.length; i++){
                    var trTag = $("<tr></tr>");
                    var tdTag = $("<td class='widthSet'></td>");
                    if(columnHeaders[i] == "Gender"){
                        tdTag.append(columnHeaders[i]);
                        trTag.append(tdTag);
                        var radioTag;
                        var selectTag = $("<select id='genderSelect' class='input-box'></select>");
                        radioTag = $("<td></td>");
                        radioTag.attr("id", columnHeaders[i]);
                        for(var k=0; k < gender.values.length; k++){
                           var optionTag = $("<option></option>");
                           optionTag.attr("value", gender.values[k]);
                           optionTag.append(gender.displayName[k]);
                           selectTag.append(optionTag);
                          }
                        radioTag.append(selectTag);
                        trTag.append(radioTag);
                    }else{
                        var preTag = $("<td class='widthSet'></td>")
                        var inputTag = $("<input class='input-box' type='text'>");
                        inputTag.attr("id", columnHeaders[i]);
                        inputTag.attr("queryfield", databaseCoumns[i]);
                        inputTag.attr("type", columnType[i]);
                        inputTag.attr("onkeypress", "Merquery.handle(event)");
                        inputTag.attr("placeholder", placeholders[i]);
                        preTag.append(inputTag);
                        tdTag.append(columnHeaders[i]);
                        trTag.append(tdTag);
                        trTag.append(preTag);
                    }
                    accordionTag.append(trTag);
                    tbodyTag.append(accordionTag);

                }
                tbodyTag.append(divider);
            }
        }
        $('#navigationBar').append(tbodyTag);
        Merquery.Util.log(navigationBar);
        Merquery.initAccordion();
        Merquery.checkboxes.createCheckbox(category);
    }


    var gender = {
        type: 'radio',
        values: ['u','m', 'f','-1'],
        displayName: ['Not Specified','Male', 'Female','Unknown']
    }


    //Create schema functionality
    $(document).ready(function() {
        Merquery.hideLoad();
       // var getSchema = function() {
       Merquery.getSchema = function() {
            //Merquery.Queries.standardQuery("washington", "Demographics_city", 1, createSchema);
           Merquery.Queries.standardQuery("washington", "Demographics_city", 1, Merquery.createSchema);
        };
        setTimeout(function () {
            Merquery.AuthenticationManager.auth(Merquery.getSchema);
        }, 4000);


    });


    //deciding how many results to show
    //http://stackoverflow.com/questions/17127572/bootstrap-dropdown-get-value-of-selected-item
    $(document).on('click', '.dropdown-menu li a', function() {
        selText = $(this).text();
        $('#dLabel').html(selText + '<span class="caret"</span>');
    });

    Merquery.getLimit= function (){
        if (typeof selText == "undefined") {
            selText = 10;
        }
        return selText;
        }



})();

