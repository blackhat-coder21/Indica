// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOeB4Rt9-CQ7BJ24u0kLvh9BiXIauUGHI",
    authDomain: "indica-news.firebaseapp.com",
    projectId: "indica-news",
    storageBucket: "indica-news.appspot.com",
    messagingSenderId: "609269741653",
    appId: "1:609269741653:web:c8378fa0df193573f57cdc",
    measurementId: "G-P7B75FY4EX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Function to fetch video links from Firestore
async function fetchVideoLinks() {
    const articlesContainer = document.querySelector(".articles");
    try {
        const querySnapshot = await getDocs(collection(db, "videoLinks"));
        querySnapshot.forEach((doc) => {
            const videoLink = doc.data().link;
            const iframe = document.createElement("iframe");
            iframe.className = "video";
            iframe.src = `https://www.youtube.com/embed/${getYouTubeID(
                videoLink
            )}`;
            iframe.title = "YouTube video player";
            iframe.frameBorder = "0";
            iframe.allow =
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            articlesContainer.appendChild(iframe);
        });
    } catch (error) {
        console.error("Error fetching video links:", error);
    }
}

// Helper function to extract YouTube video ID from URL
function getYouTubeID(url) {
    const regExp =
        /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length == 11 ? match[2] : null;
}

// Fetch video links when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchVideoLinks);

async function fetchArticles() {
    const row1 = document.getElementById("row1");
    const querySnapshot = await getDocs(collection(db, "mini-article"));

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const col4 = document.createElement("div");
        col4.className = "col-12 col-md-4";
        col4.innerHTML = `
                <div class="news-item d-flex align-items-center">
                    <a href="#">
                        <img src="${data.image}" class="img-mini" alt="${data.title}">
                    </a>
                </div>
            `;

        const col8 = document.createElement("div");
        col8.className = "col-12 col-md-8 remove";
        col8.innerHTML = `
                <div class="news-item">
                    <a href="#">
                        <h6>${data.title}</h6>
                    </a>
                    <div class="bulletin-timeline">
                        <i class="far fa-clock "></i><span>&nbsp ${data.time}</span>
                    </div>
                    <p>${truncateContent(data.content, 30)}</p>
                </div>
            `;

        row1.appendChild(col4);
        row1.appendChild(col8);
    });
}

document.addEventListener("DOMContentLoaded", fetchArticles);


function truncateContent(content, wordLimit) {
    const words = content.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return content;
}



async function fetchArticlesTab(tab) {
    const articlesContainer = document.getElementById(`${tab}-content`);
    articlesContainer.innerHTML = "";
    try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.tab === tab) {
                const articleDiv = document.createElement("div");
                articleDiv.className = "col-12 col-md-4";
                articleDiv.innerHTML = `
                        <div class="news-item">
                            <a href="#">
                                <img src="${data.imageUrl}" class="img-fluid" alt="${data.title}">
                            </a>
                            <a href="#">
                                <h4>${data.title}</h4>
                            </a>
                            <p>${data.content}</p>
                        </div>
                    `;
                articlesContainer.appendChild(articleDiv);
            }
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchArticlesTab("education");
    fetchArticlesTab("finance");
    fetchArticlesTab("politics");

    document.querySelectorAll(".nav-link").forEach((tab) => {
        tab.addEventListener("click", () => {
            const tabId = tab.id.split("-")[0];
            fetchArticlesTab(tabId);
        });
    });
});



async function fetchCarouselArticles() {
    try {
        const articlesRef = collection(db, "carouselArticles");
        const snapshot = await getDocs(articlesRef);

        // Clear existing carousel items
        const carouselInner = document.querySelector(".carousel-inner");
        carouselInner.innerHTML = "";

        // Collect all articles
        const articles = [];
        snapshot.forEach((doc) => {
            articles.push(doc.data());
        });

        // Group articles in sets of 4
        for (let i = 0; i < articles.length; i += 4) {
            const articleSet = articles.slice(i, i + 4);
            const isActive = i === 0 ? "active" : ""; // Set the first item as active

            const carouselItem = document.createElement("div");
            carouselItem.className = `carousel-item ${isActive}`;

            const row = document.createElement("div");
            row.className = "row";

            articleSet.forEach((article) => {
                const col = document.createElement("div");
                col.className = "col-12 col-md-5 col-lg-3";
                col.innerHTML = `
                <div class="card">
                    <img src="${article.imageUrl}" class="card-img-top" alt="${article.title}">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${truncateContent(article.content,30)}</p>
                        <a href="${article.readMoreLink}" class="btn-corousel">Read More</a>
                    </div>
                </div>
            `;
                row.appendChild(col);
            });

            carouselItem.appendChild(row);
            carouselInner.appendChild(carouselItem);
        }

        // Activate the carousel
        $(".carousel").carousel();
    } catch (error) {
        console.error("Error fetching carousel articles:", error);
    }
}

// Fetch carousel articles when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    fetchCarouselArticles();
});



const galleryCollectionRef = collection(db, "gallery");

// Function to fetch and display images from Firestore
async function fetchImages() {
    try {
        const imageContainer = document.getElementById("imageContainer");
        imageContainer.innerHTML = ""; // Clear existing images

        // Fetch all documents from the 'gallery' collection
        const querySnapshot = await getDocs(galleryCollectionRef);

        // Loop through each document and create HTML for displaying images
        querySnapshot.forEach((doc) => {
            // Access the 'link' field in each document
            const imageUrl = doc.data().link;

            // Create HTML structure for each image item
            const imageDiv = document.createElement("div");
            imageDiv.className = "item col-sm-6 col-md-4 col-lg-3 mb-4";
            imageDiv.innerHTML = `
            <img class="img-fluid" src="${imageUrl}">
        `;

            // Append image item to the container
            imageContainer.appendChild(imageDiv);
        });
    } catch (error) {
        console.error("Error fetching images:", error);
    }
}



// Fetch images when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", fetchImages);




async function fetchData() {
    const querySnapshot = await getDocs(collection(db, "latest"));
    const contentDiv = document.getElementById("content");

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const rowContent = document.createElement("div");
        rowContent.classList.add("row-content");

        const img = document.createElement("img");
        img.src = data.imageUrl; // assuming 'imageUrl' field in Firestore
        img.alt = `Image ${data.title}`;
        img.classList.add("left-image");

        const textDiv = document.createElement("div");

        const titleDiv = document.createElement("div");
        titleDiv.classList.add("title");
        titleDiv.textContent = data.title;

        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("description");
        descriptionDiv.textContent = truncateContent(data.description, 60);

        textDiv.appendChild(titleDiv);
        textDiv.appendChild(descriptionDiv);

        rowContent.appendChild(img);
        rowContent.appendChild(textDiv);

        contentDiv.appendChild(rowContent);
    });
}
document.addEventListener("DOMContentLoaded", fetchData);




async function fetchArticleData() {
    const querySnapshot = await getDocs(collection(db, "latest-article"));
    const contentDiv = document.getElementById("content-article");

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const rowContent = document.createElement("div");
        rowContent.classList.add("row-content-1");

        const img = document.createElement("img");
        img.src = data.imageUrl;
        img.alt = `Image ${data.title}`;
        img.classList.add("left-image-1");

        const textDiv = document.createElement("div");

        const titleDiv = document.createElement("div");
        titleDiv.classList.add("title-1");
        titleDiv.textContent = data.title;

        const descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("description-1");
        descriptionDiv.textContent = truncateContent(data.description, 60);

        textDiv.appendChild(titleDiv);
        textDiv.appendChild(descriptionDiv);

        rowContent.appendChild(img);
        rowContent.appendChild(textDiv);

        contentDiv.appendChild(rowContent);
    });
}
document.addEventListener("DOMContentLoaded", fetchArticleData);



