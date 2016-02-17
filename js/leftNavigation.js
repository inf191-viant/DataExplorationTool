if(typeof Merquery == "undefined" ) {
    Merquery = {};
}

    $(document).ready(function() {

//        $("#toggle-left-nav").toggle(function() {
//            $(".sidebar").animate({width:0});
//            $(".main").animate({left:0});
//        }, function(){
//            $(".sidebar").animate({width:300});
//            $(".main").animate({left:300});
//        });

        $("#close-left-nav").click(function(){
            $(".sidebar").hide("slide");
            $(".main").css({'margin-left': '0px'});
            $("#open-left-nav").show();
        });

        $("#open-left-nav").click(function() {
            $(".sidebar").show("slide");
            $(".main").css({'margin-left': '320px'});
            $("#open-left-nav").hide();
        });
    });

