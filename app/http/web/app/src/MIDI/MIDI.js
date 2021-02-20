import usePromise from "utilities/usePromise"
import { Midi } from '@tonejs/midi'
import * as Tone from 'tone'


const loadMidi = (api, item, overwrite) => {
  return api.getMediaForGeneration(item, overwrite)
}

const MIDIPlayer = (props) => {
  const [currentMidi] = usePromise(Midi.fromUrl(props.filename))
  let playing = false;
  const synths = [];
  const play = (e) => {
    playing = !playing
    console.log(">>>", playing)
					if (playing && currentMidi) {
						const now = Tone.now() + 0.5;
						currentMidi.tracks.forEach((track) => {
							//create a synth for each track
							const synth = new Tone.PolySynth(Tone.Synth, {
								envelope: {
									attack: 0.02,
									decay: 0.1,
									sustain: 0.3,
									release: 1,
								},
							}).toDestination();
							synths.push(synth);
							//schedule all of the events
							track.notes.forEach((note) => {
                if(note.duration > 0){
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
  return currentMidi ? <button onClick={(e) => play(e)}>Play</button> : "loading"
}

export const MIDIer = (props) => {
  const [result] = usePromise(loadMidi(props.api, props.item, false))

  if(result){
    if(result.data[0]){
      let filename = props.api.BASE_URI + "/midifiles/"+result.data[0].midi_location
      return <MIDIPlayer filename={filename} />
    } else {
      return <>loading...</>
    }
  } else {
    return <>uh oh...</>
  }
}
