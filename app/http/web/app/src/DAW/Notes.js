import React from 'react';

let COLORS = ["red", "blue", "green"]


export const Notes = (props) => {
  let tracks = props.tracks.map((track, trackIndex) => {
    if(trackIndex === props.activeTrack || props.allVisible){
      return track.notes.map((note, noteIndex) => {
        return <Note {...props}
                      note={note}
                      key={trackIndex+"-"+noteIndex}
                      inactive={trackIndex === props.activeTrack}
                      color={COLORS[trackIndex]}/>
      })
    } else {
      return <></>
    }
  })

  return <>{tracks}</>
}

const Note = (props) => {
  let unitCellHeight=30;

  let cellHeight = unitCellHeight;
  let cellWidth=(props.bpm*props.note.duration/60)*props.dawResolution;
  let topOffset=unitCellHeight*(props.offset - props.note.pitch);
  let leftOffset=props.bpm*(props.note.time_on)/60*props.dawResolution;

  let style = {
    position: "absolute",
    height:`${cellHeight}px`,
    width:`${cellWidth}px`,
    top:`${topOffset}px`,
    left:`${leftOffset}px`
  }

  // console.log("sstlye", style)

  if(props.inactive){
    style.backgroundColor = props.color;
  } else {
    style.backgroundColor = "blue"
  }

  return <div className="note" style={style}></div>
}
