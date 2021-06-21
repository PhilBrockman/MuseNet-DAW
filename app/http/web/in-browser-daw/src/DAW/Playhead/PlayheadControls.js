import {tracksToJSON, playMidi} from "../../utilities/MIDIfier"

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import IconButton from '@material-ui/core/IconButton';

import {useSelector} from "react-redux"

import {store} from "../../rootReducer"
import * as Tone from 'tone'

export const PlayheadControls = () => {
  const playing = useSelector(state => state.playhead.playing);
  const tracks = useSelector(state => state.DAW.tracks)
  const controllerIcon = playing ? <PauseCircleOutlineIcon />: <PlayCircleOutlineIcon />;

  const midi= tracksToJSON(tracks)
  const synths=[]
  if(!playing){
    Tone.Transport.pause();
    console.log('synths', synths)
    while (synths.length) {
      const synth = synths.shift();
      synth.disconnect();
    }
  } else {
    if (midi) {
      console.log("midi-ing")
      const now = Tone.now() + 0.5;
      midi.tracks.forEach((track) => {
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
    }
    // playMidi({currentMidi: midi, playing, synths})
    console.log('playing', synths)
  }
  return <IconButton onClick={() => store.dispatch({type: "PLAY/PAUSE"})}>{controllerIcon}</IconButton>
}
