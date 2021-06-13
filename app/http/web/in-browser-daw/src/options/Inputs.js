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

const Dropdown = () => "drop"
const Checkboxes = () => "drop"

const SliderInput = ({option, onChange, currentOptions}) => {
  console.log('currentOptions', currentOptions)
  const step_size = option.max < 3 ? .01 : 1;
  const [value, setValue] = React.useState(currentOptions[option.toParam] || option.default);

  function handleChange(e){
    setValue(e.target.value)
  }

  React.useEffect(() => {
    onChange({value, toParam: option.toParam})
  }, [value])

  return (
    <>
      <input
        className="MuseNetOption"
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
    selection =  <Dropdown data={data} onChange={handleToggle} />
  } else if (choice === "slider"){
    selection =  <SliderInput option={data} onChange={handleToggle} currentOptions={options}/>
  } else if (choice === "checkboxinput"){
    selection =  <Checkboxes data={data} onChange={handleToggle} />
  } else {
    selection =  "failed"
  }

  return <>
    <div>{data.title}</div>
    {selection}
  </>
}

export const InputSelector = connect(mapStateToProps, mapDispatchToProps)(InputSelectorComponent);