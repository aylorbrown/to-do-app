// when a user clicks on the button the text changes to thanks 

const changeButtonText = document.getElementById("mybtn");

changeButtonText.addEventListener("click", () => {
    changeButtonText.innerHTML = "Thanks!";
});
