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
                    const parentContent = span.title.match(/\(([^)]*x[^)]*)\)/);
                    if (parentContent) // Episode case
                        add_episode(parentContent[1], sources)
                    else // Movie case
                        add_movie(span.title, sources)
                }
            });
        })
        return sources;
    }
    return [];
}

function add_episode(parentContent, sources) {
    const parts = parentContent.split(' ');
    const abbreviation = parts[0];
    const episode_data = parts[1].split('x');
    const season = episode_data[0];
    const episode = episode_data[1];
    Object.values(sources).forEach(category => {
        if (category.abbreviation === abbreviation) {
            if (!category.seasons[season]) 
                category.seasons[season] = [];
            if (!category.seasons[season].includes(episode))
                category.seasons[season].push(episode);
        }
    });
}

function add_movie(title, sources) {
    parentContent = title.match(/\(([^)]+)\)/)[1];
    const movie_data = parentContent.split(', ');
    const movie_number = movie_data[0].split(' ')[1];
    const movie_era = movie_data[1].split(' ')[0];
    Object.values(sources).forEach(category =>  {
        if (category.abbreviation === "FLM") {
            if (!category.seasons[movie_era])
                category.seasons[movie_era] = [];
            if (!category.seasons[movie_era].includes(movie_number))
                category.seasons[movie_era].push(movie_era);
        }
    })
}
