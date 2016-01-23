(function(){
    // Schema based on GBQ

    
    
    
    
    if(typeof Merquery == "undefined" ) {
        Merquery = {};
    }

    Merquery.renderResults = function (response) {
    
        Merquery.Util.log(response);
        if ($('#header').empty()) {
            $('#header').append("Results for city");
            $('#header').addClass("page-header");
        }
        $('#result').empty();
    
        var values = [[]];
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
    
        //Appends table header
        var thTag = $("<thead></thead>");
        var trTag = $("<tr></tr>");
        for(var i=0; i < fields.length; i++) {
            var header = $("<th></th>");
            header.append(schema[fields[i].name].fieldName);
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
    
                    var fieldValue = field.data("value");
    
                    field.click(function () {
                        Merquery.Queries.standardQuery($(this).data("value"), $(this).data("queryField"), selText);
                        Merquery.BreadCrumbs.crumbs[$(this).data("queryField")]= $(this).data("value");
                        Merquery.BreadCrumbs.formBreadcrumb();
                    });
    
                    // switch the commented line to return to old database
                    //if(fields[j].name == "CRM_EmailMD5") {
                    if (fields[j].name == "demo_emailmd5") {
                        var queryField = fields[j].name;
                       // var queryValue = test[fields[j].name];
                        var queryValue = $("<a></a>");
                        queryValue.attr("href", "javascript:void(0)");
                        queryValue.data("value", test[fields[j].name]);
                        queryValue.text(test[fields[j].name]);
                        column.append(field);
    
                        var myButton = $("<button type = 'button' value = '"+queryValue.data("value")+"'class = 'btn btn-default btn-sm'>" +
                                        "<span class = 'glyphicon glyphicon-user'></span></button>");
                        column.append(myButton);
                        myButton.data("queryfield",fields[j].name);
    
                        myButton.click(function () {
                            Merquery.Queries.popupQuery($(this).val(), $(this).data("queryfield"));
    
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
            initTable("result");
            Merquery.Paginator.initPagination();
    };

    //Left navigation specifications
    $(document).ready(function () {
        $('label.tree-toggle').parent().children('ul.tree').toggle(0);
        $('.tree-toggle').click(function () {
            $(this).parent().children('ul.tree').toggle(200);
        });

    });
    var getDisplayName =function(fieldName) {
        var name = fieldName.split("_");
        var formatted;
        if(name.length >2){
            formatted = name[1].substr(0,1).toUpperCase() + name[1].substr(1).toLowerCase();
            formatted = formatted.concat(" ", name[2].substr(0,1).toUpperCase()+name[2].substr(1).toLowerCase());
        }
        else{
            formatted = name[1].substr(0,1).toUpperCase() + name[1].substr(1).toLowerCase();
        }
        return formatted;
    }

    var createSchema = function(data) {
        var fields = data.schema.fields;
        var list = {};
        var category = {};
        for(var i=0; i<fields.length; i++) {

        var originalCategoryName = fields[i].name;
        var categoryIndex = originalCategoryName.indexOf("_");
        var categoryName = originalCategoryName.substr(0, categoryIndex);
        var fieldName = originalCategoryName.substr(categoryIndex + 1);
    
        schema[originalCategoryName] = {
            displayName: getDisplayName(originalCategoryName),
            type: fields[i].type,
            fieldName: originalCategoryName
        };

          if(!category[categoryName]) {
            category[categoryName] = [];
          }
          category[categoryName].push(schema[originalCategoryName].displayName);

        }
        Merquery.Util.log("category " + category);
        Merquery.Util.log( category);
        var tbodyTag = $("<tbody></tbody>");
        for(var prop in category) {
            if(category.hasOwnProperty(prop)) {
                var divider = $("<li class='divider'></li>");
                var labelTag = $("<label></label>");
                labelTag.append(prop);
                tbodyTag.append(labelTag);
                tbodyTag.append(divider);
                var columnHeaders  = category[prop];
                for(var i =0; i< columnHeaders.length; i++){
                    var trTag = $("<tr></tr>");
                    var tdTag = $("<td class='widthSet'></td>");
                    var inputTag = $("<td class='widthSet'><input type='text'></td>");
                    inputTag.attr("id", columnHeaders[i]);
                    inputTag.attr("data-group", "input");
                    tdTag.append(columnHeaders[i]);
                    trTag.append(tdTag);
                    trTag.append(inputTag);
                    tbodyTag.append(trTag);

                }
            }
        }
        $('#navigationBar').append(tbodyTag);
        Merquery.Util.log(navigationBar);
    }

    //Search button functionality
    $(document).ready(function() {
        var getSchema = function() {
            Merquery.Queries.standardQuery("washington", "Demographics_city", 1, createSchema);
        };
        setTimeout(function () {
            Merquery.AuthenticationManager.auth(getSchema);
        }, 4000);
    
        $("#get_user").click(function () {
            document.getElementById("theImage").style.visibility = "hidden";
            $("#result").empty();
            Merquery.BreadCrumbs.clearBreadCrumbs();
            $('#breadcrumbs').empty();
            Merquery.Queries.runQuery();
        });

        $("id_textfields").keypress(handle);
    });
    
    
    //If enter is pressed in a textbox then the search functionality will be activated.
    function handle(e){
        if(e.which === 13){
            document.getElementById("theImage").style.visibility = "hidden";
            $("#result").empty();
            Merquery.BreadCrumbs.clearBreadCrumbs();
            $('#breadcrumbs').empty();
            Merquery.Queries.runQuery();
        }
        return false;
    }
    
    //Exports the data in the table to an xls file
    $(document).ready(function () {
        $("#export").click(function (e) {
        if(result.firstChild != null){
            window.open('data:application/vnd.ms-excel,' + encodeURIComponent(result.innerText));
            e.preventDefault();
            }
        });
    });
    //deciding how many results to show
    //http://stackoverflow.com/questions/17127572/bootstrap-dropdown-get-value-of-selected-item
    $(document).on('click', '.dropdown-menu li a', function() {
        selText = $(this).text();
        $('#dLabel').html(selText + '<span class="caret"</span>');
    });

    // code taken from uniondesign.ca/simple-accordion-without-jquery-ui/
      $(document).ready(function($) {
        $('#accordion').find('.accordion-toggle').click(function(){
    
          //Expand or collapse this panel
          $(this).next().slideToggle('fast');
    
          //Hide the other panels
          $(".accordion-content").not($(this).next()).slideUp('fast');
    
        });
      });

})();

