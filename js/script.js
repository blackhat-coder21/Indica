const preloader = document.querySelector(".preloader");

window.addEventListener('load', () => {
    preloader.remove();
})


// JavaScript for Tabs
$(document).ready(function () {
    $('#myTab a').on('click', function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
});



// document.addEventListener('DOMContentLoaded', function () {
//     const articlesContainer = document.querySelector('.articles');

//     function fetchVideoLinks() {
//         db.collection('videoLinks').get().then((querySnapshot) => {
//             querySnapshot.forEach((doc) => {
//                 const videoLink = doc.data().link;
//                 const iframe = document.createElement('iframe');
//                 iframe.className = 'video';
//                 iframe.src = videoLink;
//                 iframe.title = 'YouTube video player';
//                 iframe.frameBorder = '0';
//                 iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
//                 iframe.allowFullscreen = true;
//                 articlesContainer.appendChild(iframe);
//             });
//         }).catch((error) => {
//             console.error('Error fetching video links:', error);
//         });
//     }

//     fetchVideoLinks();
// });
