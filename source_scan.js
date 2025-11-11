function sources_Scan() {
    mwContentText = document.getElementById("mw-content-text");
    if (mwContentText) {
        const sources = {};
        const p_elements = mwContentText.querySelectorAll('p');
        p_elements.forEach(p => {
            const sourceElements = p.querySelectorAll('a[href^="/wiki/"] > span');
            sourceElements.forEach(span => {
                if (span.textContent === "edit" || span.textContent === "citation needed")
                    return;
                if (!span.title.includes('(')) {
                    const category = span.title;
                    if (!sources[category]) {
                        sources[category] = {
                            name: category,
                            abbreviation: span.textContent,
                            seasons: {}
                        }
                    }
                }
                else {
                    const episode = span.title;
                    const parentContent = span.title.match(/\(([^)]+)\)/)[1];
                    const parts = parentContent.split(' ');
                    const currentAbbreviation = parts[0];
                    const seasonEpisode = parts[1].split('x');
                    const currentSeason = seasonEpisode[0];
                    const currentEpisode = seasonEpisode[1];
                    Object.values(sources).forEach(category => {
                        if (category.abbreviation === currentAbbreviation) {
                            if (!category.seasons[currentSeason]) 
                                category.seasons[currentSeason] = [];
                            if (!category.seasons[currentSeason].includes(currentEpisode))
                                category.seasons[currentSeason].push(currentEpisode);
                        }
                    });
                }
            });
        })
        return sources;
    }
    return [];
}
