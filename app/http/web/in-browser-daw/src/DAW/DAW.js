// import "./daw.css"
import {keymaps} from "./keymaps"
// import useKeyPress from "utilities/useKeyPress"
import React from 'react'
import { useSelector } from 'react-redux';
import {store} from "../reducers/rootReducer"
// import {Notes} from './Notes'
// import {Score, autoScore} from "./Scorer"
// import {reduceNotes} from "./utils"

const Settings=() => "setings"
const TrackViewer = () => "tracks"

// const mapStateToProps = (state) => {
//   return state
// }

export const DAW = ({ }) => {
  const parent = useSelector(state => state.parent)?.parent

  const [bpm, setBPM] = React.useState(120)
  const [dawResolution, setDawResolution] = React.useState(40)
  const [subdivision, setSubdivision] = React.useState(4)
  const [allVisible, setAllVisible] = React.useState(false)

  if(parent){
    return <>
      <div className="grid-container">
        <Settings />
        <TrackViewer />
      </div>
    </>
  } else {
    return "no parents"
  }
}


// export const DAW = connect(mapStateToProps)(DAWComponent)

// const Settings = (props) => {
//   const adjust = (a, b) => parseInt((a + b)*100)/100;
//   useKeyPress('h', () => props.setBPM(adjust(props.bpm, 5)));
//   useKeyPress('t', () => props.setBPM(adjust(props.bpm, .5)));
//   useKeyPress('n', () => props.setBPM(adjust(props.bpm, .05)));
//   useKeyPress('m', () => props.setBPM(adjust(props.bpm, -5)));
//   useKeyPress('w', () => props.setBPM(adjust(props.bpm, -.5)));
//   useKeyPress('v', () => props.setBPM(adjust(props.bpm, -.05)));

//   return <>
//     <div> BPM: {props.bpm} </div>
//     <div><input type="range" min={50} max={200} value={props.bpm} step={.05} onChange={(e) => props.setBPM(e.target.value)} /> </div>
//     <div> Cell width: {props.dawResolution} </div>
//     <div><input type="range" min={30} max={300} value={props.dawResolution} onChange={(e) => props.setDawResolution(e.target.value)} /></div>
//     <div> Subdivision: {props.subdivision} </div>
//     <div><input type="range" min={1} max={8} value={props.subdivision} onChange={(e) => props.setSubdivision(e.target.value)} /></div>
//     <button onClick={() => props.setBPM(autoScore(props.tracks, props.subdivision).tempo.toFixed(2))}>Optimize Tempo</button>
//     <div> Show all: <input type="checkbox" checked={props.allVisible} onChange={(e) => props.setAllVisible(!props.allVisible)} /></div>
//   </>
// }

// const TrackViewer = (props) => {
//   const [activeTrack, setActiveTrack] = React.useState(0);

//   React.useEffect(() => {
//     setActiveTrack(0)
//   }, [props.parentData])

//   let tracks = props.tracks.map((item, idx) => {
//     return <div key={idx} onClick={() => setActiveTrack(idx)}>
//         {item.instrument} | {item.notes.length}
//         </div>//.notes.length
//   })

//   return <>
//     <div className="mini-area">
//       {tracks}
//     </div>
//     <div>
//       <Score {...props}/>
//     </div>
//     <div className="active-area">
//       <ActiveArea
//         activeTrack={activeTrack}
//         {...props}
//         />
//     </div>
//   </>
// }

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
