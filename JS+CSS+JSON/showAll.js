const url_InterviewerCandidate = "https://getpantry.cloud/apiv1/pantry/c8769b00-008e-4d82-b672-8fcc1446798d/basket/HtmlCss";
const url_AdviceEncouragement = "https://getpantry.cloud/apiv1/pantry/c8769b00-008e-4d82-b672-8fcc1446798d/basket/UxuiEncouragement";


let data = { lines: [] };

document.addEventListener('DOMContentLoaded', function () {
    const dataList = document.getElementById('output');
    const checkboxes = document.querySelectorAll('.checkbox');
    const searchBar = document.getElementById('search-input');

    checkboxes.forEach(checkbox => checkbox.addEventListener('change', filterData));
    searchBar.addEventListener('input', filterData);

    function filterData() {
        let filteredData = data.lines;

        // Get checked topic values and the 'editing' checkbox status
        const checkedTopics = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked && checkbox.value !== 'true')
            .map(checkbox => checkbox.value);

        const isEditingChecked = document.getElementById('edit').checked;

        // Apply filters
        filteredData = filteredData.filter(item => {
            const matchesTopic = checkedTopics.length === 0 || checkedTopics.includes(item.topic);
            const matchesEditing = !isEditingChecked || item.edition === true;
            return matchesTopic && matchesEditing;
        });

        // Apply search filter
        const searchTerm = searchBar.value.toLowerCase();
        if (searchTerm) {
            filteredData = filteredData.filter(item => item.question.toLowerCase().includes(searchTerm));
        }

        displayData(filteredData);
    }

    function displayData(filteredData) {
        dataList.innerHTML = '';

        filteredData.forEach(item => {
            const a = document.createElement('a');
            a.classList.add('data-item');
            a.href = 'index.html';

            // Save the question in localStorage with "savedQuestion"
            a.addEventListener('click', () => {
                localStorage.setItem('savedQuestion', item.question);
            });

            // Strip HTML tags from the question before displaying
            a.textContent = stripHtml(item.question);

            // Apply CSS styles to make the <a> tag full width and stay on one line
            a.style.display = 'block';
            a.style.width = '100%';
            a.style.marginBottom = '10px';
            a.style.padding = '0';
            a.style.boxSizing = 'border-box';
            a.style.textDecoration = 'none';

            dataList.appendChild(a);
        });
    }

    // Function to strip HTML tags from a string
    function stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    // Fetch data from both URLs and combine them
    Promise.all([
        fetch(url_InterviewerCandidate).then(response => response.json()),
        fetch(url_AdviceEncouragement).then(response => response.json())
    ])
    .then(([interviewerCandidateData, adviceEncouragementData]) => {
        data.lines = [...interviewerCandidateData.lines, ...adviceEncouragementData.lines];
        displayData(data.lines);
    })
    .catch(error => console.error('Error loading data:', error));
});
