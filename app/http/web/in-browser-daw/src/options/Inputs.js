import React from 'react';
import { connect, useSelector } from 'react-redux';
import "./Input.css"
import {store} from "../reducers/rootReducer"
import Typography from "@material-ui/core/Typography";

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

const ParentDiff = ({attr, comparison, resetValueCallback}) => {
  const parent = useSelector(state => state.parent)?.parent
  if(!parent || parent[attr] === comparison) return null;
  const convert = (item) => {
    if(typeof item === typeof true){
      return "❌";
    } else {
      return item
    }
  }
  if(!parent) return null;
  console.log('parent[attr]', typeof comparison, typeof parent[attr])
  return <div className="parent-value">
    <Typography>{convert(parent[attr])}</Typography>
    <button className="mn__button" onClick={() => resetValueCallback(parent[attr])}>Reset</button>
  </div>
}

const Dropdown = ({option, currentOptions, onChange}) => {
  let selections = option.options.map(item => <option key={item} value={item}>{item}</option> )
  const [value, setValue] = React.useState(currentOptions.composer || option.default);

  React.useEffect(() => onChange({toParam: option.toParam, value}), [value])

  return (<>
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="MuseNetOption">
      {selections}
    </select>
    <ParentDiff attr="composer" comparison={value} resetValueCallback={setValue} />
    </>
  );
}

const Checkbox = ({instrumentName, checkedDefault, toggleInstrument}) =>{
  const [checked, setChecked] = React.useState(checkedDefault)
  const handleChange = (e) => {
    setChecked(!checked);
  }

  React.useEffect(() => {
    console.log("effect")
    toggleInstrument({toParam: instrumentName, value: checked})
  }, [checked])

  return(
    <div className="checkbox-selector">
    <div onClick={handleChange}>{instrumentName}</div>
    <input
      className="MuseNetOption"
      type="checkbox"
      value={instrumentName}
      checked={checked}
      onChange={handleChange}
      />
      <ParentDiff attr={instrumentName} comparison={checked} resetValueCallback={setChecked} />
    </div>
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
    <div>
      <input
        type="range"
        min={option.min}
        max={option.max}
        value={value}
        step={step_size}
        onChange={handleChange}/>
      {value}
    <ParentDiff attr={option.toParam} comparison={value} resetValueCallback={setValue} />
    </div>
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