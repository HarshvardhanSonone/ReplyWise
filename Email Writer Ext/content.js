
function injectButton() {
    // Check if the button already exists to avoid duplicates
    const   existingButton = document.getElementById('Ai Response ');
    if (existingButton) existingButton.remove(); // Remove existing button if found

    // Create the button element
    }

    function createAIbutton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3'; // Gmail button classes for styling
    button.style.marginLeft = '8px'; // Add some margin for spacing
button.setAttribute('role', 'button');    
button.setAttribute('data-tooltip', 'AI Response'); // Tooltip text

return button;
}


function getEmailContent() {

const selectors = [

    '.hz','.a3s.aiL','.gmail_quote','[role="presentation"]' // Gmail email body selectors
];


        for (const selector of selectorrs) {
            const content   = document.querySelector(selector);
            if (content) {
                return content.innerText.trim();
            }
        return 'No email content found.';
        }


}


    function findComposeToolbar() {

        const selectorrs=[  '.btC', '.aDh',  '[role="toolbar"]' , '.gU.Up ' ]; // Updated selectors for Gmail compose toolbar   

        for (const selector of selectorrs) {
            const toolbar   = document.querySelector(selector);
            if (toolbar) {
                return toolbar;
            }
        return null; // Toolbar not found
        }
       
    }

const toolbar= findComposeToolbar();

if (!toolbar) {
console.log('Compose toolbar not found!');
return ;
}

console.log('Compose toolbar found:', toolbar);
button.classList.add('ai-response-button'); // Add a custom class for identification    

button.addEventListener('click', async() => {
try{
button.innerHTML = 'Generating...'; // Indicate that generation is in progress
button.disabled = true; // Disable the button to prevent multiple clicks
const emailContent = getEmailContent(); // Gmail email body selector


const response = await fetch('https://localhost:8080/api/email/generate', { // Replace with your API endpoint

method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify({ 
    emailContent: emailContent ,
    tone: "professional" // Example additional parameter
})


}); 

if (!response.ok) {
    throw new Error('Request failed with');
}

const data = await response.text();
const aiResponse = document.querySelector('[role="textbox"][g_editable="true"]');

if(aiResponse){

    aiResponse.focus();
    document.execCommand('insertText', false, data); // Insert the AI-generated text at the cursor position\
}// Adjust based on your API response structure 

} catch (error) {


}
finally {
    button.innerHTML = 'AI Response'; // Reset button text
    button.disabled = false; // Re-enable the button
}

});
toolbar.insertBefore(button, toolbar.firstChild); // Insert the button at the start of the toolbar  

const button = createAIbutton();

const observer = new MutationObserver((mutations) => {

for (const mutation of mutations) {
 // mutation  traversal
    const addedNodes = Array.from(mutation.addedNodes); // Convert NodeList to Array for easier
const hasComposeElements= addedNodes.some(node => node.nodeType === Node.ELEMENT_NODE &&
     (node.matches('.adh, .btc, [ role="dialog" ]') // adh is div , btc is roe , role dialog is for popup, thesre are the classes for compose window

// 
 || node.querySelector('.adh, .btc, [ role="dialog" ]')) /// sub node or its children

);
if (hasComposeElements) {
    console.log('Compose window detected!');
    // Perform your actions here
    setTimeout(injectButton, 2000); // Delay to ensure the compose window is fully loaded

}  

}

});

observer.observe(document.body, {
     childList: true, subtree: true }) 

     // Observe changes in the body and its subtree     //  