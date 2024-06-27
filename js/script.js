const preloader = document.querySelector(".preloader");

window.addEventListener('load', () => {
    preloader.remove();
})


$(document).ready(function () {
    $('#myTab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
});
