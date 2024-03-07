document.addEventListener("DOMContentLoaded", function () {
    const profileImg = document.querySelector(".profile_img img");
    const profileContent = document.querySelector(".profile_content");

    // Add a click event listener to the profile image
    profileImg.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent the click event from propagating to the document

        // Toggle the "hidden" class to show/hide the profile content
        profileContent.classList.toggle("hidden");
    });

    // Add a click event listener to the document to hide the profile content when clicking anywhere else
    document.addEventListener("click", function (event) {
        if (!profileContent.contains(event.target) && event.target !== profileImg) {
            profileContent.classList.add("hidden");
        }
    });
});

function toggleTheme() {
    const root = document.documentElement;
    root.classList.toggle('dark-theme'); // Toggle the dark-theme class
    // Save the theme preference to local storage
    const isDarkTheme = root.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

// Event listener for the theme switcher button
const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', toggleTheme);

// Check local storage for theme preference and apply it on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    toggleTheme(); // Apply the dark theme if it was selected
}

const menu_modal = document.querySelector('.side_bar')
const menu = document.querySelector('.menu')
const close_btn = document.querySelector('.model_clode_btn')


menu.addEventListener('click', () => {
    menu_modal.classList.toggle('show')
})

close_btn.addEventListener('click', ()=>{
    menu_modal.classList.toggle('show')

})

const switchtheme = document.querySelector('.switch')
const circle = document.querySelector('.circle')

switchtheme.addEventListener('click', () => {
    circle.classList.toggle('switchtheme')
})

document.addEventListener("DOMContentLoaded", function () {
    var backButton = document.getElementById("back-to-top");

    window.onscroll = function () {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backButton.style.display = "block";
        } else {
            backButton.style.display = "none";
        }
    };

    backButton.onclick = function () {
        // Smooth scrolling animation
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
});

