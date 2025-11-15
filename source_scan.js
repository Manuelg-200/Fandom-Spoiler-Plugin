/**
 * Scans the page for sources in the main text
 * @returns the sources structure: category > seasons > episodes
 */
function Source_Scan() {
    // mw-content-text is the id for the main text in fandom.org pages
    mainText = document.getElementById("mw-content-text");
    if (mainText) {
        const sources = {};
        const p_elements = mainText.querySelectorAll('p');
        p_elements.forEach(p => {
            // Select the <a> elements that link other wiki pages, these are the links to episodes/movies/series
            // that are sources to the current paragraph. The <span> element is the small pop up description
            // that appears when hovering over a source.
            const sourceElements = p.querySelectorAll('a[href^="/wiki/"] > span');

            // Handle each source
            sourceElements.forEach(span => {
                // Exlude these two tags that use the same a > span elements as the sources
                if (span.textContent === "edit" || span.textContent === "citation needed")
                    return;

                // The sources with no parenthesis in the pop up <span> are entire series, for example: "Star Trek: The Next Generation"
                if (!span.title.includes('(')) {
                    const categoryName = span.title;
                    if (!sources[categoryName]) {
                        sources[categoryName] = {
                            name: categoryName,
                            abbreviation: span.textContent,
                            seasons: {}
                        };
                    }
                }
                // The sources with parenthesis in the pop up <span> are single episodes or movies
                else {
                    // The regex separates the episodes from the movies, by checking what is in the parenthesis
                    // Important to have the "x" as well, as in the case of episodes from different series but with the same title
                    // their pop up <span> will have a second parenthesis indicating which series they are from, for example: "Anomaly (DIS) (DIS 4x02)"
                    const episodeData = span.title.match(/\(([^)]*x[^)]*)\)/);
                    // Episode case example: "The Battle (TNG 1x09)"
                    if (episodeData)
                        add_episode(episodeData[1], sources)
                    // Movie case example: "Star Trek: First Contact (FLM 08, TNG 2)"
                    else {
                        // Add the category for movies here, as it's a special case
                        if(!sources["Movies"]) {
                            sources["Movies"] = {
                                name: "Movies",
                                abbreviation: "FLM",
                                seasons: {} // Actually used for the Era of the movie
                            }
                        }
                        movieData = span.title.match(/\(([^)]+)\)/)[1]; // "FLM 08, TNG 2"
                        add_movie(movieData, sources)
                    }
                }
            });
        })
        return sources;
    }
    return [];
}

/**
 * Adds an episode to the sources structure
 * @param episodeData: string structured like "TNG 1x09"
 * @param sources: the sources structure 
 */
function add_episode(episodeData, sources) {
    let episodeData_split = episodeData.split(' '); // "TNG" and "1x09"
    let abbreviation = episodeData_split[0]; // "TNG"
    let season_and_episode = episodeData_split[1].split('x'); // "1" and "09"
    const season = season_and_episode[0]; // "1"
    const episode = season_and_episode[1]; // "09"
    Object.values(sources).forEach(category => {
        if (category.abbreviation === abbreviation) {
            if (!category.seasons[season]) 
                category.seasons[season] = [];
            if (!category.seasons[season].includes(episode))
                category.seasons[season].push(episode);
        }
        // Because all sources are structured like "TNG: "The Battle"", there is no need to check if the
        // category is not present
    });
}

/**
 * Adds a movie to the sources structure
 * @param movieData: string structured like "FLM 08, TNG 2"
 * @param sources: the sources structure 
 */
function add_movie(movieData, sources) {
    const movieData_split = movieData.split(', '); // "FLM 08" and "TNG 2"
    const movie_number = movieData_split[0].split(' ')[1]; // "08"
    const movie_era = movieData_split[1].split(' ')[0]; // "TNG"
    Object.values(sources).forEach(category =>  {
        if (category.abbreviation === "FLM") {
            if (!category.seasons[movie_era])
                category.seasons[movie_era] = [];
            if (!category.seasons[movie_era].includes(movie_number))
                category.seasons[movie_era].push(movie_number);
        }
    })
}
