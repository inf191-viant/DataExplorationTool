if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.BreadCrumbs = {
    crumbs: [],

    clearBreadCrumbs: function() {
        Merquery.BreadCrumbs.crumbs = [];
    },
    //Forms the breadcrumbs
    formBreadcrumb: function () {
        if ($('#breadcrumbs').empty()){
            //initialSearch should be the one from the left navigation bar
            $('#breadcrumbs').append("<a><em>&times;</em>initalSearch</a>");
        }
        var crumbs = Merquery.BreadCrumbs.crumbs;
        for (var prop in crumbs) {
            if (crumbs.hasOwnProperty(prop)) {
                var link = $("<a><em>&times;</em></a>");
                link.attr("href", "javascript:void(0)");
                link.append(prop + " : " + crumbs[prop] + " ");
                link.data("value", crumbs[prop]);
                link.data("queryField", prop);
                $('#breadcrumbs').append(link);

                link.click(function () {
                    //Merquery.Queries.standardQuery($(this).data("value"), $(this).data("queryField"), selText);
                    if ($(this).data("queryField") in crumbs) {
                        delete crumbs[$(this).data("queryField")];
                    }
                    Merquery.Queries.breadCrumbQuery(crumbs, selText);
                });
            }
        }
    }


}

