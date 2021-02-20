import APIClient from './utilities/apiClient'
import React from 'react'
import { MIDIer } from "MIDI/MIDI"
import { SongEditor } from "DAW/SongEditor"
import {OptionList} from "Selection/OptionList"

let api = new APIClient("accessToken");

function App() {
  const [generations, setGenerations] = React.useState(null);
  const [parentData, setParentData] = React.useState(null);
  const [tracks, setTracks] = React.useState(null);

  const fetchParentData = async (parentId) => {
    let data = await api.getGeneration(parentId);
    setParentData(data.data);
    let trackRequest = await api.getTracks(parentId)
    setTracks(trackRequest.data)
  }

  const fetchData = async () => {
    const result = await api.generations();
    setGenerations(result.data);
  }

  const deleteGeneration = (id) => {
    api.deleteGeneration(id).then(r => {
      fetchData();
    })
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

  React.useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="App">
      <div>
        <Generations
          generations={generations}
          deleteGeneration={deleteGeneration}
          setParentData={fetchParentData}
          />
      </div>
      <SongEditor
        tracks={tracks}
        setTracks={setTracks}
        parentData={parentData}
        />
      <OptionList
        createGeneration={createGeneration}
        parent={parentData}
        />
    </div>
  );
}

const Generations = (props) => {
  return !props.generations || props.generations.map((item, index) => {
    return (
      <div key={index}>
        {item.composer} | {item["_id"]["$oid"]} | <MIDIer item={item} api={api}/>
        <button onClick={() => props.setParentData(item["_id"]["$oid"])}>parent</button>
        <button onClick={() => props.deleteGeneration(item["_id"]["$oid"])}>X</button>
        <button onClick={() => api.downloadMIDI(item)}>Download</button>
      </div>);
  })
}

export default App;
