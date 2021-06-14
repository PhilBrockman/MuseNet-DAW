import React from 'react';
import {Typography, Container, Grid, Checkbox, FormControlLabel, TextField, InputAdornment} from '@material-ui/core';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    setBPM: (item) => dispatch({type: "SET_BPM", payload: item}),
    toggleTrackVisibility: (id) => dispatch({type: "TOGGLE_TRACK_VISIBILITY", payload: id}),
  }
};

const SetBPM = ({initialBPM, setBPM }) => {
  const [value, setValue] = React.useState(initialBPM)
  React.useEffect(() => {setBPM(parseInt(value))}, [value])
  return <TextField
            size="small"
             value={value}
             onChange={e => setValue(parseInt(e.target.value))}
             InputProps={{
               endAdornment: <InputAdornment position="end">BPM</InputAdornment>,
               shrink: true
             }}
           />
 }

const SettingsComponent=({DAW, toggleTrackVisibility, setBPM}) => {
  const ToggleTracks = () => {
    return DAW.tracks.map((track, id) => {
      return <FormControlLabel
            key={id}
            control={<Checkbox 
              checked={track.visible}
              onChange={() => toggleTrackVisibility(id)}
              />}
            label={`${track.instrument} | ${track.notes.length}`}
          />
    })
  }
  return <Grid container item xs={12} direction="row" spacing={2}>
    <Grid item> <ToggleTracks /></Grid>
    <Grid item> <SetBPM setBPM={setBPM} initialBPM={DAW.bpm}/> </Grid>
  </Grid>
}

export const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);