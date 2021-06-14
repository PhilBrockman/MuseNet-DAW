import {options as MNOptions}  from "./MuseNetOptions"
import {InputSelector} from "./Inputs"
import { connect } from 'react-redux';
import {store} from "../reducers/rootReducer"
import {createGeneration} from "../reducers/generationsReducer"
import Typography from "@material-ui/core/Typography";
import "./OptionList.css"

const mapStateToProps = state => {
  return state;
};

const Section = ({items}) => {
  const detail = items.children.map((item ,id) => <InputSelector key={id} data={item} />)

  return <fieldset>
    <Typography>{items.title}</Typography>
    {detail}
    </fieldset>
}

const OptionListComponent = () => {
  console.log("redrwing options")
  return (
    <fieldset>
      <Typography>Options</Typography>
      <div className="optionlist-item">
        <button className="mn__button" onClick={() => store.dispatch(createGeneration(createGenerationProps()))}>create</button>
        {MNOptions.map((section, id) => <Section key={id} items={section} />)}
      </div>
    </fieldset>
  )
}


const createGenerationProps = () => {
  const opts = store.getState().options
  const parent = store.getState().parent.parent
  const out = {
    ...opts,
    parent_enc: parent ? parent.enc : "",
    parent_id: parent ? parent["_id"]["$oid"] : "",
  }
  console.log('out', out)
  return out
}


export const OptionList = connect(mapStateToProps)(OptionListComponent);