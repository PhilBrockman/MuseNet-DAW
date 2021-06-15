import React from 'react';
import { connect } from 'react-redux';
import {Typography, Button, Select, Checkbox, FormControlLabel, Grid, Slider} from "@material-ui/core";

const mapStateToProps = state => {
  return state;
};

const optionToggled = (item) => {
  return { type: 'TOGGLE', payload: item }
}

const mapDispatchToProps = dispatch => {
  return {
    handleToggle: (item) => dispatch(optionToggled(item)),
  }
};

const Dropdown = ({option, currentOptions, onChange}) => {
  let selections = option.options.map(item => <option key={item} value={item}>{item}</option> )
  const [value, setValue] = React.useState(currentOptions.composer || option.default);

  React.useEffect(() => onChange({toParam: option.toParam, value}), [value])

  return (<>
    <Select
      native
      value={value}
      onChange={(e) => setValue(e.target.value)}>
      {selections}
    </Select>
    </>
  );
}

const InstrumentCheckbox = ({instrumentName, checkedDefault, toggleInstrument}) =>{
  const [checked, setChecked] = React.useState(checkedDefault)
  const handleChange = (e) => {
    setChecked(!checked);
  }

  React.useEffect(() => {
    console.log("effect")
    toggleInstrument({toParam: instrumentName, value: checked})
  }, [checked])

  return(
    <Grid item>
      <FormControlLabel
        control={<Checkbox
          value={instrumentName}
          checked={checked}
          onChange={handleChange}
          />}
        label={instrumentName}
      />
    </Grid>
  );
}
const Checkboxes = ({option, currentOptions, onChange}) => {
  const boxes = option.options.map(opt => <InstrumentCheckbox 
                                              key={opt} 
                                              instrumentName={opt} 
                                              checkedDefault={Object.keys(currentOptions).includes(opt)} 
                                              toggleInstrument={onChange}
    />)

  return <Grid container >
          {boxes}
        </Grid>
}

const SliderInput = ({option, onChange, currentOptions}) => {
  const step_size = option.max < 3 ? .01 : 1;
  const [value, setValue] = React.useState(currentOptions[option.toParam] || option.default);

  const handleChange = (e) => setValue(e.target.value);

  React.useEffect(() => {
    onChange({value, toParam: option.toParam})
  }, [value])

  return (
    <Grid item>
      <Slider
        min={option.min}
        max={option.max}
        defaultValue={value}
        step={step_size}
        onChange={handleChange}
        valueLabelDisplay="auto"/>
    </Grid>
  );
}


export const InputSelectorComponent = ({data, options, handleToggle}) => {
  const choice = data.inputType;
  let selection

  if(choice === "select"){
    selection =  <Dropdown    option={data} onChange={handleToggle} currentOptions={options} />
  } else if (choice === "slider"){
    selection =  <SliderInput option={data} onChange={handleToggle} currentOptions={options}/>
  } else if (choice === "checkboxinput"){
    selection =  <Checkboxes  option={data} onChange={handleToggle} currentOptions={options} />
  } else {
    selection =  "failed"
  }

  return <Grid item>
    <Typography variant="h6">{data.title}</Typography>
    {selection}
  </Grid>
}

export const InputSelector = connect(mapStateToProps, mapDispatchToProps)(InputSelectorComponent);