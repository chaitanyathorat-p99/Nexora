import React from 'react'

const Dummy = ({span}) => {
  return (
    <div className={span ? `sm:col-span-${span}` : ""}>

    </div>
  )
}

export default Dummy
