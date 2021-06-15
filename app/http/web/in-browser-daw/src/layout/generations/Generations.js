// import APIClient from './utilities/apiClient'
import React from 'react'
import { connect, useDispatch } from 'react-redux';
import {Loader} from "../../utilities/Loader/Loader"
import {statusKeys} from "../../utilities/utilities"
import {deleteGeneration, fetchGenerations} from "./generationsReducer"
import {ParentSetter} from "./ParentSetter"
import {store} from "../../rootReducer"
import {IconButton, Typography, List, ListItem, ListItemText, makeStyles} from "@material-ui/core"
import { Delete } from '@material-ui/icons';

store.dispatch(fetchGenerations())

const mapStateToProps = state => {
  return state;
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


export const GenerationsComponent = ({generations}) => {
  if (generations.status === statusKeys.LOADING){
    return <Loader />
  }

  const mappedGenerations = generations.generations.map(generation => <Generation key={generation._id["$oid"]} data={generation}/>)
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