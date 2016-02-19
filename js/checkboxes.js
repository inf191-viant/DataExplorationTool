if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

Merquery.checkboxes = {
    checkedBoxes: [],

    clearCheckedBoxes: function() {
        Merquery.checkboxes.checkedBoxes = [];
    },

    // Creates checkbox portion of the left nav bar
    createCheckbox: function(category){
        $('#navigationBar').append("<br><strong>Tables to Display</strong><br>");
        for (var prop in category) {
            var divTag = $("<div></div>");
            var inputTag = $("<input type ='checkbox' name = 'category' checked>");
            divTag.append(inputTag);
            inputTag.attr("value", prop);
            divTag.append(" " + prop);
            $('#check-boxes').append(divTag);

        };

        // Reference: http://stackoverflow.com/questions/11787665/making-sure-at-least-one-checkbox-is-checked
        // Prevents user from unchecking the last checkbox
        $('input[type="checkbox"][name="category"]').on('change',function(){
            var numberOfCheckedBoxes = $('input[type="checkbox"][name="category"]:checked').map(function(){
                return this.value;
            }).toArray();

            if(!(numberOfCheckedBoxes.length>=1)){
                $(this).prop("checked",true);
                $('#cont').html("At least one value must be checked!");
                return false;

            };
        });
    },

    // Gets the selected checkboxes and pushes it into an array
    getSelectedCheckboxes:function(){
        Merquery.checkboxes.checkedBoxes = [];
        var checkedBoxes = Merquery.checkboxes.checkedBoxes;
        $.each($("input[name='category']:checked"), function(){
            checkedBoxes.push($(this).val());
        });
    }


};
