import {options as MNOptions}  from "./MuseNetOptions"
import {InputSelector} from "./Inputs"
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return state;
};

const Section = ({items}) => {
  const detail = items.children.map((item ,id) => <InputSelector key={id} data={item} />)

  return <fieldset>
    <legend>{items.title}</legend>
    {detail}
    </fieldset>
}

const Component = ({options, handleDecrementClick, handleIncrementClick}) => {
  return (
    <fieldset>
      <legend>Options</legend>
      <button onClick={() => console.log("create")}>create</button>
      {MNOptions.map((section, id) => <Section key={id} items={section} />)}
    </fieldset>
  )
}


const createGeneration = () => {
  const prepSelections = () => {
    const selectedOptions = document.querySelectorAll(".MuseNetOption");
    const updatedSettings = {}
    selectedOptions.forEach(item => {
      updatedSettings[item.id] = item.type==="checkbox"
                                    ? item.checked
                                    : item.value
    })
    updatedSettings.parent_enc = document.getElementById("parentEnc").value
    updatedSettings.parent_id = document.getElementById("parentId").value
    return updatedSettings;
  }

  api.createGeneration(prepSelections()).then(r => {
    fetchData()
  });
}


export const OptionList = connect(mapStateToProps)(Component);



  // const unwrap = (arr) => {
  //   return arr.map(child => {
  //     return (
  //     <div key={child.toParam}>
  //       {child.title}
  //       <InputSelector data={child} parent={props.parent}/>
  //     </div>);
  //   })
  // }

  // let mappedOptions = options.map(item => {
  //   return(
  //   <fieldset key={item.title}>
  //     <legend>{item.title}</legend>
  //     {unwrap(item.children)}
  //   </fieldset>)
  // })

  // return (
  //   <fieldset>
  //     <legend>Parent Options</legend>
  //     
  //     <ParentOptions parent={props.parent} />
  //     {mappedOptions}
  //   </fieldset>
  // );



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
