import React from 'react'
import { RxPencil1 } from 'react-icons/rx'

const PencilButtonEdit = ({setEditThe,color}) => {
  return (
    <div>
       <RxPencil1
              onClick={setEditThe}
              style={{ fontSize: "18px" ,color:color?color:"#2a2a2a", cursor: "pointer", transition: "transform 0.2s"}}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            />
    </div>
  )
}

export default PencilButtonEdit
