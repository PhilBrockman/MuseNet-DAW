import React from 'react'
import { Provider } from 'react-redux';
import {ControlPanel} from "./layout/ControlPanel"
import {store} from "./reducers/rootReducer"

import {DAW} from "./DAW/DAW"

import { ThemeProvider } from '@material-ui/core'
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {CssBaseline, AppBar, Toolbar, Typography, Container, Grid} from '@material-ui/core';





const MuseNetFetcher = () => "Fetcher"


const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  
  return (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Paper>
      <CssBaseline/>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" >
            Header Text
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <ControlPanel />

        <MuseNetFetcher />
        <DAW />
      </main>
      </Paper>
    </ThemeProvider>
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
