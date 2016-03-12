if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.BreadCrumbs = {
    crumbs: [],

    // Clears the stored breadcrumbs
    clearBreadcrumbs: function() {
        Merquery.BreadCrumbs.crumbs = [];
    },

    // Displays breadcrumbs once page is loaded
    showBreadcrumbs: function(){
        $('#breadcrumbs').show();
    },

    // Hides breadcrumbs while page is loading
    hideBreadcrumbs: function() {
        $('#breadcrumbs').hide();
    },

    // Forms and displays the breadcrumbs
    displayBreadcrumbs: function() {
        var crumbs = Merquery.BreadCrumbs.crumbs;
        var temporaryCrumbs = [];
        for (var i =0; i < crumbs.length; i++) {
            var link = $("<a><em>&times;</em></a>");
            link.attr("href", "javascript:void(0)");

            // If the column is called "Demographics_birthdate" change it to "Demographics_Age" to
            // reflect how the columns now state age instead of birthdate
            if (crumbs[i].queryField == "Demographics_birthdate"){
                if (Merquery.BreadCrumbs.countBirthdates() == 2) {
                    link.append("Demographics_Age: " + crumbs[i].input + " - " + crumbs[i+1].input);
                    i++;
                } else {
                    link.append("Demographics_Age: " + crumbs[i].input);
                }
            }

            // If the column is called "Demographics_emailmd5" change it to "Demographics_Email" to
            // reflect how the columns now state email instead of emailmd5
            else if (crumbs[i].queryField == "Demographics_emailmd5") {
                link.append("Demographics_Email: " + crumbs[i].input);
            }
            else {
                link.append(crumbs[i].queryField + ": " + crumbs[i].input);
            }
            link.data("value", crumbs[i].input);
            link.data("queryField", crumbs[i].queryField);
            link.data("type", crumbs[i].querytype);
            $('#breadcrumbs').append(link);

            // Removes the breadcrumbs, when clicked
            link.click(function () {
                for (var i =0; i<crumbs.length; i++)
                {
                    if (crumbs[i].queryField != $(this).data("queryField"))
                    {
                        temporaryCrumbs.push(crumbs[i]);
                    }
                }
                Merquery.BreadCrumbs.clearBreadcrumbs();
                crumbs = Merquery.BreadCrumbs.crumbs;
                for (var i = 0; i<temporaryCrumbs.length; i++) {
                    crumbs.push(temporaryCrumbs[i]);
                }
                Merquery.Queries.runQuery(crumbs);
            });
        }
    },



    // checkForDuplicateInputs checks whether the value is already in the breadcrumbs
    // before adding to the breadcrumbs
    checkForDuplicateInputs: function(userValues) {
        var crumbs = Merquery.BreadCrumbs.crumbs;
        for (var i =0; i < crumbs.length; i++) {
            if (crumbs[i].queryField == userValues.queryField) {
                return false;
            }
        }
        return true;
    },

    //checks birthdate in the breadcrumbs to display it as a range
    countBirthdates: function() {
        var count = 0;
        var crumbs = Merquery.BreadCrumbs.crumbs;
        for (var i=0; i<crumbs.length; i++) {
            if (crumbs[i].queryField == "Demographics_birthdate") {
                count += 1;
            }
        }
        return count;
    }

};