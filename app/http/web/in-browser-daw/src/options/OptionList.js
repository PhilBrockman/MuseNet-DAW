import {options as MNOptions}  from "./MuseNetOptions"
import {InputSelector} from "./Inputs"
import { connect } from 'react-redux';
import {store} from "../reducers/rootReducer"
import {createGeneration} from "../reducers/generationsReducer"
import "./OptionList.css"

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

const OptionListComponent = ({options, handleDecrementClick, handleIncrementClick}) => {
  return (
    <fieldset>
      <legend>Options</legend>
      <button onClick={() => store.dispatch(createGeneration(createGenerationProps()))}>create</button>
      <div className="optionlist-item">
        {MNOptions.map((section, id) => <Section key={id} items={section} />)}
      </div>
    </fieldset>
  )
}


const createGenerationProps = () => {
  const opts = store.getState().options
  const parent = store.getState().generations.parent
  const out = {
    ...opts,
    parent_enc: parent ? parent.enc : "",
    parent_id: parent ? parent["_id"]["$oid"] : "",
  }
  console.log('out', out)
  return out
}


export const OptionList = connect(mapStateToProps)(OptionListComponent);