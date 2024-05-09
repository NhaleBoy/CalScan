// background.js

// Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setCalories") {
        // Store the amount of calories tracked by the user in Chrome storage
        chrome.storage.local.set({ "trackedCalories": request.calories }, () => {
            console.log("Calories tracked:", request.calories);
        });
    } else if (request.action === "getCalories") {
        // Retrieve the amount of calories tracked from Chrome storage
        chrome.storage.local.get("trackedCalories", (data) => {
            const trackedCalories = data.trackedCalories || 0; // Default to 0 if not found
            sendResponse({ calories: trackedCalories });
        });
        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});

// Initialize the extension by retrieving the initial value of tracked calories
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ "trackedCalories": 0 }, () => {
        console.log("Initialized tracked calories to 0");
    });
});