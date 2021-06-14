import { connect, useDispatch } from 'react-redux';
const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    setParent: (item) => dispatch({type: "SET_PARENT", payload: item}),
  }
};

const ParentSetterComponent = ({item, setParent}) => {
  return <>
      <button className="mn__button" onClick={() => setParent(item)}>
        parent
      </button>
    </> 
}

export const ParentSetter = connect(mapStateToProps, mapDispatchToProps)(ParentSetterComponent);