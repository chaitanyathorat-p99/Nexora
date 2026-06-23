import React from 'react'
import FilterButton from '../../../atoms/button/FilterButton'
import { RiMoneyDollarCircleLine } from 'react-icons/ri'
import { VscTypeHierarchySub } from 'react-icons/vsc'
import { MdCurrencyBitcoin } from 'react-icons/md'
import SelectOneValueFilter from '../../../atoms/cards/SelectOneValueFilter'
import { useFetchUserQuery } from '../../../features/allApi'
import LeadFilterButton from './LeadFilterButton'

const TaskFilterHeader = ({ filterUltimate, setFilterUltimate }) => {
  const {
    data: system_user,
    isLoading: system_isLoading,
    isFetching: system_fetch,
  } = useFetchUserQuery({type:`userType=System`});
  return (
		<>
			<LeadFilterButton
				filterUltimate={filterUltimate}
				setFilterUltimate={setFilterUltimate}
			/>

			<FilterButton
				label="Assigned To"
				icon={<VscTypeHierarchySub />}
				active={!!filterUltimate["assignedTo"]}
				customContent={
					<SelectOneValueFilter
						admin={true}
						array={system_user?.data}
						nameKey={"assignedTo"}
						label="Assigned To"
						filterUltimate={filterUltimate}
						setFilterUltimate={setFilterUltimate}
					/>
				}
			/>
			<FilterButton
				label="Created By"
				icon={<MdCurrencyBitcoin />}
				active={!!filterUltimate["createdBy"]}
				customContent={
					<SelectOneValueFilter
						admin={true}
						array={system_user?.data}
						nameKey={"createdBy"}	
						label={"Created By"}
						filterUltimate={filterUltimate}
						setFilterUltimate={setFilterUltimate}
					/>
				}
			/>
		</>
  );
}

export default TaskFilterHeader
