import {Container, Grid} from '@material-ui/core';
import { CreateGenerationButton } from './generations/CreateGenerationButton';
import {OptionList} from "./options/OptionList"
import {Generations} from "./generations/Generations"
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root :{
  },
  gen: {
    overflowY: "scroll",
    overflowX: "hidden",
    maxHeight: "50vh"
    // backgroundColor:"yellow"
  },
}));

export const ControlPanel = () => {
  const classes = useStyles();

  return <>
        <Container>
          <Grid container direction="row" alignContent="space-between" 
          spacing={2}  justify="center">
            <Grid container item xs={12} sm={5} className={classes.gen} justify="center">
                <Generations />
            </Grid>
            <Grid item xs={12} sm={5} style={{backgroundColor:"red"}}>
              <OptionList  />
            </Grid>
            <Grid container item xs={12}  sm={2} justify="center" > 
              <CreateGenerationButton />
            </Grid>
          </Grid>
        </Container>
      </>}