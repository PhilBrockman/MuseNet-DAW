import {Button, IconButton} from "@material-ui/core"
import { connect } from 'react-redux';

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
      <Button onClick={() => setParent(item)}>
        Base
      </Button>
    </> 
}

export const ParentSetter = connect(mapStateToProps, mapDispatchToProps)(ParentSetterComponent);