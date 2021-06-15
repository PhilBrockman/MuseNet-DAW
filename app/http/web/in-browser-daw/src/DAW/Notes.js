import React, { PureComponent } from 'react';
import {useSelector} from "react-redux"
import { connect } from 'react-redux';

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
  let unitCellHeight= parseInt(useSelector(state => state.DAW.unitCell.style.height));
  let unitCellWidth = parseInt(useSelector(state => state.DAW.unitCell.style.width));

  let tracks = useSelector(state => state.DAW.tracks).filter(track => track.visible)

  console.log('tracks', tracks)
  
  const updateNote = (trackIndex, noteIndex, note) => {
    console.log('note', note)
    changeNote({
      trackId: trackIndex,
      noteId: noteIndex,
      newNote: {
        ...note,
        duration: 30
      }
    })
  }

  const InteractiveNote = ({note, trackIndex, noteIndex}) => {
    return <div key={trackIndex+"-"+noteIndex}>
              <div onClick={() => updateNote(trackIndex, noteIndex, note)}>
                <Note
                  note={note} 
                  timeOn={note.time_on}
                  pitch={note.pitch}
                  duration={note.duration}
                  bpm={bpm}
                  unitCellWidth={unitCellWidth}
                  unitCellHeight={unitCellHeight}
                  color={COLORS[trackIndex]}
                  />
                </div>
              </div>
  }

  const TrackNotes = ({notes, trackIndex}) => notes.map((note, noteIndex) => <InteractiveNote key={noteIndex} note={note} trackIndex={trackIndex} noteIndex={noteIndex} />)
  let allNotes = tracks?.map((track, trackIndex) => <TrackNotes key={trackIndex} notes={track.notes} trackIndex={trackIndex}/>)

  return <>{allNotes}</>
}

export const Notes = connect(mapStateToProps, mapDispatchToProps)(NotesComponent);

// const InefficientNote = ({note, noteId, bpm, color, unitCellWidth, unitCellHeight, DAWcellStyle} ) => {
//   let cellWidth=(bpm*note.duration)/60*unitCellWidth;
//   let topOffset=unitCellHeight*(127-note.pitch);
//   let leftOffset=(1+bpm*(note.time_on)/60)*unitCellWidth;

//   let style = {
//     height:`${unitCellHeight}px`,
//     width:`${cellWidth}px`,
//     top:`${topOffset}px`,
//     left:`${leftOffset}px`,
//     backgroundColor: color,
//   }

//   return <div className="note" style={style}>{noteId}</div>
// }

class Note extends PureComponent{
  constructor (props){
    super(props)
    const {timeOn, pitch, duration, bpm, color, unitCellWidth, unitCellHeight, DAWcellStyle} = props

    let cellWidth=(bpm*duration)/60*unitCellWidth;
    let topOffset=unitCellHeight*(127-pitch);
    let leftOffset=(1+bpm*(timeOn)/60)*unitCellWidth;
 
    let style = Object.assign({
      height: `${unitCellHeight}px`,
      width:`${cellWidth}px`,
      top:`${topOffset}px`,
      left:`${leftOffset}px`,
      backgroundColor: color,
    }, DAWcellStyle)

    this.state = {style, duration: duration}
  }

  render() {
    // console.log('this.style', this.state.style)
    return <div className="note" style={this.state.style}>{this.state.duration}</div>
  }
}

