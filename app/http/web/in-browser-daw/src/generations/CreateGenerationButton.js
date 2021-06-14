import {store} from "../reducers/rootReducer"
import {Button} from "@material-ui/core"
import {createGeneration} from "../reducers/generationsReducer"


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

export const CreateGenerationButton = () => <Button color="primary" onClick={() => store.dispatch(createGeneration(createGenerationProps()))}>create</Button>