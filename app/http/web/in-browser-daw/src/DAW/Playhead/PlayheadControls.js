import {tracksToJSON} from "../../utilities/MIDIfier"
import {pixelsToSeconds} from "../../utilities/utilities"

import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import IconButton from '@material-ui/core/IconButton';

import {useSelector, connector, ReactReduxContext} from "react-redux"

import {store} from "../../rootReducer"
import * as Tone from 'tone'
import React from 'react';


const setSynths = (arr) => store.dispatch({type: "SET_SYNTHS", payload: arr})

const setSynthsFromMidi = ({midi, position}) =>{
  const now = Tone.now();
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
    console.log('position', position)
    console.log('track.notes', track.notes)

    track.notes.filter(note => note.time > position).forEach((note) => {
      if( note.duration > 0 ){
        synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time + now  - position,
          note.velocity
        );
      }
    });

    return synth
  })
  )
}
export const PlayheadControls = () => {
  console.log("refereshing playhead controls")
  const playhead = useSelector(state => state.playhead)
  console.log('playhead', playhead)
  const {synths, playing, startTime, position} = playhead
  const tracks = useSelector(state => state.DAW.tracks)
  const bpm  = useSelector(state => state.settings.bpm)
  const width = useSelector(state => state.settings.unitCell.oneBeatWidth)
  const controllerIcon = playing ? <PauseCircleOutlineIcon />: <PlayCircleOutlineIcon />;
  const midi= tracksToJSON(tracks)

  React.useEffect(() => {
    if(!playing){
      if(synths.length > 0 ){
        synths.forEach(synth => synth.disconnect())
        setSynths([])
        store.dispatch({type: "SET_START", payload: null})
      }
    } else {
      if (midi && !startTime) {
        store.dispatch({type: "SET_START", payload: Tone.now()})
        setSynthsFromMidi({midi, position: pixelsToSeconds(position, bpm, width)})
      }
    }
  }, [playing, synths, midi])

  return <IconButton onClick={() => store.dispatch({type: "PLAY/PAUSE"})}>{controllerIcon}</IconButton>
}




// synths.push(synth);
// //schedule all of the events

// console.log("starting transport")
// Tone.Transport.start()