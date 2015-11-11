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

    });

});



