// import APIClient from './utilities/apiClient'
import React from 'react'
import { connect, useDispatch, useSelector } from 'react-redux';
import {Loader} from "../../utilities/Loader/Loader"
import {statusKeys} from "../../utilities/utilities"
import {deleteGeneration, fetchGenerations, allGenerations, getStatus} from "./generationsReducer"
import {ParentSetter} from "./ParentSetter"
import {store} from "../../rootReducer"
import {IconButton, List, ListItem, ListItemText} from "@material-ui/core"
import { Delete } from '@material-ui/icons';

store.dispatch(fetchGenerations())

const mapStateToProps = state => {
  return state.generations;
};

const Generation = ({data}) => {
  const dispatch = useDispatch()

  const item = data
  return <ListItem>
              <ParentSetter item={item} />
              <ListItemText primary={item.composer}/>
              <IconButton className="mn__button" onClick={() => dispatch(deleteGeneration( item["_id"]["$oid"]))}><Delete /></IconButton>
          </ListItem>
}


export const GenerationsComponent = () => {
  const generations = useSelector(allGenerations)
  const status = useSelector(getStatus)

  if (status === statusKeys.LOADING){
    return <Loader />
  }

  const mappedGenerations = generations.map(generation => <Generation key={generation._id["$oid"]} data={generation}/>)
  return <>
  <List subheader={<li />}>
    <li>Generations:</li>
    <ul>
      {mappedGenerations}
    </ul>
  </List>
  </>
}
export const Generations = connect(mapStateToProps)(GenerationsComponent);