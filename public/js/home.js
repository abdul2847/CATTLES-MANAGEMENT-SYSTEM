const menu_modal = document.querySelector('.menu_modal')
const menu = document.querySelector('.menu')
const close_btn = document.querySelector('.model_clode_btn')
const icontexts = document.querySelectorAll('.icon-text')

menu.addEventListener('click', () => {
    menu_modal.classList.toggle('hidden')
})

close_btn.addEventListener('click', ()=>{
    menu_modal.classList.toggle('hidden')

})


icontexts.forEach((icontext)=>{
    icontext.addEventListener('click', ()=>{
    menu_modal.classList.toggle('hidden')
})
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