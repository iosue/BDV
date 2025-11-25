const formatTime=(stamp)=>{
  const yyyy=String(stamp.getFullYear()).padStart(4,0),
        MM=String(stamp.getMonth()+1).padStart(2,0),
        dd=String(stamp.getDate()).padStart(2,0),
        hh=String(stamp.getHours()).padStart(2,0),
        mm=String(stamp.getMinutes()).padStart(2,0),
        ss=String(stamp.getSeconds()).padStart(2,0),
        tzh=String(Math.floor(stamp.getTimezoneOffset()/60)).padStart(2,0),
        tzm=String(Math.floor(stamp.getTimezoneOffset()%60)).padStart(2,0)
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}+${tzh}:${tzm}`
}

exports.time=formatTime