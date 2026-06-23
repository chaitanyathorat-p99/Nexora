import React from 'react'
import { ClipLoader } from 'react-spinners'
import './loading.css'
import Hamster from './Hamster'

const UniversalLoading = () => {
  return (
    <div style={{background:'rgba(0,0,0,0.7)',width:"100%",height:"100vh",position:"fixed",top:"0px",left:"0px",zIndex:"100",display:"flex",justifyContent:"center",alignItems:"center"}}>
      <ClipLoader color="#36d7b7" />
      
 {/* <Hamster/> */}
    </div>
  )
}

export default UniversalLoading
