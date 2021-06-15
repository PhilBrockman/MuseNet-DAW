import React, { PureComponent } from 'react';
import {useSelector} from "react-redux"


let COLORS = ["red", "blue", "green"]

export const Notes = ({tracks, bpm}) => {
  let unitCellHeight= parseInt(useSelector(state => state.DAW.DAWcell.style.height));
  let dawResolution = parseInt(useSelector(state => state.DAW.DAWcell.style.width));
  let DAWcellStyle = useSelector(state => state.DAW.DAWcell.style)
  
  let allNotes = tracks.map((track, trackIndex) => {
      return track.notes.map((note, noteIndex) => {
        return <Note 
                  note={note}
                  bpm={bpm}
                  key={trackIndex+"-"+noteIndex}
                  dawResolution={dawResolution}
                  unitCellHeight={unitCellHeight}
                  DAWcellStyle={DAWcellStyle}
                  color={COLORS[trackIndex]}
                  />
      })
  })

  return <>{allNotes}</>
}

// const InefficientNote = ({note, bpm, color, dawResolution, unitCellHeight, DAWcellStyle} ) => {

//   let cellWidth=(bpm*note.duration)/60*dawResolution;
//   let topOffset=unitCellHeight*(127-note.pitch);
//   let leftOffset=(1+bpm*(note.time_on)/60)*dawResolution;

//   let style = Object.assign({
//     height:`${unitCellHeight}px`,
//     width:`${cellWidth}px`,
//     top:`${topOffset}px`,
//     left:`${leftOffset}px`,
//     backgroundColor: color,
//   }, DAWcellStyle)

//   return <div className="note" style={style}></div>
// }

class Note extends PureComponent{
  constructor (props){
    super(props)
    const {note, bpm, color, dawResolution, unitCellHeight, DAWcellStyle} = props
    console.log("redrawing note")

    let cellWidth=(bpm*note.duration)/60*dawResolution;
    let topOffset=unitCellHeight*(127-note.pitch);
    let leftOffset=(1+bpm*(note.time_on)/60)*dawResolution;

    let style = Object.assign({
      height:`${unitCellHeight}px`,
      width:`${cellWidth}px`,
      top:`${topOffset}px`,
      left:`${leftOffset}px`,
      backgroundColor: color,
    }, DAWcellStyle)

    this.state = {style}
  }

  render() {
    // console.log('this.style', this.state.style)
    return <div className="note" style={this.state.style}></div>
  }
}

