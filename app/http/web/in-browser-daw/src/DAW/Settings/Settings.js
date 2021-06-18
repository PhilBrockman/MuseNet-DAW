import React from 'react';
import { Grid, Button, Checkbox, FormControlLabel, TextField, InputAdornment} from '@material-ui/core';
import { connect, useSelector } from 'react-redux';
import {fetchTracks} from "../DAWReducer"


const mapStateToProps = state => {
  return state.settings;
};

const mapDispatchToProps = dispatch => {
  return {
    setBPM: (item) => dispatch({type: "SET_BPM", payload: item}),
    setSubdivisions: (item) => dispatch({type: "SET_SUBDIVISIONS", payload: item}),
    toggleTrackVisibility: (id) => dispatch({type: "TOGGLE_TRACK_VISIBILITY", payload: id}),
  }
};

const SetSettings = ({initialValue, dispatch, adornment}) => {
  const [value, setValue] = React.useState(initialValue)
  const update = () => {
    dispatch(parseInt(value))
  }
  return <>
          <TextField
            size="small"
             value={value}
             onChange={e => setValue(e.target.value)}
             InputProps={{
               endAdornment: <InputAdornment position="end">{adornment}</InputAdornment>,
             }}
           />
           <Button onClick={update}>Update</Button>
          </>
}

const SettingsComponent=({toggleTrackVisibility, setBPM, setSubdivisions}) => {
  const tracks = useSelector(fetchTracks)
  const settings = useSelector(state => state.settings)

  const ToggleTracks = () => {
    return tracks.map((track, id) => {
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
  return <>
    <Grid container item xs={12} direction="row" spacing={2}>
      <Grid item> <ToggleTracks /></Grid>
      <Grid item> <SetSettings dispatch={setBPM} initialValue={settings.bpm} adornment={"BPM"}/> </Grid>
      <Grid item> <SetSettings dispatch={setSubdivisions} initialValue={settings.unitCell.subdivisions} adornment={"Subdivisions"}/> </Grid>
    </Grid>
  </>
}

export const Settings = connect(mapStateToProps, mapDispatchToProps)(SettingsComponent);