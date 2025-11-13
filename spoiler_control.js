function setUpPanel(spoilerUI_Button) {
    spoilerUI_Button.addEventListener('click', () => {
        let panel = document.getElementById('spoiler-control-panel');
        if(!panel) {
            // Add the panel itself
            panel = document.createElement('div');
            panel.className = "spoiler-control-panel";
            panel.id = 'spoiler-control-panel';

            // Add a close button for the panel
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.className = "close-button";
            closeButton.addEventListener('click', () => {
                panel.style.display = 'none';
            });
            panel.appendChild(closeButton);

            // Fill the panel with the categories, seasons and episodes
            Object.values(sources).forEach(category => {
                const categoryDetails = addDetails_and_checkbox(category.name)
                const seasonList = document.createElement('ul');
                Object.keys(category.seasons).forEach(season => {
                    const seasonElement = document.createElement('li');
                    seasonList.appendChild(seasonElement);
                    const seasonDetails = addDetails_and_checkbox(`Season ${season}`);
                    seasonElement.appendChild(seasonDetails);
                    category.seasons[season].forEach(episode => {
                        const episodeList = document.createElement('ul');
                        seasonDetails.appendChild(episodeList);
                        const episodeElement = document.createElement('li');
                        episodeElement.appendChild(document.createTextNode(episode));
                        add_checkbox(episodeElement);
                        episodeList.appendChild(episodeElement);
                    });
                });
                categoryDetails.appendChild(seasonList);
                panel.appendChild(categoryDetails);
            })

            document.body.appendChild(panel);
        } else {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    });
}

function addSpoilerButton() {
    const spoiler_button = document.createElement('Button');
    spoiler_button.textContent = 'Spoilers control';
    spoiler_button.className = "spoiler-button";
    document.body.appendChild(spoiler_button);
    setUpPanel(spoiler_button);
}

function addDetails_and_checkbox(summaryText) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');    
    summary.textContent = summaryText;
    details.appendChild(summary);
    add_checkbox(summary)
    return details;
}

function add_checkbox(fatherElement) {
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    fatherElement.insertBefore(checkbox, fatherElement.firstChild);
}

const sources = sources_Scan();
const head = document.getElementsByTagName('head')[0];
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href  = 'panelStye.css';
link.type = 'text/css';
addSpoilerButton();