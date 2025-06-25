import React from 'react'

export default function Button() {

    //saev
    const save = () => {
        console.log("save");
    }

  return (
    <div>
      <button onClick={save}>JPT</button>
    </div>
  )
}
