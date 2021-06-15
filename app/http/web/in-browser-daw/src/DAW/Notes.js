import React from 'react';
import {useSelector} from "react-redux"

let COLORS = ["red", "blue", "green"]


export const Notes = ({tracks, bpm}) => {
  let allNotes = tracks.map((track, trackIndex) => {
      return track.notes.map((note, noteIndex) => {
        return <Note 
                  note={note}
                  bpm={bpm}
                  key={trackIndex+"-"+noteIndex}
                  color={COLORS[trackIndex]}/>
      })
  })

  return <>{allNotes}</>
}

const Note = ({note, bpm, color}) => {

  let unitCellHeight=30;
  let dawResolution = useSelector(state => state.DAW.dawResolution);

  let cellHeight = unitCellHeight;
  let cellWidth=(bpm*note.duration)/60*dawResolution;
  let topOffset=unitCellHeight*(note.pitch);
  let leftOffset=(1+bpm*(note.time_on)/60)*dawResolution;

  let style = {
    height:`${cellHeight}px`,
    width:`${cellWidth}px`,
    top:`${topOffset}px`,
    left:`${leftOffset}px`,
    backgroundColor: color,
  }

  return <div className="note" style={style}></div>
}
