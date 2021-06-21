

import React from 'react'
import { useSelector } from 'react-redux';

import {keymaps} from "../../utilities/keymaps"
import {Notes} from "../Notes/Notes"
import {getUnitCell} from "../Settings/SettingsReducer"
import {Playhead} from "../Playhead/Playhead"

import "./WorkArea.css"
import { store } from '../../rootReducer';

const DAWcell = ({content, additionalClasses, headerWidth=false, headerHeight=false}) => {
  const unitCell = useSelector(getUnitCell)

  let allClasses = ["daw-cell"];
  if(additionalClasses?.length > 0){
    allClasses = [...allClasses, ...additionalClasses]
  }
  const width= headerWidth ? unitCell.headers.pianoKeyWidth : unitCell.oneBeatWidth;
  const height = headerHeight ? unitCell.headers.beatCounterHeight : unitCell.height;
  return <div className={allClasses.join(" ")} style={{width: `${width}px`, height:`${height}px`}}>
    {content}
    </div>
}

export const WorkArea = ({bpm, totalLengthInSeconds}) => {
  const unitCell = useSelector(getUnitCell)
  const playheadPosition = useSelector(state => state.playhead.position)

  if(totalLengthInSeconds <= 0) return "Select tracks"

  const reposition = (n, nodeRef) => {
    store.dispatch({type: "SET_PLAYHEAD", payload: 300})
  }

  const filteredKeys = Object.keys(keymaps)

  let numBeats = Math.ceil(totalLengthInSeconds*bpm/60);

  let pianoKeys = filteredKeys.map((item, idx) => {
    let c = keymaps[item].includes("#") ? "accidental" : "natural";
    return <DAWcell headerWidth key={idx} additionalClasses={[c]} content={keymaps[item]} />
  })
 

  return <div className="row">
      <div className="column">
        <DAWcell headerWidth headerHeight />
        <div>
        {pianoKeys}
        </div>
      </div>
      <div>
        <div style={{position: "absolute"}} className="row">
          <BeatsHeader numKeys={filteredKeys.length} numBeats={numBeats}/>
        </div>
        <div style={{position: "absolute", marginTop: unitCell.headers.beatCounterHeight-1}}>
          <HorizontalDividers numBeats={numBeats}  numKeys={filteredKeys.length}/>
        </div>
        <div style={{position:"absolute", }} className="row">
          <VerticalDividers numBeats={numBeats} numKeys={filteredKeys.length}/>
        </div>
        <div style={{position: "absolute"}}>
          <Playhead reposition={reposition} 
                    height={filteredKeys.length*unitCell.height}
                    initialOffset={playheadPosition}
                    />
        </div>
        <Notes bpm={bpm} />
      </div>
    </div>

}

const BeatsHeader = ({numKeys, numBeats}) => {
  const unitCell = useSelector(getUnitCell)
  const overallHeight = numKeys*unitCell.height + unitCell.headers.beatCounterHeight
  return  Array.from(Array(numBeats).keys()).map((box) => {
    const color = box % 2 === 1 ? "light" : "dark";
    return <div key={box} style={{  
                height: overallHeight, 
                left: unitCell.oneBeatWidth*box
                }} 
              className={color}>
        <DAWcell headerHeight numKeys={numKeys} content={box}/>
      </div>
  })
}

const HorizontalDividers = ({numKeys, numBeats}) => {
  const unitCell = useSelector(getUnitCell)
  const style = {
    marginBottom: unitCell.height-2,
    width: unitCell.oneBeatWidth*numBeats, 
    left: unitCell.headers.pianoKeyWidth
    }

  return Array.from(Array(numKeys+1).keys()).map((item, idx) => {
              return <div className="horizontal-division" 
                        style={style}
                        key={idx}
                        />
            })
}


const VerticalDividers = ({numBeats, numKeys}) => {
  const unitCell = useSelector(getUnitCell)
  let offset = unitCell.oneBeatWidth/unitCell.subdivisions
  console.log("data", numBeats,unitCell.subdivisions)
  return Array.from(Array(numBeats*unitCell.subdivisions+1).keys()).map (k => {
          const divider = 
              <div className="subdivision" 
                style={{marginRight: offset-2, height: unitCell.height*numKeys, marginTop: unitCell.headers.beatCounterHeight}}
                key={k}></div>
          return divider;
    }
  )
}

const DAWBackground = ({pianoKeys, body})=> {
    console.log('repainting daw background')
    return <>
      <div className="row">
        <div className="column">
          <DAWcell headerWidth />
          {pianoKeys}
        </div>
        {body}
      </div>
    </>
}