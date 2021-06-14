// import "./daw.css"
import {keymaps} from "./keymaps"
// import useKeyPress from "utilities/useKeyPress"
import React from 'react'
import { useSelector } from 'react-redux';
import {Settings} from "./Settings"
import {TrackViewer} from "./TrackViewer"

// import {Notes} from './Notes'
// import {Score, autoScore} from "./Scorer"
// import {reduceNotes} from "./utils"
import {Typography, Container, Grid, Checkbox, FormControlLabel, TextField, InputAdornment} from '@material-ui/core';
import { connect } from 'react-redux';
import api from "../api/apiClient";

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
          <TrackViewer 
              tracks={visibleTracks}
              
              />
        </Grid>
      </Grid>
    </Container>
  } else {
    return "no parents"
  }
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
