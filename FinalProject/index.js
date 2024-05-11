// API elements to fetch ingredients from data base
const apiKey = "GGUdO05uj1oIjCDKDkX5uQ==lyKPOM2CBcexEAH4";
const apiUrl = "https://api.calorieninjas.com/v1/nutrition?query=";

document.addEventListener('DOMContentLoaded', () =>{
    console.log("index loaded")
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
        if(serving.value === ""){
            alert("Please enter a number");
            return;
        }
        let servingValue = parseFloat(serving.value);
        // Get current tab to send message and request for ingredients from content.js
        chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {action: "ingredients"}, async (retrieved) => {
                console.log("Retrieved data from content script:", retrieved.ingredients);

                //Set variables to start calculating calories by grams
                let newTotal = parseFloat(total.innerText);
                let recTotal = 0;
                let gTotal = 0;
                
                //Combine ingredients with API url
                for(let i = 0; i < retrieved.ingredients.length; i++){
                    retrieved.ingredients[i] = apiUrl + retrieved.ingredients[i];
                }

                // Begin getting calories of all ingredients
                const responses = await Promise.all(
                    retrieved.ingredients.map(each => fetch(each,  {
                        headers: {
                            'X-API-KEY': apiKey
                        }
                    }).then(response => response.json()))
                );
                //Begin adding data to find the recipe total calories and weight in grams
                for(let i = 0; i < responses.length; i++){
                    console.log(responses[i]["items"][0].calories);
                    recTotal += responses[i]["items"][0].calories;
                    gTotal += responses[i]["items"][0].serving_size_g;
                }
                console.log("recTotal");
                console.log(recTotal);
                //Calculate new Total to set and display it. 
                newTotal += (recTotal * servingValue) / gTotal; 
                console.log("calculated calories");
                console.log(newTotal);
                total.innerText = newTotal.toFixed();
                chrome.runtime.sendMessage({ action: "setCalories", calories: newTotal.toFixed() });
            });
        });
        
       
        
    });

    //Resets calories back to zero
    reset.addEventListener("click", function() {
        chrome.runtime.sendMessage({action: "setCalories", calories: 0})
        total.innerHTML = `${0}`;
        
    });
});