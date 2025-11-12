function setUpPanel(spoilerUI_Button) {
    spoilerUI_Button.addEventListener('click', () => {
        let panel = document.getElementById('spoiler-control-panel');
        if(!panel) {
            // Add the panel itself
            panel = document.createElement('div');
            panel.id = 'spoiler-control-panel';
            panel.style.position = 'fixed';
            panel.style.top = '46px';
            panel.style.right = '0';
            panel.style.width = '20%';
            panel.style.height = '100%';
            panel.style.backgroundColor = 'white';
            panel.style.zIndex = '9999';
            panel.style.display = 'block';
            panel.style.overflowY = 'auto';

            // Add a close button for the panel
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.position = 'relative';
            closeButton.style.left = '80%';
            closeButton.addEventListener('click', () => {
                panel.style.display = 'none';
            });
            panel.appendChild(closeButton);

            // Fill the panel with the categories, seasons and episodes
            Object.values(sources).forEach(category => {
                const categoryDetails = document.createElement('details');
                const categorySummary = document.createElement('summary');
                categorySummary.textContent = category.name;
                categoryDetails.appendChild(categorySummary);

                const seasonList = document.createElement('ul');
                Object.keys(category.seasons).forEach(season => {
                    const seasonDetails = document.createElement('details');
                    const seasonSummary = document.createElement('summary');
                    seasonSummary.textContent = `Season ${season}`;
                    seasonDetails.appendChild(seasonSummary);
                    seasonList.appendChild(seasonDetails);

                    category.seasons[season].forEach(episode => {
                        const episodeElement = document.createElement('li');
                        episodeElement.appendChild(document.createTextNode(episode));
                        seasonDetails.appendChild(episodeElement);
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
    const spoilerUI_Button = document.createElement('Button');
    spoilerUI_Button.textContent = 'Spoilers control';
    
    // Style the button to fix it to the right edge
    spoilerUI_Button.style.position = 'fixed';
    spoilerUI_Button.style.top = '20%';
    spoilerUI_Button.style.right = '0';
    spoilerUI_Button.style.zIndex = '9998';

    spoilerUI_Button.style.cursor = 'pointer';

    document.body.appendChild(spoilerUI_Button);

    setUpPanel(spoilerUI_Button);
}

const sources = sources_Scan();
addSpoilerButton();