console.log("content loaded");
//Listen for message from index.js to retreive ingredients
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action === "ingredients")
        {
            //Find list of ingredients from webpage html.
            console.log("beginning getting ingredients");
            const html = document.querySelectorAll('li');
            const regex = /\b\w*ingredients?\w*\b/; 
            const filteredListItems = Array.from(html).filter(li => regex.test(li.className));
            const innerHTML = filteredListItems.map(li => li.innerText.trim());
            console.log(innerHTML);
            //Send list of ingredients back to index.js
            sendResponse({ingredients:innerHTML});
            //Prevent the content script from firing off multiple times. 
            return true;
        }
    }
)
