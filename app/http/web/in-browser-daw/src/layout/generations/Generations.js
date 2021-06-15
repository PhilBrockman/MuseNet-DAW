// import APIClient from './utilities/apiClient'
import React from 'react'
import { connect, useDispatch } from 'react-redux';
import {Loader} from "../../utilities/Loader/Loader"
import {statusKeys} from "../../utilities/utilities"
import {deleteGeneration, fetchGenerations} from "../../reducers/generationsReducer"
import {ParentSetter} from "./ParentSetter"
import {store} from "../../reducers/rootReducer"
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


/* <MIDIer item={item} api={api}/>

<button onClick={() => api.downloadMIDI(item)}>Download</button> */
}


export const GenerationsComponent = ({generations}) => {
  if (generations.status === statusKeys.LOADING){
    return <Loader />
  }

  console.log("idxk what's going on ", generations)
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


  // const fetchData = async () => {
  //   const result = await api.generations();
  //   setGenerations(result.data);
  // }

  // const deleteGeneration = (id) => {
  //   api.deleteGeneration(id).then(r => {
  //     fetchData();
  //   })
  // }

  // const createGeneration = () => {
  //   const prepSelections = () => {
  //     const selectedOptions = document.querySelectorAll(".MuseNetOption");
  //     const updatedSettings = {}
  //     selectedOptions.forEach(item => {
  //       updatedSettings[item.id] = item.type==="checkbox"
  //                                     ? item.checked
  //                                     : item.value
  //     })
  //     updatedSettings.parent_enc = document.getElementById("parentEnc").value
  //     updatedSettings.parent_id = document.getElementById("parentId").value
  //     return updatedSettings;
  //   }

  //   api.createGeneration(prepSelections()).then(r => {
  //     fetchData()
  //   });
  // }

  // return (
  //   <div className="App">
  //     <div>
  //       <Generations
  //         generations={generations}
  //         deleteGeneration={deleteGeneration}
  //         setParentData={fetchParentData}
  //         />
  //     </div>
  //     <SongEditor
  //       tracks={tracks}
  //       setTracks={setTracks}
  //       parentData={parentData}
  //       />
  //     <OptionList
  //       createGeneration={createGeneration}
  //       parent={parentData}
  //       />
  //   </div>
  // );

