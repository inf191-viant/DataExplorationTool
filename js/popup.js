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
        var finalUserName;
        var finalDemographics;
        var finalAddressLine;
        var finalCampaignLine;
        var finalBehaviorLine;
        var finalDeviceLine;
        var finalPurchaseLine;
        var collectionOfCampaignsArray = [];
        var collectionOfBehaviorsArray = [];
        var collectionOfDevicesArray = [];
        var collectionOfPurchasesArray = [];


        indivInfo = '<table><thead><h1 id="userPopup" style="text-align:center;">Individual Profile</h1></thead><tbody>';
        for (var userProfileArrayItemPosition = 0; userProfileArrayItemPosition < arrayOfUserProfiles.length; userProfileArrayItemPosition++) {
            var itemInUserProfile = arrayOfUserProfiles[userProfileArrayItemPosition];
            var newTableLine;
            var demographArray = [];
            var addressArray = [];
            var fieldName;
            var individualCampaignArray = [];
            var behaviorArray = [];
            var deviceArray = [];
            var purchaseArray = [];
            var showFieldName;

            for (var j = 0; j < fields.length; j++) {
                if (itemInUserProfile.hasOwnProperty(fields[j].name)) {
                    showFieldName = fields[j].name;

                    if (fields[j].name == "Demographics_emailmd5" || fields[j].name == "Demographics_birthdate" || fields[j].name == "Demographics_gender" || fields[j].name == "Demographics_city" ||
                            fields[j].name == "Demographics_ethnicity" || fields[j].name == "Demographics_sexorient" || fields[j].name == "Demographics_marital" || fields[j].name == "Demographics_children") {
                        if (itemInUserProfile[fields[j].name] == null) {
                            continue;
                            }
                        else {
                            demographArray.push(schema[fields[j].name].displayName + ": " + itemInUserProfile[fields[j].name]);
                            if (fields[j].name == "Demographics_children") {
                                var demographLine = demographArray.join("<br>");
                                finalDemographics = demographLine;
                                //newTableLine = "<tr><td>Demographics</td><td>" + demographLine + "</td></tr>";
                                }
                            else {
                                continue;
                            }
                        }
                    }

                    // THIS SECTION OF CODES COMBINES THE ADDRESS INFORMATION INTO A SINGLE LINE
                    else if (fields[j].name == "Address_Address1" || fields[j].name == "Address_Address2" || fields[j].name == "Address_City" ||
                            fields[j].name == "Address_State" || fields[j].name == "Address_Zip" ) {
                        if (itemInUserProfile[fields[j].name] == null) {
                            continue;
                            }
                        else {
                            addressArray.push(itemInUserProfile[fields[j].name]);
                            if (fields[j].name == "Address_Zip") {
                                var addressLine = addressArray.join("<br>");
                                finalAddressLine = addressLine;
                                //newTableLine = "<tr><td>Address</td><td>" + addressLine + "</td></tr>";
                                }
                            else {
                                continue;
                            }
                        }
                    }

                    // END OF SECTION THAT DEALS WITH THE ADDRESS INFORMATION

                    // THIS SECTION OF CODE DEALS WITH COMBINING TOGETHER THE CAMPAIGN INFORMATION
                    else if (fields[j].name == "Campaign_advertiser_id" || fields[j].name == "Campaign_advertiser_name" || fields[j].name == "Campaign_campaign_id" ||
                                fields[j].name == "Campaign_campaign_name" || fields[j].name == "Campaign_impression_count" || fields[j].name == "Campaign_click_count" ||
                                fields[j].name == "Campaign_conversion_count") {
                        if (itemInUserProfile[fields[j].name] == null) {
                            continue;
                        }
                        else {
                            individualCampaignArray.push(schema[fields[j].name].displayName + ": " + itemInUserProfile[fields[j].name]);
                            if (fields[j].name == "Campaign_conversion_count") {
                                var campaignLine = individualCampaignArray.join("<br>");
                                collectionOfCampaignsArray.push(campaignLine);

                                //newTableLine = "<tr><td>Campaign</td><td>" + campaignLine + "</td></tr>";
                            }
                            else {
                                continue;
                            }
                        }
                    }
                    // END OF SECTION OF CODE THAT DEALS WITH THE CAMPAIGN INFORMATION

                    else if (fields[j].name == "Behavior_id" || fields[j].name == "Behavior_name" ||
                                fields[j].name == "Behavior_last_seen" || fields[j].name == "Behavior_count") {
                        if (itemInUserProfile[fields[j].name] == null) {
                            continue;
                            }
                        else {
                            behaviorArray.push(schema[fields[j].name].displayName + ": " + itemInUserProfile[fields[j].name]);
                            if (fields[j].name == "Behavior_count") {
                                var behaviorLine = behaviorArray.join("<br>");
                                collectionOfCampaignsArray.push(behaviorLine);

                                //newTableLine = "<tr><td>Behavior</td><td>" + behaviorLine + "</td></tr>";
                                }
                            else {
                                continue;
                                }
                            }
                        }

                    else if (fields[j].name == "Device_device_id" || fields[j].name == "Device_device_name" || fields[j].name == "Device_device_type_id" ||
                        fields[j].name == "Device_device_type_name" || fields[j].name == "Device_operating_system" || fields[j].name == "Device_last_seen" ) {
                        console.log(fields[j].name);
                        console.log(itemInUserProfile[fields[j].name]);
                        if (itemInUserProfile[fields[j].name] == null) {
                            continue;
                            }
                        else {
                            deviceArray.push(schema[fields[j].name].displayName + ": " + itemInUserProfile[fields[j].name]);
                            if (fields[j].name == "Device_last_seen") {
                                var deviceLine = deviceArray.join("<br>");
                                collectionOfDevicesArray.push(deviceLine);

                                //newTableLine = "<tr><td>Device</td><td>" + deviceLine + "</td></tr>";
                                }
                            else {
                                continue;
                                }
                            }
                        }

                    else if (fields[j].name == "Purchase_advertiser_id" || fields[j].name == "Purchase_last_sales_amount" ||
                        fields[j].name == "Purchase_last_purchase_date" || fields[j].name == "Purchase_ltv_online" ||
                        fields[j].name == "Purchase_ltv_offline") {
                        if (itemInUserProfile[fields[j].name] == null) {
                            continue;
                            }
                        else {
                            purchaseArray.push(schema[fields[j].name].displayName + ": " + itemInUserProfile[fields[j].name]);
                            if (fields[j].name == "Purchase_ltv_online") {
                                var purchaseLine = purchaseArray.join("<br>");
                                collectionOfPurchasesArray.push(purchaseLine);

                                //newTableLine = "<tr><td>Purchase</td><td>" + purchaseLine + "</td></tr>";
                                }
                            else {
                                continue;
                                }
                            }
                        }

                    else {
                        fieldName = fields[j].name;
                        newTableLine = "<tr><td>" + schema[fieldName].displayName + "</td><td>" + itemInUserProfile[fields[j].name] + '</td></tr>';
                    }
                }

                //indivInfo += newTableLine;
            }
//            indivInfo += "</tbody></table>";
//            if(userProfileArrayItemPosition < arrayOfUserProfiles.length-1) {
//                indivInfo += '<table><thead><h1 id="userPopup" style="text-align:center;">Individual Profile</h1></thead></tbody>';
//            }


        }

        finalCampaignLine = collectionOfCampaignsArray.join("<br><br>");

        finalBehaviorLine = collectionOfBehaviorsArray.join("<br><br>");

        finalDeviceLine = collectionOfDevicesArray.join("<br><br>");

        finalPurchaseLine = collectionOfPurchasesArray.join("<br><br>");


        indivInfo += "<tr><td>Demographics<hr></td><td>" + finalDemographics + "</td></tr><tr><td>Address<hr></td><td>" + finalAddressLine + "</td></tr><tr><td>Campaigns</td><td>" +
            finalCampaignLine + "</td></tr><tr><td>Behaviors<hr></td><td>" + finalBehaviorLine + "</td></tr><tr><td>Devices<hr></td><td>" + finalDeviceLine +
            "</td></tr><tr><td>Purchases<hr></td><td>" + finalPurchaseLine + "</td></tr></tbody></table>";


        Merquery.Popup.popUp(indivInfo);
        //$("#divADV2").hide();

    }
    
    
}
    