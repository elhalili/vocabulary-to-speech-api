const express = require('express');
const fs = require('fs');
const path = require('path');
const getAudioUrl = require('../modules/getAudioUrl');
const axios = require('axios');
const route = express.Router();

route.post('/', async (req, res) => {

    let {lang1, lang2, data} = req.body;
    // generated audio name
    const name = new Date().getTime();
    const generatedAudio = fs.createWriteStream(`audio/${ name }.mp3`);

    // Audio concating is done
    generatedAudio.on('finish', async () => {
        console.log(`API: generate the file ${name}.mp3`);
        res.json({ url: `http://${ req.headers.host }/api/generate-audio/f/${ name }` });
    });

    generatedAudio.on('error', () => {

        console.log(`API: can not generate the file ${name}.mp3`);
        res.json({ error:  'Can not generate the audio'});
    })

    // pipe the stream into single file
    for (let index in data) {
        const request1 = await axios({
            url: getAudioUrl(data[index][0], {lang: lang1}), 
            responseType: 'stream'
        });
        const request2 = await axios({
            url: getAudioUrl(data[index][1], {lang: lang2}), 
            lang: lang2,
            responseType: 'stream'
        });
        
        // concat mp3 file using stream
        request1.data.pipe(generatedAudio, {end: false});
        // close the stream in the last 
        if (index == data.length - 1) {
            request2.data.pipe(generatedAudio, {end: true});
        } else {
            request2.data.pipe(generatedAudio, {end: false});
        }
    }
});

// get the generated audio
route.get('/f/:name', (req, res, next) => {
    const audioPath = path.join(__dirname.replace('routes', 'audio'), `${req.params.name}.mp3`);
    
    res.on('finish', () => {
        // if success deleted the generated file
        if (res.statusCode !== 404) {
            fs.unlink(audioPath, (err) => {
                if (err) console.log(`API: ${err}`);
                else console.log(`API: The file ${audioPath} has been deleted`)
            });
        }
    });

    // check if file exist
    if (fs.existsSync(audioPath)) {
        res.status(200).sendFile(audioPath);
    } else {
        res.status(404).json( {error: 'The url does not exist'} );
    }

});

module.exports = route;