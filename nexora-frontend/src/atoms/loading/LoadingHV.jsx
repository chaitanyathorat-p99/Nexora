import React from 'react'
import { ClipLoader } from 'react-spinners'
import Hamster from './Hamster'

const LoadingHV = () => {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"50vh"}}>
        <ClipLoader color="#36d7b7" />
      {/* <Hamster/> */}
    </div>
  )
}

export default LoadingHV
