// API elements to fetch ingredients
const apiKey = "GGUdO05uj1oIjCDKDkX5uQ==lyKPOM2CBcexEAH4";
const apiUrl = "https://api.calorieninjas.com/v1/nutrition?query=";


document.addEventListener('DOMContentLoaded', () =>{
    //Elements from popup
    const serving = document.getElementById('serving');
    const add = document.getElementById('add');
    const total = document.getElementById('total');
    const reset = document.getElementById('reset');

    // Send a message to the background script to get the tracked calories
    chrome.runtime.sendMessage({ action: "getCalories" }, (response) => {
        const trackedCalories = response.calories || 0;
        total.innerHTML = `${trackedCalories}`;
    });

    //Add calories when user presses the button
    add.addEventListener("click", async function() {

        //Checks if the input box is null
        if(serving.value == ""){
            alert("Please enter a number");
            return;
        }
        
        //Get current tab to send message and request for ingredients from content.js
        const tab = await chrome.tabs.query({active: true, currentWindow: true});
        const response = await chrome.tabs.sendMessage(tab[0].id, {message: "ingredients"});
        let newTotal = parseFloat(total.innerText);
        var recTotal = 0;
        var gTotal = 0;
        
        //Begin getting calories of all
        await Promise.all(response.map(async id => {
            const res = await fetch(`${apiUrl}${encodeURIComponent(id)}`, {
                headers: {
                    'X-API-KEY': apiKey
                }
            });
            const data = await res.json();
            recTotal += data.calories;
            gTotal += data.serving_size_g;
        }));
    
        newTotal += (recTotal * serving.value) / gTotal; 
        total.innerHTML = `${newTotal}`;
        chrome.runtime.sendMessage({ action: "setCalories", calories: newTotal });
            
    });

    //Resets calories back to zero
    reset.addEventListener("click", function() {
        chrome.runtime.sendMessage({action: "setCalories", calories: 0})
        total.innerHTML = `${0}`;
    });
});