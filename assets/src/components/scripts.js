/**
 * Dodanie funkcjonalości wysuwania i wsuwania panelu z logowanie, rejestracją i wylogowywaniem
 */
$(document).ready(function() {

    $(".dropdown-body").hide();
    $(".dropdown").on("click", function() {
        $(this).find(".dropdown-body").stop().slideToggle(200);
    });

    window.setTimeout(function(){
        $('.message').fadeOut(400).delay(400).queue(function(){
            $(this).remove();
        });
    }, 4000);

});