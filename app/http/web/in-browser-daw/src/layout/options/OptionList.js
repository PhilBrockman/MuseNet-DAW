import {options as MNOptions}  from "./MuseNetOptions"
import {InputSelector} from "./Inputs"
import { connect } from 'react-redux';

import {Typography, Grid} from "@material-ui/core/";
// import "./OptionList.css"

const mapStateToProps = state => {
  return state.options;
};

const Section = ({items}) => items.children.map((item ,id) => <InputSelector  key={id} data={item} />)

const OptionListComponent = () => {

  return (<>
       <Typography variant="h5">Settings</Typography>
        <Grid container direction="column">
          {MNOptions.map((section, id) => <Section key={id} items={section} />)}
        </Grid>
        </>
          )
}

export const OptionList = connect(mapStateToProps)(OptionListComponent);