import {reduceNotes} from "./utils"

const calculateScore = (data) => {
  let interval = (60/data.tempo)/data.subdivision;
  let distance = (i) => Math.pow(Math.abs(Math.round(i) - i), 2);
  let startTimes = reduceNotes(data.tracks).map(item => distance(item.time_on/interval));

  return Math.sqrt(startTimes.reduce((a, b) => a + b, 0))*interval
}

export const Score = (props) => {
  return JSON.stringify(calculateScore({
    tempo: props.bpm,
    subdivision: props.subdivision,
    tracks: props.tracks,
  }))
}

export const autoScore = (tracks, subdivision) => {
  let tempo = 60;
  let results = {best: 100000000}
  do{
    let score = calculateScore({
      tempo: tempo,
      subdivision: subdivision,
      tracks: tracks
    })

    if(score < results.best){
      results = {
        best: score,
        tempo: tempo,
        subdivision: subdivision,
      }
    }
    tempo += .05
  } while(tempo < 200)

  return results
}
