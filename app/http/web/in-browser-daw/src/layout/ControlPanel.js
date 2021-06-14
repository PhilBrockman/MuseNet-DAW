import {CssBaseline, AppBar, Toolbar, Typography, Container, Grid} from '@material-ui/core';
import { CreateGenerationButton } from '../generations/CreateGenerationButton';
import {OptionList} from "../options/OptionList"
import {Generations} from "../generations/Generations"


export const ControlPanel = () => <>
        <Container>
          <Grid container direction="row" alignContent="space-between" spacing={2}  justify="center">
            <Grid item xs={5}><OptionList  /></Grid>
            <Grid container item xs={2} justify="center" > <CreateGenerationButton /></Grid>
            <Grid item xs={5}><div><Generations /></div></Grid>
          </Grid>
        </Container>
      </>