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

const MeetingFilterHeader = ({ filterUltimate, setFilterUltimate }) => {
  const {
    data: system_user,
    isLoading: system_isLoading,
    isFetching: system_fetch,
  } = useFetchUserQuery({ type: `userType=System` });
  const { user, userToken, loading } = useSelector((state) => state.user);

  return (
		<div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
			<LeadFilterButton
				filterUltimate={filterUltimate}
				setFilterUltimate={setFilterUltimate}
			/>
			<FilterButton
				label="Meeting Type"
				icon={<GiModernCity />}
				active={!!filterUltimate["meetingType"]}
				customContent={
					<SelectOneValueFilter
						array={meetingTypeArray}
						nameKey={"meetingType"}
						label="Meeting Type"
						filterUltimate={filterUltimate}
						setFilterUltimate={setFilterUltimate}
					/>
				}
			/>
			<FilterButton
				label="Platform"
				icon={<GiModernCity />}
				active={!!filterUltimate["platForm"]}
				customContent={
					<SelectOneValueFilter
						array={platFormArray}
						nameKey={"platForm"}
						label="Platform"
						filterUltimate={filterUltimate}
						setFilterUltimate={setFilterUltimate}
					/>
				}
			/>
			{checkAccess(user, "Meeting", "special") && (
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
			)}
			<FilterButton
				label="Created By"
				icon={<MdCurrencyBitcoin />}
				active={!!filterUltimate["createdBy"]}
				customContent={
					<SelectOneValueFilter
						admin={true}
						array={system_user?.data}
						nameKey={"createdBy"}
						label="Created By"
						filterUltimate={filterUltimate}
						setFilterUltimate={setFilterUltimate}
					/>
				}
			/>
		</div>
  );
};

export default MeetingFilterHeader;
