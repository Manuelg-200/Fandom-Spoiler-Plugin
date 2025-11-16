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
        for(const category of sources.values()) {
            if(category !== "empty") {
                const categoryDetails = addDetails_and_checkbox(category.title);

                // Seasons for each category
                const seasonList = document.createElement('ul');
                seasonList.className = "season-list";
                Object.keys(category.seasons).forEach(seasonNumber => {
                    const seasonElement = document.createElement('li');
                    seasonList.appendChild(seasonElement);
                    let seasonDetails;
                    if (category === "Movies")
                        seasonDetails = addDetails_and_checkbox(`${seasonNumber} Era`);
                    else
                        seasonDetails = addDetails_and_checkbox(`Season ${seasonNumber}`);
                    seasonElement.appendChild(seasonDetails);

                    // Episodes for each season
                    category.seasons[seasonNumber].forEach(episode => {
                        const episodeList = document.createElement('ul');
                        episodeList.className = "episode-list";
                        seasonDetails.appendChild(episodeList);
                        const episodeElement = document.createElement('li');
                        episodeElement.appendChild(document.createTextNode(episode));
                        add_checkbox(episodeElement);
                        episodeList.appendChild(episodeElement);
                    });
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
 * Adds a details element with a checkbox in its summary element
 * @param summaryText: the text displayed on screen 
 * @returns the added details element
 */
function addDetails_and_checkbox(summaryText) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');    
    summary.textContent = summaryText;
    details.appendChild(summary);
    add_checkbox(summary)
    return details;
}

/**
 * Adds a checkbox input element
 * @param fatherElement: the element that the checkbox is going to be appended to
 */
function add_checkbox(fatherElement) {
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    fatherElement.insertBefore(checkbox, fatherElement.firstChild);
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