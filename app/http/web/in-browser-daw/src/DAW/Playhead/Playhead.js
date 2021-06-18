import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable'; // The default

import "./Playhead.css"

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    setPosition: (item) => dispatch({type: "SET_PLAYHEAD", payload: item}),
  }
};

const PlayheadComponent = ({ setPosition, initialOffset, height, reposition}) => {
  const nodeRef = React.useRef(null);
  const style = { height}
  const handleDrag = (e, data) => {
    // console.log("instance", playhead2.get())
    setPosition(data.lastX)
  }

  // console.log('initialOffset', initialOffset)
  // const element = React.createElement("div")
  // const playhead2 = new Draggable(element,
  //                                       {
  //                                         axis: "x",
  //                                         onStop: handleDrag,
  //                                         defaultPosition: {x: initialOffset, y: 0},
  //                                       })

  return <Draggable 
            axis="x"
            nodeRef={nodeRef}
            onStop={handleDrag}
            position={{x: initialOffset, y: 0}}
            >
            <div className="playhead" 
              style={style}
              ref={nodeRef}
              >

  <button onClick={() => reposition(20, nodeRef)}>MOVE</button>
            </div>
          </Draggable>
}

export const Playhead = connect(mapStateToProps, mapDispatchToProps)(PlayheadComponent);

