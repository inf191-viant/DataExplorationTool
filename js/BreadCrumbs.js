if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.BreadCrumbs = {
    crumbs: [],

    clearBreadcrumbs: function() {
        Merquery.BreadCrumbs.crumbs = [];
    },

    showBreadcrumbs: function(){
        $('#breadcrumbs').show();
    },

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
            if (crumbs[i].queryField == "Demographics_birthdate"){
                if (Merquery.BreadCrumbs.countBirthdates() == 2) {
                    link.append("Demographics_Age: " + crumbs[i].input + " - " + crumbs[i+1].input);
                    i++;
                } else {
                    link.append("Demographics_Age: " + crumbs[i].input);
                }
            }
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

    //checks birthdate in the breadcrumbs to make range
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