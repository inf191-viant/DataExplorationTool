if(typeof Merquery == "undefined" ) {
    Merquery = {};
}
Merquery.Popup  = {

    popUp: function (info) {

     //  $('#myModal').find('.modal-body').empty();
      // $('#myModal').find('.modal-body').append(info);
       //$(this).find('.modal-title').text(titleData + ' Form');
    },
    
    //Renders the results in the popUp after the query is run
    renderPopUp: function (response) {
        var fields = response.result.schema.fields;
        var data = [];
        category = {};
        columnNames = {};
        type = {};
        schema = {};
        value = {};
        Merquery.SchemaManager.makeSchema(fields);
        Merquery.getSchema();
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
                                 displayName: Merquery.getDisplayName(originalCategoryName),
                                //displayName: originalCategoryName,
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
                               category[categoryName].push(popUpData[originalCategoryName].displayName);
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
            //if(Merquery.databaseConstants.query[i].category == "Demographics"){
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

        //Remove duplicates

          var temporaryArray = [];

          for (var i =0; i<dataArray.length; i++)
          {

            if(dataArray[i].category == "Campaign"){
            for(var j=0; j<dataArray[i].queryField.length; j++){
                console.log(dataArray[i].record[j]);
                //if((dataArray[i].queryField[j] == Merquery.databaseConstants.query[i].identifier) && (temporaryArray.indexOf(dataArray[i].record[j]) == -1 ))
                if(temporaryArray.indexOf(dataArray[i].record[j]) == -1 )
                {
                    console.log(dataArray[i].queryField[j], dataArray[i].record[j], j);
                    for(var k=0; k < Merquery.databaseConstants.query[i].numOfColumns; k++){
                        //if(temporaryArray.indexOf(dataArray[i].record[j]) == -1 )
                          //  {
                                temporaryArray.push(dataArray[i].queryField[k],dataArray[i].record[k]);
                            //}
                     }

                    // console.log(Merquery.databaseConstants.query[i].numOfColumns);
                }
                j += Merquery.databaseConstants.query[i].numOfColumns;
                                     console.log("j");
                                     console.log(j);


          }



              }
              }

          console.log("TemporaryArray");
          console.log(temporaryArray);

         dataArray = [];
         temporaryObject = {};
        for (var i=0; i< temporaryArray.length; i++){
            temporaryObject = {
                queryField: temporaryArray[i],
                queryValue: temporaryArray[i+1]
            }
            i++;
            dataArray.push(temporaryObject);
        }
          console.log("DataArray");
          console.log(dataArray);

        for(var i = 0; i < Merquery.databaseConstants.query.length; i++){
            var divTag = $("<div></div>");
            var h5Tag = $("<h5></h5>");
            var lineTag = $("<hr></hr>");
            h5Tag.append(Merquery.databaseConstants.query[i].category);
            divTag.append(h5Tag);
            if(i != Merquery.databaseConstants.query.length -1)
                divTag.append(lineTag);


            //Appends the data in each category
            for(var j=0; j < dataArray.length; j++){
                var categoryName = dataArray[j].queryField.split("_");
                if(categoryName[0] ==  Merquery.databaseConstants.query[i].category){
                    divTag.append(Merquery.getDisplayName(dataArray[j].queryField) + ": "+ dataArray[j].queryValue + "<br>");
                }
            }


/*

            //Appends the data in each category
            if(Merquery.databaseConstants.query[i].category == "Demographics"){
               // for(var j=0; j < value[Merquery.databaseConstants.query[i].category].length; j++){
                //var getValue = value[Merquery.databaseConstants.query[i].category];
                //var getColumn = columnNames[Merquery.databaseConstants.query[i].category];
                //if()
                //divTag.append(getColumn[j] + ": "+ getValue[j] + "<br>");
                for(var j=0; j < dataArray[i].queryField.length; j++){
                    divTag.append(Merquery.getDisplayName(dataArray[i].queryField[j]) + ": "+ dataArray[i].record[j] + "<br>");
                }
            }
*/


            $('#myModal').find('.modal-body').append(divTag);
        }
    }
}

    