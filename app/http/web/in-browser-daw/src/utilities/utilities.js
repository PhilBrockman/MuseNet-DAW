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
