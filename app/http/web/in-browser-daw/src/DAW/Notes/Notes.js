import React, { PureComponent } from 'react';
import {useSelector, connect} from "react-redux"
import Draggable from 'react-draggable'
import {pixelsToSeconds, secondsToBeats, beatsToSeconds} from "../../utilities/utilities"
import {Rnd} from 'react-rnd';
import {getUnitCell} from "../Settings/SettingsReducer"
import {DAWvisibleTracks} from "../DAWReducer"
import "./Notes.css"

let COLORS = ["red", "blue", "green"]

const mapStateToProps = state => {
  return state.DAW;
};

const mapDispatchToProps = dispatch => {
  return {
    changeNote: (item) => dispatch({type: "CHANGE_NOTE", payload: item}),
  }
};

const snapToGrid = (seconds, bpm, divisions) => {
  const beats = secondsToBeats(seconds, bpm)
  const rounded = Math.round(beats*divisions)/divisions
  const secs = beatsToSeconds(rounded, bpm)
  // console.log({seconds, beats, rounded, secs})
  return [secs, secs-seconds]
}

export const NotesComponent = ({bpm, changeNote}) => {
  const unitCell = useSelector(getUnitCell)
  let unitCellHeight = unitCell.height//(useSelector(state => state.settings.unitCell.height));
  let unitCellWidth = unitCell.oneBeatWidth //(useSelector(state => state.settings.unitCell.oneBeatWidth));
  let tracks = useSelector(DAWvisibleTracks)
  
  const updateNote = (trackIndex, noteIndex, note) => {
    const newNote = {...note}
    const oldNote = tracks[trackIndex].notes[noteIndex]
    console.log({oldNote, newNote})
    if(unitCell.snapToArray){
      console.log("unit cell snapeed")
      //check if left changed
      if(newNote.time_on !== oldNote.time_on){
        const [newTimeOn, diff] = snapToGrid(newNote.time_on, bpm, unitCell.subdivisions)
        newNote.time_on = newTimeOn;
        newNote.duration -= diff;
        console.log("left changed", newNote.time_on, oldNote.time_on)
      } else {
        const [newTimeOff, diff] = snapToGrid(newNote.time_on+newNote.duration, bpm, unitCell.subdivisions)
        newNote.duration = newTimeOff-newNote.time_on
      }
    }
    changeNote({
      trackId: trackIndex,
      noteId: noteIndex,
      newNote
    })
  }

  const InteractiveNote = ({note, trackIndex, noteIndex}) => {
    return <div key={trackIndex+"-"+noteIndex}>
              <Note
                note={note} 
                timeOn={note.time_on}
                pitch={note.pitch}
                duration={note.duration}
                bpm={bpm}
                unitCellWidth={unitCellWidth}
                unitCellHeight={unitCellHeight}
                color={COLORS[trackIndex]}
                noteIndex={noteIndex}
                trackIndex={trackIndex}
                updateNote={updateNote}
                />
            </div>
  }

  const TrackNotes = ({notes, trackIndex}) => notes.map((note, noteIndex) => <InteractiveNote key={noteIndex} note={note} trackIndex={trackIndex} noteIndex={noteIndex} />)
  let allNotes = tracks?.map((track, trackIndex) => <TrackNotes key={trackIndex} notes={track.notes} trackIndex={trackIndex}/>)

  return <>{allNotes}</>
}

export const Notes = connect(mapStateToProps, mapDispatchToProps)(NotesComponent);


const notePosition = (timeOn, duration, bpm, pitch, unitCellWidth, unitCellHeight) => {
  let cellWidth=(bpm*duration)/60*unitCellWidth;
  let topOffset=unitCellHeight + unitCellHeight*(127-pitch);
  let leftOffset=50 + (bpm*(timeOn)/60)*unitCellWidth;

  return {
    height:  unitCellHeight,
    width: cellWidth,
    top: topOffset,
    left: leftOffset,
  }
}

const Note = ({timeOn, pitch, duration, bpm, color, unitCellWidth, 
  unitCellHeight, noteIndex, trackIndex, updateNote} ) => {
    const unitCell = useSelector(getUnitCell)
    const scales = {
      dragGrid: {x: 0, y:unitCell.height},
      resizeGrid: {x: 1, y:1}
    }
      
    if(unitCell.snapToArray){
      scales.dragGrid.x = unitCell.oneBeatWidth/unitCell.subdivisions
      scales.resizeGrid.x = unitCell.oneBeatWidth/unitCell.subdivisions
    }

    let style = notePosition(timeOn, duration, bpm, pitch, unitCellWidth, unitCellHeight)
    style.backgroundColor = color

    const resizeHandler = (e, d, r) => {
      console.log("I resized!", d, r?.style.x)
    }

    const dragHandler = (e, d) => {
      const change = {
        x: style.left,
        y: style.top,

      }
      console.log("I dragged!", change, d.lastX, d.lastY)
    }

    return     <Rnd
              default={{
                x: style.left,
                y: style.top,
                width: style.width,
                height: style.height,
              }}
              style={{backgroundColor: color}}
              enableResizing={{ top:false, right:true, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
              dragGrid={[scales.dragGrid.x, scales.dragGrid.y]}
              resizeGrid={[scales.resizeGrid.x, 1]}
              onResizeStop={resizeHandler}
              onDragStop={dragHandler}
              >
              </Rnd>
                
  }




{/* <Rnd
              default={{
                x: style.left,
                y: -1*style.top,
                width: style.width,
                height: style.height,
              }}
              style={{backgroundColor: color}}
              enableResizing={{ top:false, right:true, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
              dragGrid={[scales.dragGrid.x, scales.dragGrid.y]}
              resizeGrid={[scales.resize.x, scales.resizeGrid.y]}
              >
              </Rnd> */}





// const Handlebar = ({onDrag}) => {
//   const nodeRef = React.useRef(null);
  
//   const updateNote = (e, data) => {
//     onDrag(data.x)
//   }

//   return <Draggable
//             nodeRef={nodeRef}
//             axis="x"
//             onStop={updateNote}
//           >
//       <div className="handlebar" ref={nodeRef}></div>
//     </Draggable>
// }

// class OldNote extends PureComponent{
//   constructor (props){
//     super(props)
//     const {timeOn, pitch, duration, bpm, color, unitCellWidth, 
//       unitCellHeight, noteIndex, trackIndex, updateNote} = props

    // let style = notePosition(timeOn, duration, bpm, pitch, unitCellWidth, unitCellHeight)
    // style.backgroundColor = color

//     this.state = { style, timeOn, bpm, unitCellWidth, unitCellHeight, pitch, duration, trackIndex, noteIndex, updateNote }
//     this.adjustLeftPoint = this.adjustLeftPoint.bind(this)
//     this.adjustRightPoint = this.adjustRightPoint.bind(this)
//   }

//   adjustLeftPoint(dX){
//     console.log("params:", this.state.timeOn, this.state.bpm, this.state.unitCellWidth)
//     const initialX = pixelsToSeconds(this.state.timeOn, this.state.bpm, this.state.unitCellWidth)
//     const deltaX = pixelsToSeconds(dX, this.state.bpm, this.state.unitCellWidth)
//     const rightPoint = this.state.timeOn + this.state.duration

//     const newNote = {
//       time_on: this.state.timeOn - (initialX - deltaX),
//       pitch: this.state.pitch,
//     }
//     newNote.duration = rightPoint - newNote.time_on

//     this.state.updateNote(this.state.trackIndex, this.state.noteIndex, newNote)
//   }

//   adjustRightPoint(dX){
//     const deltaX = pixelsToSeconds(dX, this.state.bpm, this.state.unitCellWidth)
    
//     const newNote = {
//       time_on: this.state.timeOn,
//       duration: this.state.duration + deltaX,
//       pitch: this.state.pitch,
//     }

//     this.state.updateNote(this.state.trackIndex, this.state.noteIndex, newNote)
//   }

//   render() {
//     // console.log('this.style', this.state.style)
//     return <div className="note" style={this.state.style}>
//       <div>
//           <Handlebar 
//             noteIndex={this.state.noteIndex} 
//             trackIndex={this.state.trackIndex}
//             onDrag={this.adjustLeftPoint}/>

//       </div>

//       <div>
//         <Handlebar 
//           noteIndex={this.state.noteIndex} 
//           trackIndex={this.state.trackIndex}
//           onDrag={this.adjustRightPoint}/>
//       </div>
//     </div>
//   }
// }

