import {options} from "Selection/MuseNetOptions"
import {InputSelector} from "Selection/Inputs"

const ParentOptions = (props) => {
  let enc = props.parent ? props.parent.enc : "";
  let pid = props.parent ? props.parent["_id"]["$oid"] : "";

  return (
    <fieldset>
      <legend>Parent</legend>
      <input
        type="hidden"
        id="parentEnc"
        value={enc}/>
      <input
        type="hidden"
        id="parentId"
        value={pid}/>
      parent: {pid}
    </fieldset>
  );
}

export const OptionList = (props) => {
  const unwrap = (arr) => {
    return arr.map(child => {
      return (
      <div key={child.toParam}>
        {child.title}
        <InputSelector data={child} parent={props.parent}/>
      </div>);
    })
  }

  let mappedOptions = options.map(item => {
    return(
    <fieldset key={item.title}>
      <legend>{item.title}</legend>
      {unwrap(item.children)}
    </fieldset>)
  })

  return (
    <fieldset>
      <legend>Parent Options</legend>
      <button onClick={() => props.createGeneration()}>create</button>
      <ParentOptions parent={props.parent} />
      {mappedOptions}
    </fieldset>
  );
}
