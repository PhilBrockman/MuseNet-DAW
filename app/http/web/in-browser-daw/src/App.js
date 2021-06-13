import APIClient from './api/apiClient'
import React from 'react'
import { Provider } from 'react-redux';
import {Generations} from "./generations/Generations"
import {OptionList} from "./options/OptionList"

import {store} from "./reducers/rootReducer"

import {fetchGenerations} from "./reducers/generationsReducer"

store.dispatch(fetchGenerations())

// import { MIDIer } from "MIDI/MIDI"
// import { SongEditor } from "DAW/SongEditor"
// import {OptionList} from "Selection/OptionList"\

const App = () => {
  return (
  <Provider store={store}>
    <h1>Helloworld React & Redux!</h1>
    <Generations />
    <OptionList />
  </Provider>)
};

// function Aupp() {

//   const [generations, setGenerations] = React.useState(null);
//   const [parentData, setParentData] = React.useState(null);
//   const [tracks, setTracks] = React.useState(null);

//   const fetchParentData = async (parentId) => {
//     let data = await api.getGeneration(parentId);
//     setParentData(data.data);
//     let trackRequest = await api.getTracks(parentId)
//     setTracks(trackRequest.data)
//   }

//   const fetchData = async () => {
//     const result = await api.generations();
//     setGenerations(result.data);
//   }

//   const deleteGeneration = (id) => {
//     api.deleteGeneration(id).then(r => {
//       fetchData();
//     })
//   }

//   const createGeneration = () => {
//     const prepSelections = () => {
//       const selectedOptions = document.querySelectorAll(".MuseNetOption");
//       const updatedSettings = {}
//       selectedOptions.forEach(item => {
//         updatedSettings[item.id] = item.type==="checkbox"
//                                       ? item.checked
//                                       : item.value
//       })
//       updatedSettings.parent_enc = document.getElementById("parentEnc").value
//       updatedSettings.parent_id = document.getElementById("parentId").value
//       return updatedSettings;
//     }

//     api.createGeneration(prepSelections()).then(r => {
//       fetchData()
//     });
//   }

//   React.useEffect(() => {
//     fetchData();
//   }, [])

//   return (
//     <div className="App">
//       aoeuaoeu

//       <div>{JSON.stringify(generations)}</div>
//     </div>
//   );
// }

export default App;
