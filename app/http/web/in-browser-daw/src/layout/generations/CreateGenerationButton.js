import {store} from "../../rootReducer"
import {Button, IconButton} from "@material-ui/core"
import {createGeneration} from "./generationsReducer"
// import DeleteIcon from '@material-ui/icons/Delete'
import { Delete } from '@material-ui/icons';


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

export const CreateGenerationButton = () => <Button 
            color="primary" 
            onClick={() => store.dispatch(createGeneration(createGenerationProps()))}>
              create</Button>