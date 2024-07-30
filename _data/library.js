const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
    const url = 'https://api.tunepad.space/api/library/track/search';

	/* This returns a promise */
	return EleventyFetch(url, {
		duration: "1d", // save for 1 day
		type: "json", // we’ll parse JSON for you
	});
};