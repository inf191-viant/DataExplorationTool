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
            $('#breadcrumbs').append("<a>initalSearch </a>/ ");
        }
        var crumbs = Merquery.BreadCrumbs.crumbs;
        for (var prop in crumbs) {
            if (crumbs.hasOwnProperty(prop)) {
                var test = $("<li></li>");
                var link = $("<a></a>");
                link.attr("href", "javascript:void(0)");
                link.append(prop + " : " + crumbs[prop] + " ");
                link.data("value", crumbs[prop]);
                link.data("queryField", prop);
                test.append(link);
                $('#breadcrumbs').append(test);

                link.click(function () {
                    Merquery.Queries.standardQuery($(this).data("value"), $(this).data("queryField"), selText);
                });
            }
        }
    }


}

