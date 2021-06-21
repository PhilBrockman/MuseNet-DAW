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
  
  const updateNote = ({trackIndex, noteIndex, note}) => {
    console.log('note', note)
    changeNote({
      trackId: trackIndex,
      noteId: noteIndex,
      newNote: note,
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

const secondsToPixels = ({bpm, seconds, unitCellWidth}) => {
  return (bpm*parseFloat(seconds))/60*unitCellWidth
}

const notePosition = (timeOn, duration, bpm, pitch, unitCellWidth, unitCellHeight) => {
  let cellWidth=secondsToPixels({bpm, unitCellWidth, seconds: duration});
  let topOffset=unitCellHeight*pitch;
  let leftOffset=secondsToPixels({bpm, unitCellWidth, seconds: timeOn});

  return {
    height:  unitCellHeight,
    width: cellWidth,
    top: topOffset,
    left: leftOffset,
  }
}

const pixeledNoteToNote = ({x, y, width, bpm, unitCell, snap}) => {
  const time_on = pixelsToSeconds(
            snap.left ? roundToMultiple({num: x, unit: unitCell.oneBeatWidth/unitCell.subdivisions}): x, 
            bpm, 
            unitCell.oneBeatWidth)
  const newPitch = roundToMultiple({num: y, unit: unitCell.height})/unitCell.height

  const left = secondsToPixels({seconds: time_on, bpm, unitCellWidth:unitCell.oneBeatWidth})
  console.log('left', left)
  const normedWidth =  snap.right ? 
                                  roundToMultiple({num: left+width, unit: unitCell.oneBeatWidth/unitCell.subdivisions}) :
                                  left+width; 

  const newDuration = parseFloat(normedWidth-left)/unitCell.oneBeatWidth*60/bpm
  // console.log(style)
  // console.log("old info: ", {timeOn, pitch, duration})
  // console.log('{width, unitCellWidth, bpm}', {time_on, newPitch, newDuration})
  return {time_on, pitch:newPitch, duration: newDuration}

}
const roundToMultiple =({num, unit}) => {
  return Math.round(parseFloat(num)/unit)*unit
}

const Note = ({timeOn, pitch, duration, bpm, color, unitCellWidth, 
  unitCellHeight, noteIndex, trackIndex, updateNote} ) => {
    const unitCell = useSelector(getUnitCell)
    const snap = useSelector(state => state.settings.snap)

    let style = notePosition(timeOn, duration, bpm, pitch, unitCellWidth, unitCellHeight)
    style.backgroundColor = color

    const resizeHandler = (e, d, ref, delta, position) => {
      updateNote({noteIndex, trackIndex, note: pixeledNoteToNote({
        x: position.x,
        y: position.y,
        width: parseFloat(ref.style.width),
        bpm, unitCell, snap
      })})
    }


    const dragHandler = (e, d) => {
      console.log('unitCell', unitCell)
      updateNote({noteIndex, trackIndex, note: pixeledNoteToNote({
        x: d.x,
        y: d.y,
        width: parseFloat(d.node.style.width),
        bpm, unitCell, snap
      })})
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
              dragGrid={[1, unitCell.height]}
              resizeGrid={[1, 1]}
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

