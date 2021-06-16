export const statusKeys = {
  LOADING: "loading",
  "200": "success"
}

export const reduceNotes = (data) =>
  data.reduce((acc, item) => {
    for(let i = 0; i < item.notes.length; i++){
      acc.push(item.notes[i])
    }
    return acc;
  }, []);

  export const pixelsToSeconds = (pixels, bpm, dawRes) => {
    //conert to measures
    const beats = pixels/dawRes;
    //convert measures to seconds
    const secs = beats / bpm * 60 
    return secs 

  }

  export const playheadToSeconds = (ph, bpm, dawRes) => {
    //normalize playhead
    const normalizedPixels = ph - dawRes;
    return pixelsToSeconds(normalizedPixels, bpm, dawRes)
  }

  export const secondsToPlayhead = (seconds, bpm, dawRes) => {
    const beats = seconds * bpm/60
    const leftOffset = beats*dawRes
    return dawRes + leftOffset // accounts for the note column
  }

  export const secondsToBeats = (secs, bpm) => {
    const bps = bpm/60;
    return secs*bps
  }

  export const beatsToSeconds = (beats, bpm) => {
    return beats/bpm*60
  }