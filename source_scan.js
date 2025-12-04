const CATEGORY_ORDER = [
    "ENT", // Star Trek: Enterprise
    "DIS", // Star Trek: Discovery
    "SNW", // Star Trek: Strange New Worlds
    "TOS", // Star Trek: The Original Series
    "TAS", // Star Trek: The Animated Series
    "TNG", // Star Trek: The Next Generation
    "DS9", // Star Trek: Deep Space Nine
    "VOY", // Star Trek: Voyager
    "LD", // Star Trek: Lower Decks
    "PRO", // Star Trek: Prodigy
    "PIC", // Star Trek: Picard
    "ST", // Star Trek: Short Treks
    "VST", // Star Trek: very Short Treks
    "FLM" // Movies
]

const MOVIE_ORDER = [
    "TOS", // The Original Series
    "TNG", // The Next Generation
    "AR", // Alernate Reality (Kelvin Timeline)
    "Other" // Other
]

// Keeps count of the number of sources each paragraph has, to be used later so that to unblur 
// a paragraph ALL the related sources must be selected
const paragraphSourceCounter = new Map();

/**
 * Scans the page for sources in the main text
 * @returns the sources structure: category > seasons > episodes
 */
function Source_Scan() {
    // mw-content-text is the id for the main text in fandom.org pages
    mainText = document.getElementById("mw-content-text");
    if (mainText) {
        const sources = new Map();
        CATEGORY_ORDER.forEach(category => {
            sources.set(category);
        });

        const p_elements = mainText.querySelectorAll('p');
        p_elements.forEach(p => {
            // Select the <a> elements that link other wiki pages, these are the links to episodes/movies/series
            // that are sources to the current paragraph. The <span> element is the small pop up description
            // that appears when hovering over a source.
            const sourceElements = p.querySelectorAll('a[href^="/wiki/"] > span');
            // No need to check if the paragraphs are already present as it's impossible with the iteration of the p elements

            // Used for paragraphs with more than one source: if ALL the sources are selected (initial = current), then it will show the paragraph
            paragraphSourceCounter.set(p, {initial: 0, current: 0});
            let counter = 0;

            // Handle each source
            sourceElements.forEach(span => {
                // Exlude these two tags that use the same a > span elements as the sources
                if (span.textContent === "edit" || span.textContent === "citation needed") {
                    paragraphSourceCounter.delete(p);
                    return;
                }

                // The sources with no parenthesis in the pop up <span> are entire series, for example: "Star Trek: The Next Generation"
                if (!span.title.includes('(')) {
                    if (!sources.get(span.textContent)) {
                        sources.set(span.textContent, {
                            title: span.title,
                            seasons: []
                        });
                    }
                }
                // The sources with parenthesis in the pop up <span> are single episodes or movies
                else {
                    // The regex separates the episodes from the movies, by checking what is in the parenthesis
                    // Important to have the "x" as well, as in the case of episodes from different series but with the same title
                    // their pop up <span> will have a second parenthesis indicating which series they are from, for example: "Anomaly (DIS) (DIS 4x02)"
                    let episodeData = span.title.match(/\(([^)]*x[^)]*)\)/);
                    // Removes what's between parenthesis to isolate the title
                    let title = span.title.replace(/\s*\([^)]*\)\s*$/, "");

                    // Episode case example: "The Battle (TNG 1x09)"
                    if (episodeData) {
                        let episode = add_episode(episodeData[1], title, sources);
                        episode.paragraph_list.push(p);
                        counter++;
                    }
                    // Movie case example: "Star Trek: First Contact (FLM 08, TNG 2)"
                    else {
                        // Add the category for movies here, as it's a special case
                        if(!sources.get("FLM")) {
                            sources.set("FLM", {
                                title: "Movies",
                                seasons: [] // Actually used for the Era of the movie
                            });
                        }
                        let movieData = span.title.match(/\(([^)]+)\)/)[1]; // "FLM 08, TNG 2"
                        let title = span.title.replace(/\s*\([^)]*\)\s*$/, "");
                        let movie = add_movie(movieData, title, p, sources)
                        movie.paragraph_list.push(p);
                        counter++;
                    }
                }
            });
            paragraphSourceCounter.get(p).initial = counter;
            paragraphSourceCounter.get(p).current = counter;
        })
        // Sort the episode maps to be in episode order
        CATEGORY_ORDER.forEach(abbreviation => {
            if(abbreviation !== "FLM") {
                let category = sources.get(abbreviation);
                if(category) {
                    Object.keys(category.seasons).forEach(season => {
                        let episodeMap = category.seasons[season];
                        category.seasons[season] = new Map([...episodeMap.entries()].sort((a,b) => a[0] - b[0]));
                    })
                }
            }
        })
        return sources;
    }
    return [];
}

/**
 * Adds an episode to the sources structure
 * @param episodeData: string structured like "TNG 1x09"
 * @param title: episode title string
 * @param sources: the sources map 
 * @returns the added episode element in the source structure
 */
function add_episode(episodeData, title, sources) {
    let episodeData_split = episodeData.split(' '); // "TNG" and "1x09"
    let abbreviation = episodeData_split[0]; // "TNG"
    let season_and_episode = episodeData_split[1].split('x'); // "1" and "09"
    let season = season_and_episode[0]; // "1"
    let episode = season_and_episode[1]; // "09"
    let parsedEpisode = parseInt(episode, 10);
    let stringToAdd = `${episode}: ${title}`;

    let category = sources.get(abbreviation);
    if(!category.seasons[season])
        category.seasons[season] = new Map();
    let get_result = category.seasons[season].get(parsedEpisode);
    if(get_result)
        return get_result;
    else {
        category.seasons[season].set(parsedEpisode, {ep_info: stringToAdd, paragraph_list: []});
        return category.seasons[season].get(parsedEpisode);
    }
     //   category.seasons[season].get(parsedEpisode).paragraph_list.push(paragraph);
    // Because all sources are structured like "TNG: "The Battle"", there is no need to check if the
    // category is not present
}

/**
 * Adds a movie to the sources structure
 * @param movieData: string structured like "FLM 08, TNG 2"
 * @param title: movie title string
 * @param sources: the sources map 
 * @returns the added movie element in the sources structure
 */
function add_movie(movieData, title, paragraph, sources) {
    let movieData_split = movieData.split(', '); // "FLM 08" and "TNG 2"
    let movie_era_and_number = movieData_split[1].split(' '); // "TNG" and "2"
    let movie_era = movie_era_and_number[0]; // "TNG"
    let movie_number = movie_era_and_number[1]; // "2"

    let category = sources.get("FLM");
    let index = MOVIE_ORDER.indexOf(movie_era);
    if(!category.seasons[index])
        category.seasons[index] = new Map();
    let get_result = category.seasons[index].get(movie_number);
    if(get_result)
        return get_result;
    else {
        category.seasons[index].set(movie_number, {ep_info: title, paragraph_list: []});
        return category.seasons[index].get(movie_number);
    }
    //  category.seasons[index].get(title).paragraph_list.push(paragraph);
}