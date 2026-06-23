import React from "react";
import FilterButton from "../../../atoms/button/FilterButton";
import { MdCurrencyBitcoin } from "react-icons/md";
import SelectOneValueFilter from "../../../atoms/cards/SelectOneValueFilter";
import { cityArray, sourceArray } from "../../../atoms/State";
import { useFetchUserQuery } from "../../../features/allApi";
import { GiModernCity } from "react-icons/gi";
import { SiSourcetree, SiInstatus } from "react-icons/si";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { checkAccess } from "../../../atoms/static";
import { useSelector } from "react-redux";

const leadStatusFilterOptions = ["Active", "Inactive", "Pending"];

const LeadFilterHeader = ({ filterUltimate, setFilterUltimate }) => {
  const { user } = useSelector((state) => state.user);
  const {
    data: system_user,
    isLoading: system_isLoading,
    isFetching: system_fetch,
  } = useFetchUserQuery({ type: `userType=System` });
  return (
    <>
      <FilterButton
        label="City"
        icon={<GiModernCity />}
        active={!!filterUltimate["info.city"]}
        customContent={
          <SelectOneValueFilter
            array={cityArray}
            nameKey={"info.city"}
            label={"City"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
            allowCustomValue={true}
          />
        }
      />{" "}
      <FilterButton
        label="Source"
        icon={<SiSourcetree />}
        active={!!filterUltimate["info.source"]}
        customContent={
          <SelectOneValueFilter
            array={sourceArray}
            nameKey={"info.source"}
            label="Source"
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
      <FilterButton
        label="Status"
        icon={<SiInstatus />}
        active={!!filterUltimate["status"]}
        customContent={
          <SelectOneValueFilter
            array={leadStatusFilterOptions}
            nameKey={"status"}
            label="Status"
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
        {checkAccess(user, "Lead", "special") && (
          <>
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
            label="Created By"
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
       </>
      )}
    </>
  );
};

export default LeadFilterHeader;
