const url = require('url');
// get audio url of google api
module.exports =  getAudioUrl = (
    text,
    {
        lang = 'en',
        host = 'https://translate.google.com',
        ttsSpeed = 1
    }) => {
    // assert type input
    if (typeof lang !== 'string' || lang.length === 0) {
        throw new TypeError('lang should be a string');
    }

    if (typeof ttsSpeed !== 'number' || ttsSpeed > 1 || ttsSpeed < 0.1) {
    throw new TypeError('ttsSpeed should be a number');
    }

    if (typeof host !== 'string' || host.length === 0) {
    throw new TypeError('host should be a string');
    }

    /*
     * check the length of text
     * [!]: if a length of text exceed 200 it should divide it into small text
     */
    if (text.length > 200) {
        throw new RangeError(
          `text length (${text.length}) should be less than 200 characters.`
        );
    }

    return (
        host +
        '/translate_tts' +
        url.format({
          query: {
            ie: 'UTF-8',
            q: text,
            tl: lang,
            total: 1,
            idx: 0,
            textlen: text.length,
            client: 'tw-ob',
            prev: 'input',
            ttsspeed: ttsSpeed,
          },
        })
    );
}