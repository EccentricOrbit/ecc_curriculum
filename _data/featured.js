const EleventyFetch = require("@11ty/eleventy-fetch");
const fs = require("node:fs");

const HOST = "tunepad.com";
const API_HOST = "api." + HOST + "/api";
const FEATURED_SRC = "_data/featured-projects.json";


/**
 * Build the database for featured projects
 */
module.exports = async function () {
    const fdata = JSON.parse(fs.readFileSync(FEATURED_SRC, 'utf8'));
    const c = await compileFeaturedProjects(fdata.covers);
    const o = await compileFeaturedProjects(fdata.originals);
    return { covers : c, originals : o };
}


async function compileFeaturedProjects(projects) {
    const route = "https://" + API_HOST + "/projects";

    let collection = [];

    // use an await for loop to make sure that all data is loaded before we continue
    for await (let f of projects) {
        try {
            const url = `${route}/${f.id}/`;
            /*
            const resp = await fetch(url);
            const data = await resp.json();
            */
            const data = await EleventyFetch(url, {
                duration: "1d", // save for 1 day in the .cache folder
                type: "json"
            });
            delete data.tracks;

            data.url = 'https://' + HOST + `/project/${f.id}${ f.tracks ? '#tracks' : ''}`;
            if (data.artwork) data.color = "transparent";
            if (!data.deleted && !data.collaborative && data.visibility === "shareable") {
                collection.push({ ...data, ...f });
            }
        }
        catch (err) {
            console.log(`Error downloading project data ${f.id}`);
        }
    }
    return collection;
}
