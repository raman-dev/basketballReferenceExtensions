
export default defineBackground(() => {
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("Background received message:", message);
        // You can add more logic here to handle different types of messages
        let key = null;
        switch (message.command) {
            case "storage.get":
                key = message.key;
                console.log("Background storage.get for key:", [key]);
                browser.storage.local.get([key]).then((data) => {
                    console.log("Background retrieved data:", data);
                    sendResponse(data);
                });
                return true; 
            case "storage.set":
                key = message.key;
                //overwrite existing data
                browser.storage.local.set({ [key]: message.data }).then(() => {
                    sendResponse({ status: "success" });
                });
                return true; 
        }
    });

});