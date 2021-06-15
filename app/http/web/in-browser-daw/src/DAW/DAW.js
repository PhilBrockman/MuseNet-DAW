import {keymaps} from "../utilities/keymaps"
import {Notes} from "./Notes"
import React from 'react'
import { useSelector } from 'react-redux';
import {Settings} from "./Settings"
import {reduceNotes} from "../utilities/utilities"
import Draggable from 'react-draggable'; // The default

import {Typography, Container, Grid, Checkbox, FormControlLabel, TextField, InputAdornment} from '@material-ui/core';
import { connect } from 'react-redux';
import api from "../api/apiClient";
import "./daw.css"

import {tracksToJSON, playMidi} from "./MIDIfier"

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    setTracks: (item) => dispatch({type: "SET_TRACKS", payload: item}),
  }
};

const fetchTracksById = async (id) => {
  return await api.getTracks(id)
}

export const DAWComponent = ({DAW, setTracks}) => {
  const parent = useSelector(state => state.parent)?.parent

  //update the tracks based on the parent
  React.useEffect(() => {
    console.log("parentChanged")
    if(parent) {
      fetchTracksById(parent._id["$oid"]).then(res => {
        console.log('res.data', res.data)
        setTracks(res.data)
      })
      
    };
  }, [parent])

  const visibleTracks = DAW.tracks.filter(track => track.visible)

  if(parent){
    return <Container>
      <Grid>
        <Grid item>
          <Settings />
        </Grid>
        <Grid item>
          <WorkArea 
              tracks={visibleTracks}
              bpm={DAW.bpm}
              />
        </Grid>
      </Grid>
    </Container>
  } else {
    return "no parents"
  }
}

const DAWBackground = ({notes, bpm, children}) => {
  let minNote = notes.reduce((min, b) => Math.min(min, b.pitch), 10000);
  let maxNote = notes.reduce((min, b) => Math.max(min, b.pitch), 0);
  let filteredKeys = Object.keys(keymaps)//.filter((item) => (item >= minNote && item <= maxNote))
  let totalLengthInSeconds = Math.ceil(Math.max.apply(Math, notes.map(function(o) { return o.time_on+o.duration; })))
  let numBeats = Math.ceil(totalLengthInSeconds*bpm/60);
  let boxes = Array.from(Array(numBeats).keys())

  let pianoKeys = filteredKeys.map((item, idx) => {
    let c = keymaps[item].includes("#") ? "accidental" : "natural";
    return <div className={[c, "keyNote"].join(" ")} key={idx}>{keymaps[item]}</div>
  }).reverse()

  let header = <div className="key-row">
                    <div className="daw-cell"></div>
                    {boxes.map((item, idx) => {
                      return <div className="daw-cell" key={idx}>{idx}</div>
                    })}
                </div>

  let body = filteredKeys.map((item, idx) => {
    let b = boxes.map((item, idx) => {
      return <div
              className={["background-cell", "daw-cell"].join(" ")}
              key={"beats"+idx}></div>
    })
    return <div className="key-row" key={idx}>
      <div className="accidental keyNote">
        {pianoKeys[idx]}
      </div>
      {b}
    </div>
  })
  return <>
    <div >
      {header}
      <div>
        {body}
      </div>
    </div>
  </>
}

const WorkArea = ({tracks, bpm}) => {
  const notePool = reduceNotes(tracks)
  const dawResolution = useSelector(state => state.DAW.dawResolution)
  const [playheadPixels, setPlayheadPixels] = React.useState(dawResolution)

  if(notePool.length === 0) return "Select some tracks to get started";

  const midi= tracksToJSON(tracks)
  console.log('midi', midi)

  return <>
      <div className="daw">
        <button onClick={() => playMidi(midi)}>Will this play anthynig???</button>
        <DAWBackground notes={notePool} bpm={bpm} />
        <Notes tracks={tracks} bpm={bpm} playheadPosition={playheadPixels}/>
        <Playhead 
            setPosition={setPlayheadPixels}
            initialOffset={dawResolution}
            />
      </div>
  </>
}

export const ItemTypes = {
  PLAYHEAD: 'playhead'
}

const Playhead = ({ setPosition, initialOffset}) => {
  const nodeRef = React.useRef(null);
  const style = { cursor: "move" }
  const handleDrag = (e, data) => setPosition(data.lastX)

  return <Draggable 
            axis="x"
            nodeRef={nodeRef}
            onDrag={handleDrag}
            defaultPosition={{x: initialOffset, y: 0}}
            >
            <div className="playhead" 
              style={style}
              ref={nodeRef}
              />
          </Draggable>
}

export const DAW = connect(mapStateToProps, mapDispatchToProps)(DAWComponent);


// const ActiveArea = (props) => {
//   if(props.activeTrack === null || !props.tracks[props.activeTrack].notes || props.tracks[props.activeTrack].notes.length === 0) {return "Select a track"}
//   let notePool = props.allVisible
//                     ? reduceNotes([...props.tracks])
//                     : [...props.tracks[props.activeTrack].notes];
//   console.log("noets", notePool)
//   let minNote = notePool.reduce((min, b) => Math.min(min, b.pitch), notePool[0].pitch);
//   let maxNote = notePool.reduce((min, b) => Math.max(min, b.pitch), notePool[0].pitch);
//   let totalLengthInSeconds = Math.ceil(Math.max.apply(Math, notePool.map(function(o) { return o.time_on+o.duration; })))
//   let numBoxes = Math.round(totalLengthInSeconds*props.bpm/60);
//   console.log(numBoxes)
//   let boxes = Array.from(Array(numBoxes).keys())
//   let filteredKeys = Object.keys(keymaps).filter((item) => (item >= minNote && item <= maxNote))

//   let modifiedStyle = {minWidth:`${props.dawResolution}px`}

//   let header = <div className="key-row">
//                     {boxes.map((item, idx) => {
//                       return <div className="daw-cell" key={idx} style={modifiedStyle}>{idx}</div>
//                     })}
//                 </div>

//   let body = filteredKeys.map((item, idx) => {
//       let b = boxes.map((item, idx) => {
//         return <div
//                   className={["background-cell", "daw-cell"].join(" ")}
//                   key={"beats"+idx}
//                   style={modifiedStyle}></div>
//       })
//       return <div className="key-row" key={idx}>
//         {b}
//       </div>
//   })

//   let pianoKeys = filteredKeys.map((item, idx) => {
//     let c = keymaps[item].includes("#") ? "accidental" : "natural";
//     return <div className={[c, "keyNote"].join(" ")} key={idx}>{keymaps[item]}</div>
//   }).reverse()

//   return <>
//           <Playhead />
//           <div>
//             <div className="accidental keyNote"></div>
//             {pianoKeys}
//           </div>
//           <div className="daw">
//             {header}
//             <div style={{position: "relative"}}>
//               {body}
//               <Notes
//                 minNote={minNote}
//                 offset={maxNote}
//                 {...props} />
//               <Subdivision
//                 numBeats={numBoxes}
//                 subdivision={props.subdivision}
//                 dawResolution={props.dawResolution}
//                 />
//             </div>
//           </div>
//         </>
// }

// const Playhead = (props) => {
//   return <div className="playhead"></div>
// }

// const Subdivision = (props) => {
//   let markers = []
//   for(let i = 0; i < props.numBeats*parseInt(props.subdivision); i++){
//     let subStyle={
//       left: `${props.dawResolution/parseInt(props.subdivision)*i}px`,
//       top: '0px'
//     }
//     markers.push( <div className="subdivision" key={i} style={subStyle}/>   )
//   }
//   return markers
// }
