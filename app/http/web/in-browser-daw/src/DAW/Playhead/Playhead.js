import React from 'react';
import { connect, useSelector } from 'react-redux';
import Draggable from 'react-draggable'; // The default

import "./Playhead.css"

const mapStateToProps = state => {
  return state.playhead;
};

const mapDispatchToProps = dispatch => {
  return {
    setPosition: (item) => dispatch({type: "SET_PLAYHEAD", payload: item}),
  }
};

const PlayheadComponent = ({ setPosition, initialOffset, height, reposition}) => {
  const playing = useSelector(state => state.playhead.playing)
  const nodeRef = React.useRef(null);
  const style = { height}
  const handleDrag = (e, data) => {
    setPosition(data.lastX)
  }

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

