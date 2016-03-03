if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.birthdateCalculator = {

    ageToBirthdate: function(age) {
        var now = new Date();
        var currentYear = now.getFullYear();
        var birthdateYear = currentYear - age; //age in years from input
        var birthdateTimestamp = now.setFullYear(birthdateYear);
        return birthdateTimestamp;
    }

};