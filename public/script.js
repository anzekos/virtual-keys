/*
    queryselectorall vrne vse, ki se ujemajo
    eventlistener bo za vsak klik na tipko zagnal funkcijo Igraj
    currenttime zresetira file na zacetek
*/

const BELE_TIPKE = ['y', 'x', 'c', 'v', 'b', 'n', 'm', 'Y', 'X', 'C', 'V', 'B', 'N', 'M'];
const CRNE_TIPKE = ['s', 'd', 'g', 'h', 'j', 'S', 'D', 'G', 'H', 'J'];

const snemalniGumb = document.querySelector('.snemalni-gumb');
const predvajajGumb = document.querySelector('.predvajaj-gumb');
const shraniGumb = document.querySelector('.shrani-gumb');
const deliPesem = document.querySelector('.deli-pesem');
const tipke = document.querySelectorAll('.tipka');
const beleTipke = document.querySelectorAll('.tipka.bela');
const crneTipke = document.querySelectorAll('.tipka.crna');
const crkeGumb = document.getElementById('toggle');

const menu = document.querySelector('#menu');
const menuLinks = document.querySelector('.menu-links');
const songList = document.querySelector('#song-list');

const akordiGumb = document.getElementById('akordGumb');
const chords = {};
const minAliMaj = document.getElementById('toggleID');

const tipkeMap = [...tipke].reduce((map, key) => {
  map[key.dataset.note] = key;
  return map;
}, {})

let notes = [];
let zacetniCasSnemanja;
let songNotes = currentSong && currentSong.notes;

let akordNacinAktiviran = false;


tipke.forEach(key => {
  key.addEventListener('click', () => igrajNoto(key))
})

if (snemalniGumb) {
  snemalniGumb.addEventListener('click', preklopNaSnemanje);
}
if (shraniGumb) {
  shraniGumb.addEventListener('click', shraniPesem);
}
predvajajGumb.addEventListener('click', igrajPesem);

document.addEventListener('keydown', e => {
  if (e.repeat) return;
  const key = e.key;
  const belaTipkaIndex = BELE_TIPKE.indexOf(key);
  const crnaTipkaIndex = CRNE_TIPKE.indexOf(key);

  if (belaTipkaIndex > -1) 
    igrajNoto(beleTipke[belaTipkaIndex]);
  if (crnaTipkaIndex > -1) 
    igrajNoto(crneTipke[crnaTipkaIndex]);
})

function preklopNaSnemanje() {
  snemalniGumb.classList.toggle('pritisnjena');
  if (trenutnoSnema()) {
    zacetekSnemanja();
  } else {
    nehajSnemat();
  }
}

function trenutnoSnema() {
  return snemalniGumb != null && snemalniGumb.classList.contains('pritisnjena');
}

const minMaj = document.querySelector('.sliderToggle');
const gumbZaAkorde = document.getElementById('akordGumb');
gumbZaAkorde.addEventListener('click', () => {
  akordNacinAktiviran = !akordNacinAktiviran;
  if (akordNacinAktiviran == false) {
    gumbZaAkorde.innerText = 'Akordi';
    minMaj.style.display = 'none';
  }
  else {
    gumbZaAkorde.innerText = 'Normalno';
    minMaj.style.display = 'block';
  }
  gumbZaAkorde.classList.toggle('active', akordNacinAktiviran);
});


function zacetekSnemanja() {
  zacetniCasSnemanja = Date.now();
  songNotes = [];
  predvajajGumb.classList.remove('prikazi');
  shraniGumb.classList.remove('prikazi');
}

function nehajSnemat() {
  igrajPesem();
  predvajajGumb.classList.add('prikazi');
  shraniGumb.classList.add('prikazi');
  //akordiGumb.style.display = 'none';
}

function igrajPesem() {
  if (songNotes.length === 0) return;
  songNotes.forEach(note => {
    setTimeout(() => {
      igrajNoto(tipkeMap[note.key]);
    }, note.startTime)
  });
}

function getChord(note) {
  if (minAliMaj.checked) {
    const chords = {
      'C2': ['C2', 'E2', 'G2'],
      'Db2': ['Db2', 'F2', 'Ab2'],
      'D2': ['D2', 'Gb2', 'A2'],
      'Eb2': ['Eb2', 'G2', 'Bb2'],
      'E2': ['E2', 'Ab2', 'B2'],
      'F2': ['F2', 'A2', 'C3'],
      'Gb2': ['Gb2', 'Bb2', 'Db3'],
      'G2': ['G2', 'B2', 'D3'],
      'Ab2': ['Ab2', 'C3', 'Eb3'],
      'A2': ['A2', 'Db3', 'E3'],
      'Bb2': ['Bb2', 'D3', 'F3'],
      'B2': ['B2', 'Eb3', 'Gb3']
    };
    console.log('maj');
    console.log(chords[note]);
    return chords[note] || [note];
  }
else{
    const chords = {
      'C2': ['C2', 'Eb2', 'G2'],
      'Db2': ['Db2', 'E2', 'Ab2'],
      'D2': ['D2', 'F2', 'A2'],
      'Eb2': ['Eb2', 'Gb2', 'Bb2'],
      'E2': ['E2', 'G2', 'B2'],
      'F2': ['F2', 'Ab2', 'C3'],
      'Gb2': ['Gb2', 'A2', 'Db3'],
      'G2': ['G2', 'Bb2', 'D3'],
      'Ab2': ['Ab2', 'B2', 'Eb3'],
      'A2': ['A2', 'C2', 'E3'],
      'Bb2': ['Bb2', 'Db3', 'F3'],
      'B2': ['B2', 'D3', 'Gb3']
    };
    console.log('min');
    return chords[note] || [note];
  }
 // return chords[note] || [note]; //vrne akord glede na root noto, ali pa samo noto če akord ni definiran
}

function igrajNoto(key) {
  if (trenutnoSnema()) snemajNote(key.dataset.note);

  if (akordNacinAktiviran) {
    const chord = getChord(key.dataset.note); //dobimo akord glede na noto
    chord.forEach(note => { //nota v akordih
      const noteAudio = document.getElementById(note);
      noteAudio.currentTime = 0;
      noteAudio.play();
      tipkeMap[note].classList.add('pritisnjena');
      noteAudio.addEventListener('ended', () => {
        tipkeMap[note].classList.remove('pritisnjena');
      });
    });
  } else {
    //posamezne note
    const noteAudio = document.getElementById(key.dataset.note);
    noteAudio.currentTime = 0;
    noteAudio.play();
    key.classList.add('pritisnjena');
    noteAudio.addEventListener('ended', () => {
      key.classList.remove('pritisnjena');
    });
  }
}


crkeGumb.addEventListener('change', () =>{
  let skrijPrikazi = document.querySelectorAll('.bp, .cp')
  //console.log(elements);
  if(crkeGumb.checked){
    skrijPrikazi.forEach(function(skrijPrikazi) {
      skrijPrikazi.style.display = 'block';
   });
  }
  else{
    skrijPrikazi.forEach(function(skrijPrikazi) {
      skrijPrikazi.style.display = 'none';
   });
  }
});

//vsi elementi zvoknote
const volumeSlider = document.querySelector('.volumen-slider');
const audioElements = document.querySelectorAll('.zvokNote');

volumeSlider.addEventListener('input', () => {
  audioElements.forEach((audio) => {
    audio.volume = volumeSlider.value;
  });
});

function snemajNote(note) {
  songNotes.push({
    key: note,
    startTime: Date.now() - zacetniCasSnemanja
  });
  notes.push({
    key: note,
    startTime: Date.now() - zacetniCasSnemanja
  });

  if (akordNacinAktiviran==true) {
    const currentTime = Date.now() - zacetniCasSnemanja;
    const chord = getChord(note);
    const chordNotes = chord.map(n => ({ key: n, startTime: currentTime }));
  
    songNotes.push(...chordNotes);
  }
}

function shraniPesem() {
  const songName = prompt('Shrani pesem kot');
  console.log(songName);
  axios.post('/songs', { songName: songName, songNotes: songNotes }).then(res => {


    deliPesem.classList.add('prikazi');
    deliPesem.href = `/songs/${res.data._id}`;

    dodajLinkPesmiMenu(res.data._id); //dodamo novo pesem v menu
    tomidi();
    console.log(res.data)
  });
}

const naloziMidi = document.getElementById("naloziMidi");

function tomidi() {
  axios.post('/shrani', { songNotes: songNotes }).then(res => {
    debugger;
    
    const blob = new Blob([res.data], { type: 'audio/midi' });
    const fileUrl = URL.createObjectURL(blob);
    
    naloziMidi.addEventListener('click', () => {
    const down = document.createElement('a');
    down.href = res.data;
    down.download = 'file.mid';
    document.body.appendChild(down);
    down.click();
    URL.revokeObjectURL(fileUrl);
    });
  });
}


//funkcije za menu

menu.addEventListener('click', () => {
  menuLinks.classList.toggle('active');
});

// dodamo link v menu
function dodajLinkPesmiMenu(songId) {
  axios.get('/songs').then(res => {
    const songs = res.data;
    const song = songs.find(song => song._id === songId);

    if (song) {
      console.log(song.songName);
      const link = document.createElement('a');
      link.href = `/songs/${song._id}`;
      link.textContent = `${song.songName}`;
      songList.appendChild(link);
    }
  });
}

//naložimo obstoječe pesmi in linke v meni
axios.get('/songs').then(res => {
  const songs = res.data;

  //sortiramo po datumu
  songs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  songs.forEach((song, index) => {
    const link = document.createElement('a');
    link.href = `/songs/${song._id}`;
    link.textContent = `${song.songName}`;
    songList.insertBefore(link, songList.firstChild);
  });
});

//loop
let loopIntervalId = null; // variable to hold the loop interval ID
let loopRunning = false; // variable to track whether the loop is running or not
const loopButton = document.getElementById('loopButton');

loopButton.addEventListener('click', () => {
  if (!loopRunning) {
    igrajPesem(); // play the song immediately when starting the loop
    loopIntervalId = setInterval(igrajPesem, songNotes[songNotes.length - 1].startTime + 500); //nastavimo interval za ponovitev pesmi po celotnem trajanju + nekaj časa za polnjenje
    loopRunning = true;
    loopButton.textContent = "Ustavi Loop";
  } else {
    clearInterval(loopIntervalId); //sprostimo interval
    loopRunning = false;
    loopButton.textContent = "Začni Loop";
  }
});

//platforma za gumbe
const toggleButton = document.getElementById("toggle-button");
const platform = document.getElementById("platform");

toggleButton.addEventListener("click", function() {
  platform.classList.toggle("active");
  if (platform.classList.contains("active")) {
    toggleButton.textContent = "⇑";
    platform.style.visibility = "visible";
  } else {
    toggleButton.textContent = "⇓";
    //skrijemo platformo po tranziciji
    platform.addEventListener("transitionend", function() {
      platform.style.visibility = "hidden";
    }, { once: true });
  }
});

//sprememba zvoka
const spremembaZvokaGumb = document.getElementById("spremeniZvok");
let currentSoundIndex = 0;

const soundDirectories = [
  "/tones/klavir/",
  "/tones/kitara/",
  "/tones/edm/",
  "/tones/bobni/"
];

const imenaZvokov = [
  "Klavir",
  "Kitara",
  "Synth",
  "Bobni"
]

spremembaZvokaGumb.addEventListener("click", function() {
  //zvišamo indeyx za pomike v arrayu
  currentSoundIndex++;
  console.log(soundDirectories[currentSoundIndex]);
  
  //če je več kot dejanskih zvokov ga resetiramo na 0
  if (currentSoundIndex >= soundDirectories.length) {
    currentSoundIndex = 0;
  }

  spremembaZvokaGumb.innerText = imenaZvokov[currentSoundIndex];
  
  //loopa cez vse audio elemente da spremeni src
  const zvokEl = document.querySelectorAll("audio");
  zvokEl.forEach(element => {
    const note = element.getAttribute("id");
    element.setAttribute("src", `${soundDirectories[currentSoundIndex]}${note}.mp3`);
  });
});



/*

const BLOCK_WIDTH = 40;
const BLOCK_HEIGHT = 20;
const NOTES = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const notes = [];

function drawNotes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < songNotes.length; i++) {
    let note = songNotes[i].key;
    let row = NOTES.indexOf(note);
    let x = i * BLOCK_WIDTH;
    let y = canvas.height - (row + 1) * BLOCK_HEIGHT;
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, BLOCK_WIDTH, BLOCK_HEIGHT);
  }
}


document.addEventListener("keydown", function(event) {
  let note = "";
  switch (event.keyCode) {
    case 65:
      note = "C2";
      break;
    case 87:
      note = "C#2";
      break;
    case 83:
      note = "D2";
      break;
    case 69:
      note = "D#2";
      break;
    case 68:
      note = "E2";
      break;
    case 70:
      note = "F2";
      break;
    case 84:
      note = "F#2";
      break;
    case 71:
      note = "G2";
      break;
    case 89:
      note = "G#2";
      break;
    case 72:
      note = "A2";
      break;
    case 85:
      note = "A#2";
      break;
    case 74:
      note = "B2";
      break;
    case 75:
      note = "C3";
      break;
    case 79:
      note = "C#3";
      break;
    case 76:
      note = "D3";
      break;
    case 80:
      note = "D#3";
      break;
    case 186:
      note = "E3";
      break;
    case 222:
      note = "F3";
      break;
    default:
      break;
  }
  if (note !== "") {
    snemajNote(note);
  }
});

//const possibleNotes = ["C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3"];
*/

/*
//import MidiWriter from 'C:/Users/kosan/Documents/Šola/Matura/Virtual Keys/node_modules/midi-writer-js/browser/midiwriter.js';

// Get the download button element
const downloadBtn = document.getElementById('download-btn');

// Add a click event listener to the download button
downloadBtn.addEventListener('click', () => {
  // Convert the recorded notes to a MIDI file
  const midiFile = createMidiFile(songNotes);
  
  // Download the MIDI file
  downloadMidiFile(midiFile);
});

// Function to download the MIDI file
function downloadMidiFile(midiFile) {
  // Create a Blob object from the MIDI file data
  const blob = new Blob([midiFile], {type: 'audio/midi'});
  
  // Create a URL for the Blob object
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link element to download the file
  const link = document.createElement('a');
  link.href = url;
  link.download = 'my-midi-file.mid';
  
  // Append the link element to the document body
  document.body.appendChild(link);
  
  // Click the link to download the file
  link.click();
  
  // Remove the link element from the document body
  document.body.removeChild(link);
}
*/