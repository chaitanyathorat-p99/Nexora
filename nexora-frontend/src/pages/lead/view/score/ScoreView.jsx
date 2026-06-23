import React from 'react'
import CustomModel from '../../../../atoms/model/CustomModel'
import ScoreTable from './ScoreTable'
import './score.css'
const ScoreView = ({data,performCancel}) => {
  return (
    <div>
      <CustomModel performCancel={performCancel} fetch={false} width={"800px"}>


      <ScoreTable data={data}/>
      </CustomModel>
    </div>
  )
}

export default ScoreView
