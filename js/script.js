const preloader = document.querySelector(".preloader");

window.addEventListener('load', () => {
    preloader.remove();
})

// JavaScript for Tabs
$(document).ready(function() {
    $('#myTab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
});


// Slider

