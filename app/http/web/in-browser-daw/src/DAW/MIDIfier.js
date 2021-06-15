import { Midi } from '@tonejs/midi'
import * as Tone from 'tone'

export const tracksToJSON = (tracks) => {

  const midi = new Midi()
  tracks.forEach(track => {
    const outTrack = midi.addTrack()
    track.notes.forEach(note => {
      outTrack.addNote({
        midi : note.pitch,
        time : note.time_on,
        duration: note.duration,
      })
    })
  })

  return midi.toJSON()
}


export const playMidi = (currentMidi) => {
  const synths=[]
  if (currentMidi) {
    const now = Tone.now() + 0.5;
    currentMidi.tracks.forEach((track) => {
      //create a synth for each track
      const synth = new Tone.PolySynth(Tone.Synth, {
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: .5,
        },
      }).toDestination();
      synths.push(synth);
      //schedule all of the events
      track.notes.forEach((note) => {
        if( note.duration > 0 ){
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time + now,
          note.velocity
        );
        }
      });
    });
  } else {
    //dispose the synth and make a new one
    while (synths.length) {
      const synth = synths.shift();
      synth.disconnect();
    }
  }
				
}