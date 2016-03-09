if(typeof Merquery == "undefined" ) {
    Merquery = {};
}
Merquery.Popup  = {

    //Renders the results in the popUp after the query is run
    renderPopUp: function (response) {
        var fields = response.result.schema.fields;
        var data = [];
        category = {};
        columnNames = {};
        type = {};
        schema = {};
        value = {};
        var test = [];
        Merquery.SchemaManager.makeSchema(fields);
        var popUpData = {};
         if (response.result.rows) {
             $.each(response.result.rows, function (j, row) {
                 var thisData = {};
                 for (var prop in schema) {
                     if (schema.hasOwnProperty(prop)) {
                         for (var i = 0; i < fields.length; i++) {
                             var originalCategoryName = fields[i].name;
                             var categoryIndex = originalCategoryName.indexOf("_");
                             var categoryName = originalCategoryName.substr(0, categoryIndex);
                             var fieldName = originalCategoryName.substr(categoryIndex + 1);

                                 if (fields[i].name == prop) {
                                    popUpData[originalCategoryName] = {
                                     type: fields[i].type,
                                     fieldName: originalCategoryName,
                                     value: row.f[i].v
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
                               if(!value[categoryName]) {
                                 value[categoryName] = [];
                              }
                               columnNames[categoryName].push(popUpData[originalCategoryName].fieldName);
                               type[categoryName].push(popUpData[originalCategoryName].type);
                               value[categoryName].push(popUpData[originalCategoryName].value);

                             thisData[fields[i].name] = row.f[i].v;
                             }
                         }
                     }
                 }
                 data.push(thisData);
             });
         }

        $("#popimg").hide();
        $('#myModal').find('.modal-body').empty();

        //Append array together
        var thisData = {};
        var dataArray = [];
        var queryField = {};
        var record = {};
       for(var i = 0; i < Merquery.databaseConstants.query.length; i++){
           for(var j=0; j < value[Merquery.databaseConstants.query[i].category].length; j++){
                var getValue = value[Merquery.databaseConstants.query[i].category];
                var getColumn = columnNames[Merquery.databaseConstants.query[i].category];
                thisData = {
                 category: Merquery.databaseConstants.query[i].category,
                 record: getValue,
                 queryField: getColumn
                }

                }
            dataArray.push(thisData);
       }

        console.log("dataArray");
        console.log(dataArray);

        //Remove duplicates and merge chunks of category data
          var temporaryArray = [];
          for (var i =0; i<dataArray.length; i++)
          {
            var numOfColumns = Merquery.databaseConstants.query[i].numOfColumns;
            for(var j=0; j<dataArray[i].queryField.length-1; j++){
                var identifierColumn = j + Merquery.databaseConstants.query[i].identifierColumn;
                var increment = j+ numOfColumns+1;
               if(temporaryArray.indexOf(dataArray[i].record[identifierColumn]) == -1  && (identifierColumn < (dataArray[i].queryField.length-1)))
                {
                    for(var k=j; k < increment; k++){
                        var value;
                       if (dataArray[i].queryField[k] == "Demographics_birthdate"){
                           var splitAge = dataArray[i].record[k].split(".");
                           value = splitAge[0];
                       } else {
                           value = dataArray[i].record[k];
                       }
                       temporaryArray.push(dataArray[i].queryField[k],value);
                     }
                }
               if((j + numOfColumns) < dataArray[i].queryField.length -1){
                    j = j+  numOfColumns;
                }else if ((j + numOfColumns) == (dataArray[i].queryField.length -1)){
                    j =  dataArray[i].queryField.length;
                }
            }
            }

        //Converts the variable temporaryArray to objects
        dataArray = [];
        temporaryObject = {};
        for (var i=0; i< temporaryArray.length; i++){
            var column = temporaryArray[i].split("_");
            if((temporaryArray[i+1] != null) && (column[1] != "emailmd5")){
                temporaryObject = {
                    queryField: temporaryArray[i],
                    queryValue: temporaryArray[i+1]
                }
                //Address2 null check
                if(column[1] == "Address1" && temporaryArray[i+3] == null){
                    temporaryArray[i+3] = "";
                }
                dataArray.push(temporaryObject);
             }
             i++;
        }

        //Formats the data into divs and tables
        for(var i = 0; i < Merquery.databaseConstants.query.length; i++){
            var divTag = $("<div id = '"+Merquery.databaseConstants.query[i].category+"' class = 'popupinfo'></div>");
            var tabledivTag = $("<div class = 'tablediv'></div>");
            var h5Tag = $("<h5></h5>");
            var lineTag = $("<hr></hr>");
            var noDataBoolean = true;
            var tableTag = $("<table id = 'popuptable' class = 'table table-striped'></table>");
            var theadTag = $("<thead></thead>");
            var tbodyTag = $("<tbody></tbody>");
            var headerCounter =0;
            var trbodyTag = $("<tr></tr>");
            var columnCounter =0;
            h5Tag.append(Merquery.databaseConstants.query[i].category);
            divTag.append(h5Tag);
            divTag.append(lineTag);

            //Appends the data in each category
            for(var j=0; j < dataArray.length; j++){
                var categoryName = dataArray[j].queryField.split("_");
                var firstColumn = dataArray[0].queryField;
                if(categoryName[0] ==  Merquery.databaseConstants.query[i].category){
                    var tdTag = $("<td></td>");
                    //Reducing the numOfColumns in the Demographics table in order to remove email column
                    if(Merquery.databaseConstants.query[i].category == "Demographics")
                        var numOfColumns = Merquery.databaseConstants.query[i].numOfColumns;
                    else
                        var numOfColumns = Merquery.databaseConstants.query[i].numOfColumns+1;
                    if(headerCounter < numOfColumns){
                       var trheaderTag = $("<tr></tr>");
                       var thTag = $("<th></th>");
                        thTag.append(Merquery.getDisplayName(dataArray[j].queryField));
                        theadTag.append(thTag);
                        headerCounter++;
                     }
                     if(columnCounter < numOfColumns){
                         if(dataArray[j].queryValue == 'm'){
                            tdTag.append("<div class='icon'><i class='fa fa-male fa-2x'></i></div>");
                         }else if(dataArray[j].queryValue == 'f'){
                            tdTag.append("<div class='icon'><i class='fa fa-female fa-2x'></i></div>");
                         }else if(dataArray[j].queryValue == 'Windows Desktop'){
                            tdTag.append("<div class='icon'><i class='fa fa-desktop fa-2x'></i><br>"+dataArray[j].queryValue+"</div>");
                         }else if(dataArray[j].queryValue == 'IPad' || dataArray[j].queryValue == 'Tablet PC' || dataArray[j].queryValue =='Unclassified Tablet' || dataArray[j].queryValue =='Quad Core Tablet' || dataArray[j].queryValue =='Wireless Tablet'){
                            tdTag.append("<div class='icon'><i class='fa fa-tablet fa-2x'></i><br>"+dataArray[j].queryValue+"</div>");
                         }else if(dataArray[j].queryValue == 'Playstation'){
                            tdTag.append("<div class='icon'><i class='fa fa-playstation fa-2x'></i><br>"+dataArray[j].queryValue+"</div>");
                         }else if(dataArray[j].queryValue == 'Windows Mobile' || dataArray[j].queryValue == 'Unclassified Mobile' || dataArray[j].queryValue == 'IPhone Mobile'){
                            tdTag.append("<div class='icon'><i class='fa fa-mobile fa-2x'></i><br>"+dataArray[j].queryValue+"</div>");
                         }else if(dataArray[j].queryValue == 'Android Mobile'){
                            tdTag.append("<div class='icon'><i class='fa fa-android fa-2x'></i><br>"+dataArray[j].queryValue+"</div>");
                         }else if(dataArray[j].queryValue == 'Linux Desktop'){
                            tdTag.append("<div class='icon'><i class='fa fa-linux fa-2x'></i><br>"+dataArray[j].queryValue+"</div>");
                         }else if(dataArray[j].queryValue == 'XBox'){
                            tdTag.append("<div class='icon'><i class='fa fa-social-xbox fa-2x'></i><br>"+dataArray[j].queryValue+"</div>");
                         }else if(dataArray[j].queryValue == 'Macintosh Desktop'){
                            tdTag.append("<div class='icon'><i class='fa fa-apple fa-2x'></i><br>"+dataArray[j].queryValue+"</div>");
                         }else{
                             tdTag.append(dataArray[j].queryValue);
                         }
                         trbodyTag.append(tdTag);
                         tbodyTag.append(trbodyTag);
                         noDataBoolean = false;
                         columnCounter++;
                    }
                    else{
                        trbodyTag = $("<tr></tr>");
                        columnCounter =0;
                        j = j -1;
                    }
                }
            }
            tableTag.append(theadTag);
            tableTag.append(tbodyTag);
            tabledivTag.append(tableTag);
            if(Boolean(noDataBoolean))
                divTag.append("No Data");

        $('#myModal').find('.modal-body').append(divTag);
        $('#myModal').find('.modal-body').append(tabledivTag);
        }
    }
}

    