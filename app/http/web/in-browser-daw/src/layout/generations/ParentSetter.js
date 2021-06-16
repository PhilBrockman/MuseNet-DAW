import {Button} from "@material-ui/core"
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state.parent;
};

const mapDispatchToProps = dispatch => {
  return {
    setParent: (item) => dispatch({type: "SET_PARENT", payload: item}),
  }
};

const ParentSetterComponent = ({item, setParent}) => {
  return <>
      <Button onClick={() => setParent(item)}>
        Base
      </Button>
    </> 
}

export const ParentSetter = connect(mapStateToProps, mapDispatchToProps)(ParentSetterComponent);