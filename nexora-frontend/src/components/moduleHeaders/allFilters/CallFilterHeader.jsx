
import React from "react";
import FilterButton from "../../../atoms/button/FilterButton";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { MdCurrencyBitcoin } from "react-icons/md";
import SelectOneValueFilter from "../../../atoms/cards/SelectOneValueFilter";
import { useFetchUserQuery } from "../../../features/allApi";
import { meetingTypeArray, platFormArray } from "../../../atoms/State";
import { GiModernCity } from "react-icons/gi";
import { checkAccess } from "../../../atoms/static";
import { useSelector } from "react-redux";
import LeadFilterButton from "./LeadFilterButton";

const CallFilterHeader = ({ filterUltimate, setFilterUltimate }) => {
  const {
    data: system_user,
    isLoading: system_isLoading,
    isFetching: system_fetch,
  } = useFetchUserQuery({ type: `userType=System` });
  const { user, userToken, loading } = useSelector((state) => state.user);

  return (
		<>
			<LeadFilterButton
				filterUltimate={filterUltimate}
				setFilterUltimate={setFilterUltimate}
			/>

			{checkAccess(user, "Meeting", "special") && (
				<FilterButton
					label="Assigned To"
					icon={<VscTypeHierarchySub />}
					active={!!filterUltimate["Assigned To"]}
					customContent={
						<SelectOneValueFilter
							admin={true}
							array={system_user?.data}
							nameKey={"Assigned To"}
							filterUltimate={filterUltimate}
							setFilterUltimate={setFilterUltimate}
						/>
					}
				/>
			)}
			<FilterButton
				label="Created By"
				icon={<MdCurrencyBitcoin />}
				active={!!filterUltimate["Created By"]}
				customContent={
					<SelectOneValueFilter
						admin={true}
						array={system_user?.data}
						nameKey={"Created By"}
						filterUltimate={filterUltimate}
						setFilterUltimate={setFilterUltimate}
					/>
				}
			/>
		</>
  );
};

export default CallFilterHeader;
