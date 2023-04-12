//z mongoose shranjujemo v lokalno monodb bazo
// npm run devStart
const express = require('express')
const MidiWriter = require('midi-writer-js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Song = require('./models/song.js')
const app = express()

//socket

mongoose.connect('mongodb://localhost/songRecorder', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs') //knjizica ejs
app.use(express.json()) //da uporabljamo json v aplikacijo
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index') //route setup za stran
})

app.post('/songs', async (req, res) => {
  const song = new Song({
    notes: req.body.songNotes, //pushas note v server (request, response)
    songName: req.body.songName //določimo naslov pesmi
  })

  console.log(req.body.songName)

  await song.save()

  res.json(song)
})


app.get('/songs/:id', async (req, res) => {
  let song
  try {
    song = await Song.findById(req.params.id)
  } catch (e) {
    song = undefined
  }
  res.render('index', { song: song }) //posljemo naso pesem na glavno stran
})

//preveri da pesem ni ista
app.post('/songs', async (req, res) => {
  const existingSong = await Song.findOne({ notes: req.body.songNotes });

  if (existingSong) {
    // If a song with the same notes already exists, return it instead of creating a new one
    res.json(existingSong);
  } else {
    const song = new Song({
      notes: req.body.songNotes //pushas note v server (request, response)
    });

    await song.save();

    res.json(song);
  }
});

app.get('/songs', async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});

//midi
function roundToNearest(num) {
  const diffs = [1, 2, 4].map(val => Math.abs(num - val));
  const minDiff = Math.min(...diffs);
  const index = diffs.indexOf(minDiff);
  return [1, 2, 4][index];
}

app.post('/shrani', async (req, res) => {
  const songNotes = req.body.songNotes;

  //kreira midi track
  const track = new MidiWriter.Track();

  //doda note na track
  /*for (const note of songNotes) {
    track.addEvent(
      new MidiWriter.NoteEvent({
        [new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
		    new MidiWriter.NoteEvent({pitch: ['C4'], duration: '2'})]
      },  function(event, index) {
        return {sequential: true};)
    );
  }*/
  track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
  track.setTempo(135, 0);
/*
  track.addEvent([
		new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
		new MidiWriter.NoteEvent({pitch: ['C4'], duration: '2'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'}),
    new MidiWriter.NoteEvent({pitch: ['E4','D4'], duration: '4'})
	], function(event, index) {
    return {sequential: true};
  }
);*/

for (let i = 0; i < songNotes.length; i++) {
  //Console.log(songNotes[i].key);
  let trajanje=roundToNearest(Math.floor(songNotes[i].startTime / 1000));
  console.log(trajanje);
  track.addEvent([
		new MidiWriter.NoteEvent({pitch: [`${songNotes[i].key}`], duration: [`${trajanje}`]})
	], function(event, index) {
    return {sequential: true};
  }
);
}

  //ustvari novo midi datoteko z trackom
  const write = new MidiWriter.Writer([track]);

  //odgovor za prenos midija
  res.setHeader('Content-Type', 'audio/midi');
  res.setHeader('Content-Disposition', `attachment; filename="song.mid"`);

  //posle midi file clientu
  
  console.log(Buffer.from(write.buildFile()));
  res.send(Buffer.from(write.dataUri()));
});

//piano roll	



app.listen(5000)