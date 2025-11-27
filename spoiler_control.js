const MOVIE_ERA_NAMES = {
    0: "The Original Series era",
    1: "The Next Generation era",
    2: "Kelvin Timeline",
    3: "Other"
}

/**
 * Adds a button element
 * @param textContent: the textContent of the button element
 * @param className: the class of the button element 
 * @returns: the spoiler button element
 */
function addButton(textContent, className) {
    var button = document.createElement('Button');
    button.textContent = textContent;
    button.className = className;
    return button;
}

/**
 * Sets up the spoiler panel on the right side of the screen, filling it with the sources in the page.
 */
function setUpPanel() {
    let panel = document.getElementById('spoiler-control-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.className = "spoiler-control-panel";
        panel.id = 'spoiler-control-panel';

        const closeButton = addButton('Close', 'close-button');
        closeButton.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        panel.appendChild(closeButton);

        // Fill the panel with the categories, seasons and episodes
        // Follows this hierarchy: details > ul > li > details > ul > li
        // Categories
        for(let category of sources.values()) {
            if(category !== "empty") {
                const categoryCheckbox = addCheckbox();
                const categoryDetails = addDetailsWithCheckbox(category.title, categoryCheckbox);
                addMenuListener(categoryDetails, categoryCheckbox);

                // Seasons for each category
                const seasonList = document.createElement('ul');
                seasonList.className = "season-list";
                Object.keys(category.seasons).forEach(seasonNumber => {
                    const seasonElement = document.createElement('li');
                    seasonList.appendChild(seasonElement);
                    let seasonDetails;
                    const seasonCheckbox = addCheckbox();
                    if (category.title === "Movies")
                        seasonDetails = addDetailsWithCheckbox(MOVIE_ERA_NAMES[seasonNumber], seasonCheckbox);
                    else
                        seasonDetails = addDetailsWithCheckbox(`Season ${seasonNumber}`, seasonCheckbox);
                    addMenuListener(seasonDetails, seasonCheckbox);
                    seasonElement.appendChild(seasonDetails);

                    // Episodes for each season
                    // Values are structured in an array of two elements: 0=the string to show in the UI; 1=the paragraph to hide or show
                    for(let episode of category.seasons[seasonNumber].values()) {
                        const episodeList = document.createElement('ul');
                        episodeList.className = "episode-list";
                        seasonDetails.appendChild(episodeList);
                        const episodeElement = document.createElement('li');
                        episodeElement.appendChild(document.createTextNode(episode[0]));
                        const episodeCheckbox = addCheckbox(episodeElement);
                        episodeElement.insertBefore(episodeCheckbox, episodeElement.firstChild);
                        episodeList.appendChild(episodeElement);
                        addSpoilerListener(episodeCheckbox, episode[1]);
                    }
                });
                categoryDetails.appendChild(seasonList);
                panel.appendChild(categoryDetails);
            }
        }
        document.body.appendChild(panel);
    } else {
        // Panel is already set up
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Creates a checkbox element
 * @returns the checkbox element
 */
function addCheckbox() {
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    return checkbox;
}

/**
 * Adds a details element with a checkbox in its summary element
 * @param summaryText: the text displayed on screen
 * @param checkbox: the checkbox to include
 * @returns the added details element
 */
function addDetailsWithCheckbox(summaryText, checkbox) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    details.appendChild(summary);
    summary.textContent = summaryText;
    summary.insertBefore(checkbox, summary.firstChild);
    return details;
}

/**
 * Adds a listener to the checkbox of a menu to select or unselect ALL the child elements checkboxes 
 * @param details: the father details element of the checkbox
 * @param checkbox: the checkbox
 */
function addMenuListener(details, checkbox) {
    checkbox.addEventListener('change', () => {
        let list = details.querySelector('[class$="-list"]');
        for(let child_checkbox of list.querySelectorAll("input"))
            child_checkbox.checked = checkbox.checked;
    });
}

/**
 * Adds a listener to the episode checkbox that blurs or unblurs the corresponding p html element
 * @param checkbox: the checkbox to add the listener to 
 * @param paragraph: the corresponding p HTML element 
 */
function addSpoilerListener(checkbox, paragraph) {
    checkbox.addEventListener('change', () => {
        paragraph.classList.toggle("blur", !checkbox.checked)
    });
}

// Main
const sources = Source_Scan();
const head = document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href  = 'panelStye.css';
link.type = 'text/css';
const spoilerButton = addButton('Spoilers Control', 'spoiler-button');
document.body.appendChild(spoilerButton);
spoilerButton.addEventListener('click', () => {
    setUpPanel();
})