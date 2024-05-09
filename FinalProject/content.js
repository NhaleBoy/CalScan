document.addEventListener('DOMContentLoaded', () =>{
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendRespone) {
            if(request.messege === "ingredients")
            {
                const html = document.querySelectorAll('li');
                const regex = /\b\w*ingredients?\w*\b/; 
                const filteredListItems = Array.from(html).filter(li => regex.test(li.className));
                const innerHTML = filteredListItems.map(li => li.innerText.trim());
                sendRespone(innerHTML);
            }
        }
    )
});