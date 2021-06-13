import React from 'react';

const SliderInput = (props) => {
  const data = props.data
  const step_size = data.max < 3 ? .01 : 1;
  const [value, setValue] = React.useState(1);

  React.useEffect(() => {
    if(props.parent && props.parent[data.toParam]){
      setValue(props.parent[data.toParam])
    } else {
      setValue(data.default)
    }
  }, [props.parent, data.toParam, data.default])

  function handleChange(e){
    setValue(e.target.value)
  }

  return (
    <>
      <input
        className="MuseNetOption"
        id={data.toParam}
        type="range"
        min={data.min}
        max={data.max}
        value={value}
        step={step_size}
        onChange={handleChange}/>
      {value}
    </>
  );
}

const Checkbox = (props) =>{
  return(
    <input
      className="MuseNetOption"
      type="checkbox"
      id={props.data}
      value={props.data}
      checked={props.checked}
      onChange={props.onClick}
      />
  );
}

const Checkboxes = (props) => {
  const [values, setValues] = React.useState([])

  React.useEffect(() => {
    const setValuesFromParent = () => {
      let tmp = [];
      Object.keys(props.parent).map(item => {
                if(props.parent[item] === true){
                  tmp.push(item)
                }; return null;
              });
      return tmp;
    }

    if(props.parent){
      setValues(setValuesFromParent())
    } else {
      setValues(props.data.default)
    }
  }, [props.parent, props.data.default])

  function handleClick(e){
    let target = e.target.value;
    let newValues = values.includes(target)
                      ? values.filter(i => i !== target)
                      : [...values, target]
    setValues([...newValues])
  }

  let boxes = props.data.options.map(item => <Checkbox
    key={item}
    data={item}
    checked={values.includes(item)}
    onClick={handleClick}
    />);

  return (
    <>
      {boxes}
      {JSON.stringify(values)}
    </>
  )
}

const Dropdown = (props) => {
  let options = props.data.options.map(item => <option key={item} value={item}>{item}</option> )
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if(props.parent){
      setValue(props.parent[props.data.toParam])
    } else {
      setValue(props.data.default)
    }
  }, [props.parent, props.data.default,props.data.toParam])

  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      id={props.data.toParam}
      className="MuseNetOption">
      {options}
    </select>
  );
}

const failed = (text) => <>{text}</>;
