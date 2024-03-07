const login_image = document.querySelector('.login_image');
const signup_page = document.querySelector('.signup_page')
const login_card = document.querySelector('.login_card')
const nameInput = document.querySelector('.name')
const user_type = document.querySelector('.user_type')
const passwordInput = document.querySelector('.password')

login_image.addEventListener('mouseover', () => {
    signup_page.classList.remove('hidden')
})
login_card.addEventListener('mouseover', ()=>{
    signup_page.classList.add('hidden')

})

user_type.addEventListener('change', function () {

    if( user_type.value === 'guest'){
        nameInput.disabled = true;
        passwordInput.disabled = true;
        console.log('managers selected')
    }
    else{
        nameInput.disabled = false;
        passwordInput.disabled = false;
    }
    
})


document.addEventListener("DOMContentLoaded", function () {
    const firstForm = document.querySelector(".first_form");
    const secondForm = document.querySelector(".second_form");
    const nextButton = document.getElementById("nextButton");
    const previousbnt = document.getElementById('previousbnt')
    const previous = document.querySelector('.previous')

    // Hide the second form initially
    secondForm.classList.add("hidden");
    previous.classList.add('hidden')

    nextButton.addEventListener("click", function () {
        if (firstForm.classList.contains("hidden")) {
            // Switch to the first form
            firstForm.classList.remove("hidden");
            secondForm.classList.add("hidden");
            previous.classList.add('hidden')
        } else {
            // Switch to the second form
            firstForm.classList.add("hidden");
            secondForm.classList.remove("hidden");
            previous.classList.remove('hidden')
        }
    });
    previousbnt.addEventListener('click', ()=>{
        if (firstForm.classList.contains("hidden")) {
            // Switch to the first form
            firstForm.classList.remove("hidden");
            secondForm.classList.add("hidden");
            previous.classList.add('hidden')
        } else {
            // Switch to the second form
            firstForm.classList.add("hidden");
            secondForm.classList.remove("hidden");
            previous.classList.remove('hidden')

        }
    })
});

