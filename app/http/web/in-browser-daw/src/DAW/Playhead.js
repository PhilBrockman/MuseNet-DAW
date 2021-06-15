import React from 'react';
import { connect } from 'react-redux';
import Draggable from 'react-draggable'; // The default

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    setPosition: (item) => dispatch({type: "SET_PLAYHEAD", payload: item}),
  }
};

const PlayheadComponent = ({ setPosition, initialOffset, reposition}) => {
  const nodeRef = React.useRef(null);
  const style = { cursor: "ew-resize", zIndex: "3"}
  const handleDrag = (e, data) => setPosition(data.lastX)

  const playhead = <Draggable 
            axis="x"
            nodeRef={nodeRef}
            onDrag={handleDrag}
            defaultPosition={{x: initialOffset, y: 0}}
            >
            <div className="playhead" 
              style={style}
              ref={nodeRef}
              >

  <button onClick={() => reposition(20, nodeRef)}>MOVE</button>
            </div>
          </Draggable>
  return playhead
}

export const Playhead = connect(mapStateToProps, mapDispatchToProps)(PlayheadComponent);

