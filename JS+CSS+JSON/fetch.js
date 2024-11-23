let data = { lines: [] };
let currentTextIndex = -1;



let currentUrl = window.location.href;
const urlData = "https://getpantry.cloud/apiv1/pantry/a1edfe85-a3c4-44fe-807d-6717b6738152/basket/INTERVIEW PREPARATION APP OFFICIAL JSON"
const url_InterviewerCandidate = "https://getpantry.cloud/apiv1/pantry/c8769b00-008e-4d82-b672-8fcc1446798d/basket/HtmlCss";
const url_AdviceEncouragement = "https://getpantry.cloud/apiv1/pantry/c8769b00-008e-4d82-b672-8fcc1446798d/basket/UxuiEncouragement";

let data_InterviewerCandidate;
let data_AdviceEncouragement;


let dataStoredOnline;

let newData;
let savedQuestion;
let savedData = null;
let matchedObject;
let foundLine;


const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const fetchButton = document.getElementById('fetchButton');
const deleteButton = document.getElementById('deleteButton');
const checkboxes = document.getElementById('checkboxes');
const formatButtons = document.querySelector('.format-buttons');
const displayText1 = document.getElementById('displayText1');
const displayText2 = document.getElementById('displayText2');
const displayText3 = document.getElementById('displayText3');
const displayText4 = document.getElementById('displayText4');
const checkboxEdit = document.getElementById('checkboxEdit');


let isEditing;






/* DECIDES TO WHICH URL SAVE THE DATA BASED ON TOPIC */
function handleTopicAndPost(topic, savedData) {
    let filteredData;
    let postUrl;
    let consoletrack;

    if (!topic || topic === 'Interviewer' || topic === 'Candidate') {
        postUrl = url_InterviewerCandidate;
        consoletrack = "url_InterviewerCandidate";
        filteredData = {
            lines: savedData.lines.filter(obj => obj.topic === 'Interviewer' || obj.topic === 'Candidate')
        };
        data_InterviewerCandidate = filteredData; // Update local data store
    } else if (topic === 'Advice' || topic === 'Encouragement') {
        postUrl = url_AdviceEncouragement;
        consoletrack = "url_AdviceEncouragement";
        filteredData = {
            lines: savedData.lines.filter(obj => obj.topic === 'Advice' || obj.topic === 'Encouragement')
        };
        data_AdviceEncouragement = filteredData; // Update local data store
    } else {
        console.error('Unknown topic selected');
        return;
    }

    console.log("Filtered data about to send to JSON with the new info");
    console.log(filteredData);
    console.log(consoletrack);

    // Send the filtered data to the selected URL
    fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add new data');
            }
            console.log('New data (TOPIC, EDITION AND REPRESENTATION) added successfully to JSON ONLINE!');
        })
        .catch(error => console.error('Error adding new data:', error));
}




/* FETCH AND COMBINE DATA FROM BOTH URL */
function fetchAndCombineData() {
    // Fetch data from the first URL
    return fetch(url_InterviewerCandidate)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch data from InterviewerCandidate URL');
            }
            return response.json();
        })
        .then(dataIC => {
            console.log("Fetched data from InterviewerCandidate URL:", dataIC);


            // Fetch data from the second URL
            return fetch(url_AdviceEncouragement)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch data from AdviceEncouragement URL');
                    }
                    return response.json();
                })
                .then(dataAE => {
                    console.log("Fetched data from AdviceEncouragement URL:", dataAE);



                    // Combine the data from both sources
                    const combinedData = { lines: [...dataIC.lines, ...dataAE.lines] };
                    console.log("Combined data:", combinedData);

                    // Save the combined data to savedData
                    savedData = combinedData;
                    console.log("Saved data:", savedData);

                    // Return the combined data for further use if needed



                    // Add default topic 'Interviewer' to objects without a topic
                    savedData.lines.forEach(item => {
                        if (!item.topic) {
                            item.topic = 'Interviewer';
                        }
                        if (!item.explanation || item.explanation === "Explanation" || item.explanation === "") {
                            item.explanation = "...";
                        }
                        if (!item.answer || item.answer === "Answer" || item.answer === "") {
                            item.answer = "...";
                        }
                        if (!item.example || item.example === "Example" || item.example === "") {
                            item.example = "...";
                        }
                    });





                    /* SHOWS LAAST ONE IN LOCALSTORAGE AND ALLOWS RANDOM AFTER CLICK */
                    showJustEditedQuestion(savedData)
                    document.getElementById('fetchButton').addEventListener('click', function() {
                        fetchRandomText(); // Call your existing function after scrolling
                        document.getElementById('scrollable-edit').scrollTop = 0;
                    });
                    
                });
        })
        .catch(error => console.error('Error loading or combining data:', error));
}


/* SHOW AUTOMATICALLY THE QUESTION IN LOCALSTORAGE */
function showJustEditedQuestion(savedData) {

    savedQuestion = localStorage.getItem('savedQuestion');
    console.log("showjusteditedquestion: " + savedQuestion);
    /* 
        fetch(urlData)
        .then(response => response.json())
        .then(data => { */
    // If you want to find a specific question
    foundLine = savedData.lines.find(line => line.question === savedQuestion);
    console.log(foundLine)

    if (foundLine) {
        document.getElementById('displayText1').innerHTML = foundLine.question;
        document.getElementById('displayText2').innerHTML = foundLine.explanation;

        document.querySelectorAll('input[name="topic"]').forEach(radio => {
            if (radio.value === foundLine.topic) {
                radio.checked = true;
            }
        });
        document.getElementById('checkboxEdit').checked = foundLine.edition === true;

        document.getElementById('displayText3').innerHTML = foundLine.answer;
        document.getElementById('displayText4').innerHTML = foundLine.example;

        colorAssociation(foundLine.topic, foundLine.edition);



    } else {
        fetchRandomText();
    }
    /*     })
        .catch(error => console.error('Error fetching JSON:', error));
     */

}


/* FETCH RANDOM QUESTION AFTER PRESSING THE BUTTON */
function fetchRandomText() {
    console.log("FetchButton Click");
    document.getElementById('editableText').scrollTop = 0;

    // Filter questions based on selected checkboxes
    const topicCheckboxes = Array.from(document.querySelectorAll('#checkboxes input[type="checkbox"]:not([value="true"])'));
    const isEditingChecked = document.querySelector('#checkboxes input[value="true"]').checked;

    let filteredLines = savedData.lines.filter(item => {
        const matchesTopic = topicCheckboxes.length === 0 || topicCheckboxes.some(checkbox => checkbox.checked && item.topic === checkbox.value);
        const matchesEditing = !isEditingChecked || (isEditingChecked && (item.edition === true || item.edition === "true"));
        return matchesTopic && matchesEditing;
    });

    if (filteredLines.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredLines.length);
        const selectedItem = filteredLines[randomIndex];

        savedQuestion = selectedItem.question;
        foundLine = selectedItem;
        console.log('Selected item:', selectedItem);
        console.log(savedQuestion);
        localStorage.setItem('savedQuestion', savedQuestion);

        document.getElementById('displayText1').innerHTML = selectedItem.question;
        document.getElementById('displayText2').innerHTML = selectedItem.explanation;
        document.getElementById('displayText3').innerHTML = selectedItem.answer;
        document.getElementById('displayText4').innerHTML = selectedItem.example;

        // Automatically select the corresponding radio button
        let radios = document.querySelectorAll('input[name="topic"]');
        radios.forEach(radio => {
            if (radio.value === selectedItem.topic) {
                radio.checked = true;
            }
        });

        document.getElementById('checkboxEdit').checked = selectedItem.edition === true;

        colorAssociation(selectedItem.topic, selectedItem.edition);
    } else {
        document.getElementById('displayText1').innerText = 'No text available based on the selected filters.';
        document.getElementById('displayText2').innerText = '';
        document.getElementById('displayText3').innerText = '';
        document.getElementById('displayText4').innerText = '';
    }
}

/* SEPARATES BY TOPIC THE DATA BEFORE SENDING INTO THE JSON DEPENDING WITH THE RIGHT URL*/

function handleSelection() {
    console.log("-------------------");

    // Find the specific object in savedData that contains the fetched question
    let matchedObject = savedData.lines.find(obj => obj.question === savedQuestion);

    if (matchedObject) {
        console.log("Found the matched object:", matchedObject);
    } else {
        console.log("No matched object found.");
        return; // Exit if no matched object is found
    }

    // Get the selected radio button value
    let radios = document.querySelectorAll('input[name="topic"]:checked');
    let topic = radios.length > 0 ? radios[0].value : 'Interviewer';

    // Get the checkbox value
    let checkboxEdit = document.getElementById("checkboxEdit");
    let edition = checkboxEdit.checked; // true or false

    // Change background color and update SVG based on the selected values
    colorAssociation(topic, edition);

    // Create new data object
    let newData = {
        question: matchedObject.question,
        explanation: matchedObject.explanation,
        topic: topic,
        edition: edition, // true or false
        answer: matchedObject.answer,
        example: matchedObject.example
    };

    console.log('New data (TOPIC, EDITION AND REPRESENTATION) added successfully!');
    console.log(newData);

    // Remove the previous object with the same question from the array
    savedData.lines = savedData.lines.filter(obj => obj.question !== matchedObject.question);

    // Add the new data to the array
    savedData.lines.push(newData);
    console.log("Whole object about to send to JSON with the new info");
    console.log(savedData);

    // Filter savedData based on the selected topic 

    handleTopicAndPost(topic, savedData)
}

























function initDisplay() {
    if (checkboxEdit.checked) {
        displayText1.contentEditable = 'true';
        displayText2.contentEditable = 'true';
        displayText3.contentEditable = 'true';
        displayText4.contentEditable = 'true';
    } else {
        displayText1.contentEditable = 'false';
        displayText2.contentEditable = 'false';
        displayText3.contentEditable = 'false';
        displayText4.contentEditable = 'false';
    }
    // Ensure the buttons are initially hidden
    saveButton.style.display = 'none';
    cancelButton.style.display = 'none';
}


// Reset the layout and styles of checkboxes
function resetCheckboxes() {
    const labels = checkboxes.querySelectorAll('label');
    labels.forEach(label => {
        label.style.width = 'auto'; // Reset width to auto for proper wrapping
        label.style.display = 'inline-block'; // Ensure labels are inline-block
    });
}

// Toggle edit modelet originalContent1, originalContent2, originalContent3, originalContent4;



function toggleEditing(isEditing) {
    const section1 = document.querySelector('.section-1');

    section1.style.display = isEditing ? 'none' : 'block';
    formatButtons.style.display = isEditing ? 'block' : 'none';

    // Show/Hide save and cancel buttons based on editing state
    saveButton.style.display = isEditing ? 'inline-block' : 'none';
    cancelButton.style.display = isEditing ? 'inline-block' : 'none';

    fetchButton.style.display = isEditing ? 'none' : 'inline-block'; // Hide fetchButton when editing
    // Toggle edit mode on text elements
    const contentEditable = isEditing ? 'true' : 'false';
    displayText1.contentEditable = contentEditable;
    displayText2.contentEditable = contentEditable;
    displayText3.contentEditable = contentEditable;
    displayText4.contentEditable = contentEditable;

    // Ensure highlighting and formatting can be applied during editing
    if (isEditing) {
        document.execCommand('defaultParagraphSeparator', false, 'p');

        // Save the original content
        originalContent1 = displayText1.innerHTML;
        originalContent2 = displayText2.innerHTML;
        originalContent3 = displayText3.innerHTML;
        originalContent4 = displayText4.innerHTML;
    }
}


function highlightText(color) {
    if (isEditing) {
        document.execCommand('hiliteColor', false, color);
    }
}

function removeHighlight() {
    if (isEditing) {
        document.execCommand('removeFormat', false, null);
    }
}

function colorAssociation(topic, edition) {
    let questionSection = document.querySelector(".questionSection");
    questionSection.classList.remove('interviewer-bg', 'candidate-bg', 'advice-bg', 'encouragment-bg');

    switch (topic) {
        case 'Candidate':
            questionSection.classList.add('candidate-bg');
            break;
        case 'Advice':
            questionSection.classList.add('advice-bg');
            break;
        case 'Encouragement':
            questionSection.classList.add('encouragment-bg');
            break;
        default:
            questionSection.classList.add('interviewer-bg');
            break;
    }

    // Update the question additionals class based on the checkbox
    let questionAdditionals = document.getElementById("question-additionals");
    questionAdditionals.classList.remove('questionToEdit', 'questionNoToEdit');
    questionAdditionals.classList.add(edition ? 'questionToEdit' : 'questionNoToEdit');

    // Update the SVG color based on the checkbox
    let svgElement = document.querySelector('svg'); // Replace with the actual SVG selector
    if (svgElement) {
        svgElement.style.fill = edition ? 'rgb(255, 85, 55)' : '#333'; // Example colors
    }
}

// Updated function to store styling and save data


function addNewData() {

    let savedQuestion = localStorage.getItem("savedQuestion");
    let matchedObject = savedData.lines.find(obj => obj.question === savedQuestion);
    console.log("matchedObject previous to replace", matchedObject);
    savedData.lines = savedData.lines.filter(line => line.question !== savedQuestion);


    console.log("submitButton read");

    // Retrieve data from text areas
    savedQuestion = document.getElementById('displayText1').innerHTML;



    // Find the specific object in savedData that contains the fetched question


    // Create new data object including styled content
    const newData = {
        question: savedQuestion,
        explanation: document.getElementById('displayText2').innerHTML,
        topic: matchedObject ? matchedObject.topic : 'DefaultTopic', // Ensure topic is set
        edition: matchedObject ? matchedObject.edition : false, // Ensure edition is set
        answer: document.getElementById('displayText3').innerHTML,
        example: document.getElementById('displayText4').innerHTML
    };


    localStorage.setItem("savedQuestion", savedQuestion);
    console.log("NEW DATA replacing the previous one");
    console.log(newData);

    // Remove the previous object with the same question from the array


    console.log("data stored online before updating new one");
    console.log(savedData);

    // Add the new data to the array
    savedData.lines.push(newData);
    let dataToUpload = savedData;

    console.log("new DATA ABOUT TO BE UPDATED");
    console.log(dataToUpload);

    // POST request to add new data


    handleTopicAndPost(matchedObject.topic, dataToUpload)


}

// Updated function to display saved question with styling






// Define URLs for posting data based on topics

// Data saved from fetchAndCombineData





// Initialize the default selection result on page load
/* document.addEventListener("DOMContentLoaded", function () {
    handleSelection();
});
 */




/* FETCH THE INITIAL DATA FROM "DATA.JSON" DOCUMENT*/

// Function to fetch data from both URLs and combine them

// Call the function to fetch and combine data










/* DELETES CURRENT QUESTION AND ANSWER */

function deleteCurrentText() {
    // Retrieve the saved question from localStorage
    let savedQuestion = localStorage.getItem("savedQuestion");
    console.log("Saved question from localStorage:", savedQuestion);

    // Find the specific object in savedData that contains the fetched question
    let matchedObject = savedData.lines.find(obj => obj.question === savedQuestion);
    console.log("Matched object found:", matchedObject);

    if (matchedObject) {
        let topic = matchedObject.topic;

        // Filter out the object based on the question property
        savedData.lines = savedData.lines.filter(obj => obj.question !== savedQuestion);
        console.log("Object deleted. Remaining data:", savedData.lines);

        // Determine the URL and filtered data based on the topic
        let filteredData;
        let postUrl;
        let consoletrack;

        if (!topic || topic === 'Interviewer' || topic === 'Candidate') {
            postUrl = url_InterviewerCandidate;
            consoletrack = "url_InterviewerCandidate";
            filteredData = {
                lines: savedData.lines.filter(obj => obj.topic === 'Interviewer' || obj.topic === 'Candidate')
            };
            data_InterviewerCandidate = filteredData; // Update local data store
        } else if (topic === 'Advice' || topic === 'Encouragement') {
            postUrl = url_AdviceEncouragement;
            consoletrack = "url_AdviceEncouragement";
            filteredData = {
                lines: savedData.lines.filter(obj => obj.topic === 'Advice' || obj.topic === 'Encouragement')
            };
            data_AdviceEncouragement = filteredData; // Update local data store
        } else {
            console.error('Unknown topic selected');
            return;
        }

        console.log("Filtered data about to send to JSON with the new info");
        console.log(filteredData);
        console.log(consoletrack);

        // Send the filtered data to the selected URL
        fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filteredData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add new data');
                }
                console.log('New data (TOPIC, EDITION AND REPRESENTATION) added successfully to JSON ONLINE!');

                fetchAndCombineData()
                window.location.href = currentUrl;
            })
            .catch(error => console.error('Error adding new data:', error));

        // Redirect to current URL
    } else {
        console.log("No matched object found to delete.");
    }
}



/* THIS FUNCTION GOES TO "EDIT.HTML" AFTER SAVING THE QUESTION TO SHOW IN THE LOCAL STORAGE */

/* function goToEdit() {
    localStorage.setItem('savedQuestion', savedQuestion);
    window.location.href = 'edit.html';
}
 */





document.getElementById('confirm-question-to-delete').addEventListener('click', deleteCurrentText);
/* document.getElementById("editBtn").addEventListener("click", editBtnShowModal);
 */

/* document.getElementById('editBtn').addEventListener('click', goToEdit); */

/* goToFetchOrHome(); */


// Add event listeners to radio buttons and checkbox to update the UI in real time
/* document.querySelectorAll('input[name="topic"]').forEach(radio => {
    radio.addEventListener('change', handleSelection);
});
document.getElementById('checkboxEdit').addEventListener('change', handleSelection);
 */
// Initial call to set the UI based on default values

// Handle the edit button click
editButton.addEventListener('click', function () {
    console.log("edit btn click")
    toggleEditing(true);
});

// Handle the save button click
saveButton.addEventListener('click', function () {

    /* ELIMINATES THE PREVIOUS OBJECT BEFORE STORING IN NEWDATA OTHERWISE YOURE TRYING TO DELETE 
    A NON EXISTING OBJECT AND THEN PUSHING THE NEWDATA */

    /* IF YOU DELETE HERE, YOU ARE DELETING THE ONE THAT WAS PREVIOUS EDITING */

    /* IN HERE YOU ARE STILL WITH THE PREVIOUS OBJECT STORED IN SAVDDATA, THE EXACT SAME ONE 
    THAT WAS WHEN YOU PRESSED EDIT */

    /* IF YOU TRY TO DELETE IN ADDNEWDATA FUNC, IT ONLY DELETE THOSE WHEN YOU DIDN'T UPDATED DE
    QUESTION AND IS STILL SPELLED EXACTLY LIKE BEFORE, BUT IF YOU CHANGE THE QUESTION, YOU WILL TRY TO
    DELETE A NON EXISTING OBJECT AND THEN PUSHING THE NEW ONE*/

    /* IF YOU DELETE HERE IT DELETES THE RIGHT ONE */



    toggleEditing(false);

    addNewData();
    // Reset the checkboxes layout and styles


    console.log("saving styled data")
    resetCheckboxes();
    // Implement saving logic here if needed
});

// Handle the cancel button click

cancelButton.addEventListener('click', function () {
    toggleEditing(false);
    // Reset the checkboxes layout and styles
    resetCheckboxes();

    // Revert to the original content
    displayText1.innerHTML = originalContent1;
    displayText2.innerHTML = originalContent2;
    displayText3.innerHTML = originalContent3;
    displayText4.innerHTML = originalContent4;
});




document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to checkbox
    document.getElementById('checkboxEdit').addEventListener('change', handleSelection);

    // Add event listeners to radio buttons
    const radioButtons = document.querySelectorAll('input[name="topic"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', handleSelection);
    });
});


fetchAndCombineData();
/* showJustEditedQuestion(); */
// Initialize the display



initDisplay();

handleSelection();