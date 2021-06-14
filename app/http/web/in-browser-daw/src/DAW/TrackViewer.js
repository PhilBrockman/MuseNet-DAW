export const TrackViewer = ({tracks}) => {

  return ` visible: ${tracks.length}`

  // let tracks = props.tracks.map((item, idx) => {
  //   return <div key={idx} onClick={() => setActiveTrack(idx)}>
  //       {item.instrument} | {item.notes.length}
  //       </div>//.notes.length
  // })

  // return <>
  //   <div className="mini-area">
  //     {tracks}
  //   </div>
  //   <div>
  //     <Score {...props}/>
  //   </div>
  //   <div className="active-area">
  //     <ActiveArea
  //       activeTrack={activeTrack}
  //       {...props}
  //       />
  //   </div>
  // </>
}