import React from 'react';
import {useSelector} from "react-redux"

let COLORS = ["red", "blue", "green"]


export const Notes = ({tracks, bpm, playheadPosition}) => {
  const Note = ({note, color}) => {
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

    if(playheadPosition >= leftOffset && playheadPosition <= leftOffset+cellWidth){
      style.border = "4px solid green"
      style.filter = "brightness(200%)"
    }
  
    return <div className="note" style={style}></div>
  }
  
  let allNotes = tracks.map((track, trackIndex) => {
      return track.notes.map((note, noteIndex) => {
        return <Note 
                  note={note}
                  bpm={bpm}
                  key={trackIndex+"-"+noteIndex}
                  color={COLORS[trackIndex]}
                  playheadPosition={playheadPosition}
                  />
      })
  })

  return <>{allNotes}</>
}

