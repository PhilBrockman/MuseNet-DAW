
import React, { PureComponent } from 'react'
import { useSelector, connect } from 'react-redux';
import {Container, Grid} from '@material-ui/core';
import {keymaps} from "../utilities/keymaps"
import {Notes} from "./Notes"
import {Settings} from "./Settings"
import {Playhead} from "./Playhead/Playhead"
import {reduceNotes} from "../utilities/utilities"
import {selectParent} from "../layout/generations/parentReducer"
import api from "../api/apiClient";
import "./daw.css"

// import {tracksToJSON, playMidi} from "../utilities/MIDIfier"


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

export const DAWComponent = ({setTracks}) => {
  const DAW = useSelector(state => state.DAW)
  const parentId = useSelector(selectParent)
  const visibleTracks = DAW.tracks.filter(track => track.visible)

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

const DAWcell = ({content, additonalClasses, fixedWidth=false}) => {
  const unitCell = useSelector(state => state.DAW.unitCell)
  // const bpm = useSelector(state => state.DAW.bpm)
  let allClasses = ["daw-cell"];
  if(additonalClasses?.length > 0){
    allClasses = [...allClasses, ...additonalClasses]
  }
  const width= fixedWidth ? 50 : unitCell.oneBeatWidth;
  const height = unitCell.style.height
  return <div className={allClasses.join(" ")} style={{width: `${width}px`, height}}>{content}</div>
}

const BoxColumn = ({header, numKeys}) => {
  return <div className="column">
      <DAWcell content={header} />
      {   Array.from(Array(numKeys).keys()).map(box => <DAWcell key={box}/>)  }
  </div>
}

class DAWBackground extends PureComponent {
  constructor(props){
    super(props)
    const {notes, bpm} = props

    // let minNote = notes.reduce((min, b) => Math.min(min, b.pitch), 10000);
    // let maxNote = notes.reduce((min, b) => Math.max(min, b.pitch), 0);
    let filteredKeys = Object.keys(keymaps)//.filter((item) => (item >= minNote && item <= maxNote))
    let totalLengthInSeconds = Math.ceil(Math.max.apply(Math, notes.map(function(o) { return o.time_on+o.duration; })))
    let numBeats = Math.ceil(totalLengthInSeconds*bpm/60);

    let boxes = Array.from(Array(numBeats).keys())

    let pianoKeys = filteredKeys.map((item, idx) => {
      let c = keymaps[item].includes("#") ? "accidental" : "natural";
      return <DAWcell fixedWidth key={idx} additonalClasses={[c].join(" ")} content={keymaps[item]} />
    })

    let openingColumn = <div className="column">
      <DAWcell fixedWidth />
      {pianoKeys}
    </div>
    
    
    let body = boxes.map((box) => {
      return <BoxColumn key={box} header={box} numKeys={pianoKeys.length}/>
    })

    this.state = {openingColumn, body}
  }

  render(){
    return <>
      <div className="row">
        {this.state.openingColumn}
        {this.state.body}
      </div>
    </>
  }
}

const WorkArea = ({tracks, bpm}) => {
  const notePool = reduceNotes(tracks)
  const unitCellWidth = parseInt(useSelector(state => state.DAW.unitCell.style.width))
  // const midi= tracksToJSON(tracks)

  if(notePool.length === 0) return "Select some tracks to get started";

  const reposition = (n, nodeRef) => {
    nodeRef.current.style.left = `${parseInt(nodeRef.current.style.left || 0)+n}px`
  }

  return <>
  {/* <button onClick={() => playMidi(midi)}>Will this play anthynig???</button> */}
      <div className="daw">
        <DAWBackground notes={notePool} bpm={bpm} />
        <Notes bpm={bpm} />
        <Playhead 
            initialOffset={unitCellWidth}
            reposition={reposition}
            />
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
