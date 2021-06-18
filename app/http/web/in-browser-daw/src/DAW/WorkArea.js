

import React from 'react'
import { useSelector } from 'react-redux';

import {keymaps} from "../utilities/keymaps"
import {Notes} from "./Notes/Notes"
import {getUnitCell} from "./Settings/SettingsReducer"
import {Playhead} from "./Playhead/Playhead"

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
    return <DAWcell headerWidth key={idx} additionalClasses={[c]} content={keymaps[item]} />
  })

  const overallHeight = filteredKeys.length*unitCell.height + unitCell.headers.beatCounterHeight
  let beatsHeader = boxes.map((box) => {
      const color = box % 2 === 1 ? "light" : "dark";
      return <div key={box} style={{  
                  height: overallHeight, 
                  left: unitCell.oneBeatWidth*box
                  }} 
                className={color}>
          <DAWcell headerHeight numKeys={pianoKeys.length} content={box}/>
        </div>
    })
  


  let notes = <div style={{position: "absolute"}}></div>

  return <div className="row">
      <div className="column">
        <DAWcell headerWidth headerHeight />
        <div>
        {pianoKeys}
        </div>
      </div>
      <div>
        <div style={{position: "absolute"}} className="row">{beatsHeader}</div>
        {notes}
        <div style={{position: "absolute", marginTop: unitCell.headers.beatCounterHeight}}>
          <HorizontalDividers numBeats={numBeats}  numKeys={filteredKeys.length}/>
        </div>
        <div style={{position:"absolute"}} className="row">
          <VerticalDividers numBeats={numBeats} numKeys={filteredKeys.length}/>
        </div>
      </div>
    </div>



  // let body = boxes.map((box) => {
  //   return <BoxColumn key={box} header={box} numKeys={pianoKeys.length}/>
  // })

  // return <>
  
  // {/* <button onClick={() => playMidi(midi)}>Will this play anthynig???</button> */}
  //     <div className="daw">
  //       <Subdivisions numBeats={numBeats} />
  //       {horizontalDividers}
  //       <Notes bpm={bpm} />
  //       <DAWBackground body={body} pianoKeys={pianoKeys} />
        
  //       <Playhead reposition={reposition}/>
  //     </div>
  // </>
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