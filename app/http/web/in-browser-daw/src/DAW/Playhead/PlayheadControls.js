import {tracksToJSON, playMidi} from "../../utilities/MIDIfier"

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import IconButton from '@material-ui/core/IconButton';

import {useSelector, connector} from "react-redux"

import {store} from "../../rootReducer"
import * as Tone from 'tone'
import React from 'react';


export const PlayheadControls = () => {
  console.log("refereshing playhead contsrols")
  const synths = useSelector(state => state.playhead.synths);
  const playing = useSelector(state => state.playhead.playing);
  const tracks = useSelector(state => state.DAW.tracks)
  const controllerIcon = playing ? <PauseCircleOutlineIcon />: <PlayCircleOutlineIcon />;
  const midi= tracksToJSON(tracks)

  React.useEffect(() => {
    console.log('synths', synths)
  }, [synths])

  const setSynths = (arr) => {
    console.log("setting synths", arr)
    store.dispatch({type: "SET_SYNTHS", payload: arr})
  }

  React.useEffect(() => {
    if(!playing){
      console.log('not playing', synths)
      Tone.Transport.stop();
      synths.forEach(synth => synth.disconnect())
      setSynths([])
    } else {
      if (midi) {
        // setInterval(() => console.log(Tone.now()), 100);
        const now = Tone.now() + 0.5;
        setSynths(midi.tracks.map((track) => {
              //create a synth for each track
              const synth =  new Tone.PolySynth(Tone.Synth, {
                envelope: {
                  attack: 0.02,
                  decay: 0.1,
                  sustain: 0.3,
                  release: .5,
                },
              }).toDestination();

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

              return synth
            })
        )
        Tone.Transport.start();
      }
      // playMidi({currentMidi: midi, playing, synths})
      console.log('playing', synths)
    }
  }, [playing])

  return <IconButton onClick={() => store.dispatch({type: "PLAY/PAUSE"})}>{controllerIcon}</IconButton>
}




// synths.push(synth);
// //schedule all of the events

// console.log("starting transport")
// Tone.Transport.start()