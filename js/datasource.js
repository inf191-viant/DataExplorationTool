var MyDataSource = function() {
};

MyDataSource.prototype = {
    getUser : function(userId) {
        return {
            id: userId,
            name : userId + "_'s name"
			
        }
    }
};

function createTable() {
    var no = ["1", "2", "3", "4"];
    var names = ["Roger", "Steve", "Mike", "Charlie"];
    var countries = ["USA", "Canada", "UK", "Germany"];
    var cname = ["abc.com", "xyz.com", "123.com", "ABB.com"];

    //Test that if all array values were null then String "no data to be displayed" shows up
    //var names, countries, no, cname;
    if (no == null && names == null & countries == null && cname == null)
        $("#result").append("No data to be displayed.");
    else {
        for (i = 0; i < no.length; i++) {
            var $formrow = '<tr><td>' + no[i] + '</td><td>' + names[i] + '</td><td>' + countries[i] + '</td><td>' + cname[i] + '</td></tr>';
            // $('.myTable').append($formrow);
            $('#result').append($formrow);
        }
    }
}



$(document).ready(function() {

    $("#get_user").click(function() {

        var user = new MyDataSource().getUser($("#user_id").val());

        var id = $("<div></div>");
        var name = $("<div></div>");
        id.text(user.id);
        name.text(user.name);
        $("#result").empty();
        $("#result").append(id);
        $("#result").append(name);

        createTable();



    });

});


$(document).ready(function () {
	$('.tree-toggle').click(function () {
	$(this).parent().children('ul.tree').toggle(200);
	});
});

