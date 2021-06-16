import React, { PureComponent } from 'react';
import {useSelector, connect} from "react-redux"
import Draggable from 'react-draggable'
import {pixelsToSeconds} from "../../utilities/utilities"
import "./Notes.css"

let COLORS = ["red", "blue", "green"]

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    changeNote: (item) => dispatch({type: "CHANGE_NOTE", payload: item}),
  }
};


export const NotesComponent = ({bpm, changeNote}) => {
  let unitCellHeight= (useSelector(state => state.settings.unitCell.height));
  let unitCellWidth = (useSelector(state => state.settings.unitCell.oneBeatWidth));
  let tracks = useSelector(state => state.DAW.tracks.filter(track => track.visible))
  
  const updateNote = (trackIndex, noteIndex, note) => {
    console.log('note', note)
    changeNote({
      trackId: trackIndex,
      noteId: noteIndex,
      newNote: note
    })
    console.log("endedup changeing the note")
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
  let topOffset=unitCellHeight*(127-pitch);
  let leftOffset=(1+bpm*(timeOn)/60)*unitCellWidth;

  return {
    height: `${unitCellHeight}px`,
    width:`${cellWidth}px`,
    top:`${topOffset}px`,
    left:`${leftOffset}px`,
  }
}

const Handlebar = ({onDrag}) => {
  const nodeRef = React.useRef(null);
  
  const updateNote = (e, data) => {
    onDrag(data.x)
  }

  return <Draggable
            nodeRef={nodeRef}
            axis="x"
            onStop={updateNote}
          >
      <div className="handlebar" ref={nodeRef}></div>
    </Draggable>
}

class Note extends PureComponent{
  constructor (props){
    super(props)
    const {timeOn, pitch, duration, bpm, color, unitCellWidth, 
      unitCellHeight, noteIndex, trackIndex, updateNote} = props

    let style = notePosition(timeOn, duration, bpm, pitch, unitCellWidth, unitCellHeight)
    style.backgroundColor = color

    this.state = { style, timeOn, bpm, unitCellWidth, unitCellHeight, pitch, duration, trackIndex, noteIndex, updateNote }
    this.adjustLeftPoint = this.adjustLeftPoint.bind(this)
    this.adjustRightPoint = this.adjustRightPoint.bind(this)
  }

  componentWillUnmount() {
    
  }

  adjustLeftPoint(dX){
    console.log("params:", this.state.timeOn, this.state.bpm, this.state.unitCellWidth)
    const initialX = pixelsToSeconds(this.state.timeOn, this.state.bpm, this.state.unitCellWidth)
    const deltaX = pixelsToSeconds(dX, this.state.bpm, this.state.unitCellWidth)
    const rightPoint = this.state.timeOn + this.state.duration

    const newNote = {
      time_on: this.state.timeOn - (initialX - deltaX),
      pitch: this.state.pitch,
    }
    newNote.duration = rightPoint - newNote.time_on

    this.state.updateNote(this.state.trackIndex, this.state.noteIndex, newNote)
  }

  adjustRightPoint(dX){
    const deltaX = pixelsToSeconds(dX, this.state.bpm, this.state.unitCellWidth)
    
    const newNote = {
      time_on: this.state.timeOn,
      duration: this.state.duration + deltaX,
      pitch: this.state.pitch,
    }

    this.state.updateNote(this.state.trackIndex, this.state.noteIndex, newNote)
  }

  render() {
    // console.log('this.style', this.state.style)
    return <div className="note" style={this.state.style}>
      <div>
          <Handlebar 
            noteIndex={this.state.noteIndex} 
            trackIndex={this.state.trackIndex}
            onDrag={this.adjustLeftPoint}/>

      </div>
      <div>
        <Handlebar 
          noteIndex={this.state.noteIndex} 
          trackIndex={this.state.trackIndex}
          onDrag={this.adjustRightPoint}/>
      </div>
    </div>
  }
}

