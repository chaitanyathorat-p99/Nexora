import React, { useState } from 'react'
import FilterButton from '../../../atoms/button/FilterButton'
import CustomModel from '../../../atoms/model/CustomModel'
import Lead from '../../../pages/lead/Lead'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { message } from 'antd'

// Utility to check if a filter is active
function isFilterActive(value, key) {
  if (key === "lead") {
    return value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0);
  }
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== '';
}

const LeadFilterButton = ({filterUltimate,setFilterUltimate}) => {
    const [leadShow, setLeadShow] = useState(false);
    const selectLead=(data)=>{
      setFilterUltimate((prevState) => ({
        ...prevState,
        lead: data,
      }));
      setLeadShow(false)
      message.success("Lead Selected")
  }
  return (
    <>
          <FilterButton
        label= {`${filterUltimate?.lead ? "Change" : "Select"} lead`}
        icon={<RiMoneyDollarCircleLine />}
        onClick={() => setLeadShow(true)}
        active={isFilterActive(filterUltimate?.lead, "lead")}
      />
      
             
             
              {leadShow && (
                     <CustomModel performCancel={()=>setLeadShow(false)} width={"80vw"}>
                     <Lead popUp={true} selectLead={selectLead}/>
                   </CustomModel>
              )}
    </>
  )
}

export default LeadFilterButton
