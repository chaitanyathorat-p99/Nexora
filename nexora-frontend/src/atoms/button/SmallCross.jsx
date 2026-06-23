import React from 'react'
import { RxCrossCircled } from "react-icons/rx";

const SmallCross = ({onclick}) => {
  return (
    <div
    onClick={onclick}
 
    >
      {/* <Check style={{ width: "20px", color: "white", height: "20px" }} /> */}
      {/* X */}
      <RxCrossCircled  style={{color:"red",fontSize:"18px"}}/>
    </div>
  )
}

export default SmallCross
