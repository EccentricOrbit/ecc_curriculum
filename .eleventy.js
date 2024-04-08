const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { execSync } = require('child_process');
const fs = require("node:fs");

const HOST = "https://tunepad.com";

const API_HOST = "https://api.tunepad.com/api";

// where to read and write the featured projects database
const FEATURED_DST = "_data/featured.json";
const FEATURED_SRC = "_data/featured-projects.json";



module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight, {
        alwaysWrapLineHighlights: true,
    });
    eleventyConfig.addPassthroughCopy({ "assets/js" : "js" });
    eleventyConfig.addPassthroughCopy({ "assets/css" : "css" });
    eleventyConfig.addPassthroughCopy({ "assets/sounds" : "sounds" });
    eleventyConfig.addPassthroughCopy({ "assets/images" : "images" });
    eleventyConfig.addPassthroughCopy({ "assets/webfonts" : "webfonts" });
    eleventyConfig.addPassthroughCopy({ "playground/build" : "js" });

    eleventyConfig.on('eleventy.before', async () => {
        await loadFeaturedProjects();
    } );


    eleventyConfig.on('eleventy.after', () => {
        execSync(`npx pagefind --site _site --glob \"**/*.html\"`, { encoding: 'utf-8' })
    });

    // limit filter
    eleventyConfig.addFilter("limit", function(array, limit) {
        return array.slice(0, limit);
    });
};




//---------------------------------------------------------
// Build the database for featured projects
//---------------------------------------------------------
async function loadFeaturedProjects() {
    try {

        // refresh at most once every 10 minutes
        if (needsUpdate(FEATURED_DST, 1000 * 60)) {
            console.log("Time to rebuild the featured project database.");
            const fdata = JSON.parse(fs.readFileSync(FEATURED_SRC, 'utf8'));

            // write file to _data directory
            const c = await compileFeaturedProjects(fdata.covers);
            const o = await compileFeaturedProjects(fdata.originals);
            fs.writeFileSync(FEATURED_DST, JSON.stringify({ covers : c, originals : o }, null, 4));
        }
    }
    catch (err) {
        console.log(`Error loading ${FEATURED_SRC}`);
        console.log(err);
    }
}


function needsUpdate(path, stale) {
    try {
        if (fs.existsSync(path)) {
            const fstats = fs.lstatSync(path);
            const delta = Date.now() - fstats.mtimeMs;
            return (delta > stale);
        }
    }
    catch (err) {
        console.log(err);
    }
    return true;
}


async function compileFeaturedProjects(projects) {
    const route = API_HOST + "/projects";

    let collection = [];

    // use an await for loop to make sure that all data is loaded before we continue
    for await (let f of projects) {
        try {
            const resp = await fetch(`${route}/${f.id}/`);
            const data = await resp.json();
            delete data.tracks;

            data.url = HOST + `/project/${f.id}${ f.tracks ? '#tracks' : ''}`;
            if (data.artwork) data.color = "transparent";
            if (!data.deleted && !data.collaborative && data.visibility === "shareable") {
                collection.push({ ...data, ...f });
            }
        }
        catch (err) {
            console.log(`Error downloading project data ${id}`);
        }
    }
    return collection;
}