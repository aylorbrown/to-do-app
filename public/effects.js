// when a user clicks on the button the text changes to thanks 

const changeButtonText = document.getElementById("mybtn")

changeButtonText.addEventListener("click", (event) => {
    changeButtonText.value = "Thanks!";
    console.log('I clicked the button!');
    // debugger;
    // volunteer for tasks before reloading
})

// input doesnt have innerHTML use .value 


const allTheForms = document.querySelectorAll('form'); 

allTheForms.forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault();

        fetch(window.location.pathname, {
            body: "taskID="+ event.target.elements.taskID.value, 
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "post",
        
        })
    })
})