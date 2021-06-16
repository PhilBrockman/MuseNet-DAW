
import React from 'react'
import { useSelector, connect } from 'react-redux';
import {Container, Grid} from '@material-ui/core';
import {keymaps} from "../utilities/keymaps"
import {Notes} from "./Notes/Notes"
import {Settings} from "./Settings/Settings"
import {Playhead} from "./Playhead/Playhead"
import {reduceNotes} from "../utilities/utilities"

import {DAWvisibleTracks} from "./DAWReducer"
import {BPM} from "./Settings/SettingsReducer"
import {selectParent} from "../layout/generations/parentReducer"
import api from "../api/apiClient";
import "./daw.css"

// import {tracksToJSON, playMidi} from "../utilities/MIDIfier"


const mapStateToProps = state => {
  return state.DAW;
};

const mapDispatchToProps = dispatch => {
  return {
    setTracks: (item) => dispatch({type: "SET_TRACKS", payload: item}),
  }
};

const fetchTracksById = async (id) => {
  return await api.getTracks(id)
}

export const DAWComponent = ({setTracks}) => {
  const parentId = useSelector(selectParent)
  const visibleTracks = useSelector(DAWvisibleTracks)
  console.log("I'm rerendering", visibleTracks)

  const bpm = useSelector(BPM)
  let totalLengthInSeconds = Math.ceil(Math.max.apply(Math, reduceNotes(visibleTracks).map(function(o) { return o.time_on+o.duration; })))

  // return "simplyfier"
  //update the tracks based on the parent
  React.useEffect(() => {
    console.log("parentChanged", parentId)
    if(parentId) {
      fetchTracksById(parentId).then(res => {
        console.log('res.data', res.data)
        setTracks(res.data)
      })
      
    };
  }, [parentId, setTracks])

  if(parentId){
    return <Container>
      <Grid>
        <Grid item>
          <Settings />
        </Grid>
        <Grid item>
          <WorkArea 
              totalLengthInSeconds={totalLengthInSeconds}
              bpm={bpm}
              />
        </Grid>
      </Grid>
    </Container>
  } else {
    return "no parents"
  }
}

const DAWcell = ({content, additonalClasses, fixedWidth=false}) => {
  const unitCell = useSelector(state => state.settings.unitCell)
  let allClasses = ["daw-cell"];
  if(additonalClasses?.length > 0){
    allClasses = [...allClasses, ...additonalClasses]
  }
  const width= fixedWidth ? 50 : unitCell.oneBeatWidth;
  const height = unitCell.height
  return <div className={allClasses.join(" ")} style={{width: `${width}px`, height:`${height}px`}}>{content}</div>
}

const BoxColumn = ({header, numKeys}) => {
  return <div className="column">
      <DAWcell content={header} />
      {   Array.from(Array(numKeys).keys()).map(box => <DAWcell key={box}/>)  }
  </div>
}


const WorkArea = ({bpm, totalLengthInSeconds}) => {
  // const midi= tracksToJSON(tracks)
  if(totalLengthInSeconds <= 0) return "Select tracks"

  const reposition = (n, nodeRef) => {
    nodeRef.current.style.left = `${parseInt(nodeRef.current.style.left || 0)+n}px`
  }

  const filteredKeys = Object.keys(keymaps)

  let numBeats = Math.ceil(totalLengthInSeconds*bpm/60);
  let boxes = Array.from(Array(numBeats).keys())

  let pianoKeys = filteredKeys.map((item, idx) => {
    let c = keymaps[item].includes("#") ? "accidental" : "natural";
    return <DAWcell fixedWidth key={idx} additonalClasses={[c].join(" ")} content={keymaps[item]} />
  })

  let body = boxes.map((box) => {
    return <BoxColumn key={box} header={box} numKeys={pianoKeys.length}/>
  })

  return <>
  {/* <button onClick={() => playMidi(midi)}>Will this play anthynig???</button> */}
      <div className="daw">
        <DAWBackground body={body} pianoKeys={pianoKeys} />
        <Notes bpm={bpm} />
        <Playhead reposition={reposition}/>
      </div>
  </>
}

const DAWBackground = ({pianoKeys, body})=> {
    console.log('repainting daw background')
    return <>
      <div className="row">
        <div className="column">
          <DAWcell fixedWidth />
          {pianoKeys}
        </div>
        {body}
      </div>
    </>
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
