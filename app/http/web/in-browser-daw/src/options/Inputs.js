import React from 'react';
import { connect } from 'react-redux';

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

  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="MuseNetOption">
      {selections}
    </select>
  );
}

const Checkbox = ({instrumentName, checkedDefault, toggleInstrument}) =>{
  const [checked, setChecked] = React.useState(checkedDefault)
  const handleChange = (e) => {
    setChecked(e.target.checked);
  }

  React.useEffect(() => {
    console.log("effect")
    toggleInstrument({toParam: instrumentName, value: checked})
  }, [checked])

  return(
    <>
    {instrumentName}
    <input
      className="MuseNetOption"
      type="checkbox"
      value={instrumentName}
      checked={checked}
      onChange={handleChange}
      />
    </>
  );
}
const Checkboxes = ({option, currentOptions, onChange}) => {
  return option.options.map(opt => <Checkbox 
                                        key={opt} 
                                        instrumentName={opt} 
                                        checkedDefault={Object.keys(currentOptions).includes(opt)} 
                                        toggleInstrument={onChange}
                                        />)
}

const SliderInput = ({option, onChange, currentOptions}) => {
  const step_size = option.max < 3 ? .01 : 1;
  const [value, setValue] = React.useState(currentOptions[option.toParam] || option.default);

  const handleChange = (e) => setValue(e.target.value);

  React.useEffect(() => {
    onChange({value, toParam: option.toParam})
  }, [value])

  return (
    <>
      <input
        type="range"
        min={option.min}
        max={option.max}
        value={value}
        step={step_size}
        onChange={handleChange}/>
      {value}
    </>
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

  return <>
    <div>{data.title}</div>
    {selection}
  </>
}

export const InputSelector = connect(mapStateToProps, mapDispatchToProps)(InputSelectorComponent);