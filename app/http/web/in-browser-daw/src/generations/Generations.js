// import APIClient from './utilities/apiClient'
import React from 'react'
import { connect, useDispatch } from 'react-redux';
import {Loader} from "../utilities/Loader/Loader"
import {statusKeys} from "../utilities/utilities"
import {store} from "../reducers/rootReducer"
import {deleteGeneration} from "../reducers/generationsReducer"


const mapStateToProps = state => {
  return state;
};

const Generation = ({data}) => {
  const dispatch = useDispatch()

  const item = data
  return <>
        {item.composer} | 
        {item["_id"]["$oid"]} 
        <button onClick={() => dispatch({type: "SET_PARENT", payload: item})}>
          parent
          </button>
        <button onClick={() => dispatch(deleteGeneration( item["_id"]["$oid"]))}>X</button>
        
      </>

/* <MIDIer item={item} api={api}/>
<button onClick={() => props.setParentData(item["_id"]["$oid"])}>parent</button>

<button onClick={() => api.downloadMIDI(item)}>Download</button> */
}

export const GenerationsComponent = ({generations}) => {

  React.useEffect(() => {
    console.log("parent changed", generations.parent)
  }, [generations.parent])

  if (generations.status === statusKeys.LOADING){
    return <Loader />
  }
  
  console.log("idxk what's going on ", generations)
  const mappedGenerations = generations.generations.map(generation => <Generation key={generation._id["$oid"]} data={generation}/>)
  return <>
  {mappedGenerations}
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

