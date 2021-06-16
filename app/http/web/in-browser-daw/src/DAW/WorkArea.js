

import React from 'react'
import { useSelector } from 'react-redux';

import {keymaps} from "../utilities/keymaps"
import {Notes} from "./Notes/Notes"
import {getUnitCell} from "./Settings/SettingsReducer"
import {Playhead} from "./Playhead/Playhead"

const DAWcell = ({content, additionalClasses, fixedWidth=false}) => {
  const unitCell = useSelector(getUnitCell)

  let allClasses = ["daw-cell"];
  if(additionalClasses?.length > 0){
    allClasses = [...allClasses, ...additionalClasses]
  }
  const width= fixedWidth ? 50 : unitCell.oneBeatWidth;
  const height = unitCell.height
  return <div className={allClasses.join(" ")} style={{width: `${width}px`, height:`${height}px`}}>
    {content}
    </div>
}


const BoxColumn = ({header, numKeys}) => {
  return <div className="column">
      <DAWcell content={header} additionalClasses={["header"]}/>
  </div>
}


export const WorkArea = ({bpm, totalLengthInSeconds}) => {
  // const midi= tracksToJSON(tracks)

  const unitCell = useSelector(getUnitCell)
  if(totalLengthInSeconds <= 0) return "Select tracks"

  const reposition = (n, nodeRef) => {
    nodeRef.current.style.left = `${parseInt(nodeRef.current.style.left || 0)+n}px`
  }

  const filteredKeys = Object.keys(keymaps)

  let numBeats = Math.ceil(totalLengthInSeconds*bpm/60);
  let boxes = Array.from(Array(numBeats).keys())

  let pianoKeys = filteredKeys.map((item, idx) => {
    let c = keymaps[item].includes("#") ? "accidental" : "natural";
    return <DAWcell fixedWidth key={idx} additionalClasses={[c]} content={keymaps[item]} />
  })

  let horizontalDividers = Array.from(Array(filteredKeys.length+1).keys()).map((item, idx) => {
    console.log('object', idx*unitCell.height)
    return <div className="horizontal-division" 
              style={{top: `${(idx+1)*unitCell.height-1}px`, width: unitCell.oneBeatWidth*numBeats, left: 50}}
              key={idx}
              />
  })

  let body = boxes.map((box) => {
    return <BoxColumn key={box} header={box} numKeys={pianoKeys.length}/>
  })

  return <>
  
  {/* <button onClick={() => playMidi(midi)}>Will this play anthynig???</button> */}
      <div className="daw">
        <Subdivisions numCells={numBeats} />
        {horizontalDividers}
        <DAWBackground body={body} pianoKeys={pianoKeys} />
        <Notes bpm={bpm} />
        <Playhead reposition={reposition}/>
      </div>
  </>
}

const Subdivisions = ({numCells}) => {
  const unitCell = useSelector(getUnitCell)
  let offset = 50
  console.log("data", numCells,unitCell.subdivisions)
  return Array.from(Array(numCells*unitCell.subdivisions+1).keys()).map (k => {
          const divider = 
              <div className="subdivision" 
                style={{left: `${offset}px`}}
                key={k}
                />
          offset += unitCell.oneBeatWidth/unitCell.subdivisions
          return divider;
    }
  )
}



const DAWBackground = ({pianoKeys, body})=> {
    console.log('repainting daw background')
    return <>
      <div className="row">
        <div className="column">
          <DAWcell fixedWidth />
          {pianoKeys}
        </div>
        {body}
      </div>
    </>
}