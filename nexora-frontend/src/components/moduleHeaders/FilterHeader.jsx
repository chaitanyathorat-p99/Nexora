import React, { useState } from "react";
import { Button } from "antd";
import "./filterHeader.css";
import CurrencyFilterCard from "../../atoms/cards/CurrencyFilterCard";
import FilterCard from "../../atoms/cards/FilterCard";
import { RiTimeLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { SiStagetimer, SiGoogleads } from "react-icons/si";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { MdCurrencyBitcoin } from "react-icons/md";
import FilterButton from "../../atoms/button/FilterButton";
import CreatedAtFilterCard from "../../atoms/cards/CreatedAtFilterCard";
import { Currency } from "lucide-react";
import SelectOneValueFilter from "../../atoms/cards/SelectOneValueFilter";
import SelectMultiValueFilter from "../../atoms/cards/SelectMultiValueFilter";
import RangeFilter from "../../atoms/cards/RangeFilter";
import DateRangeFilter from "../../atoms/cards/DateRangeFilter";
import { toQueryString } from "../../atoms/State";
import { useDispatch } from "react-redux";
import DealFilterHeader from "./allFilters/DealFilterHeader";
import { LeadFilter } from "../../features/remainingSlice";
import LeadFilterHeader from "./allFilters/LeadFilterHeader";
import TaskFilterHeader from "./allFilters/TaskFilterHeader";
import ProductFilterHeader from "./allFilters/ProductFilterHeader";
import MeetingFilterHeader from "./allFilters/MeetingFilterHeader";
import CallFilterHeader from "./allFilters/CallFilterHeader";
import ActivityFilterHeader from "./allFilters/ActivityFilterHeader";
import TicketFilterHeader from "./allFilters/TicketFilterHeader";
import DynamicFieldsFilterHeader from "./allFilters/DynamicFieldsFilterHeader";

const allDeals = [
  "New",
  "New Business",
  "Expansion",
  "Web Development",
  "Digital Marketing",
];
const countryss = [
  "India",
  "Europ",
  "Expansion",
  "Web Development",
  "Digital Marketing",
];

const allCurrencies = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "JPY", label: "JPY" },
  { value: "CAD", label: "CAD" },
  { value: "AUD", label: "AUD" },
  { value: "CHF", label: "CHF" },
  { value: "CNY", label: "CNY" },
  { value: "INR", label: "INR" },
  { value: "BRL", label: "BRL" },
];
const country = [
  { value: "INIDA", label: "INDIA" },
  { value: "EURope", label: "EURope" },
];

// Utility to check if a filter is active
function isFilterActive(value, key) {
  // For date range, check if from/to are set (array with non-empty values)
  if (key === "createdAt" && Array.isArray(value)) {
    return value && value.length === 2 && (value[0] || value[1]);
  }
  // For select lead, check for non-empty value
  if (key === "lead" || key === "selectLead") {
    return value !== undefined && value !== null && value !== '';
  }
  if (key === "amount" && Array.isArray(value)) {
    return !(value[0] === 0 && value[1] === 1000000000000000);
  }
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== '';
}

const FilterHeader = ({ filter, tableName, dispatchFun,initialObj }) => {
  const [leadFilter, setLeadFilter] = useState(null);

  const [filterUltimate, setFilterUltimate] = useState(filter);
  const dispatch = useDispatch();
  const handleResetAllFilters = () => {
    setLeadFilter(null);
    // dispatch(dispatchFun(10))
    dispatch(dispatchFun(initialObj))

    setFilterUltimate(initialObj);
    // Call the apply functions with empty values to ensure all filters are reset in the parent components
  };

  const handleDateRangeApply = (fromDate, toDate) => {
    console.log(fromDate, toDate);
  };
  console.log(filterUltimate);

  return (
    <div className="flex items-center justify-between mb-4 mt-4 module-header-con">
      <div className="flex items-center space-x-4">
        <div>
          <div style={{ display: "flex", gap: "1rem" }}>
           
            <FilterButton
              label="Created At"
              icon={<RiTimeLine />}
              active={isFilterActive(filterUltimate["createdAt"], "createdAt")}
              customContent={
                <DateRangeFilter
                  nameKey={"createdAt"}
                  filterUltimate={filterUltimate}
                  setFilterUltimate={setFilterUltimate}
                />
              }
            />
            {tableName === "Deal" && <DealFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
            {tableName === "Meeting" && <MeetingFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
            {tableName === "Lead" && <LeadFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
            {tableName === "Timeline History" && <ActivityFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
            {tableName === "Task" && <TaskFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
            {tableName === "Product" && <ProductFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
            {tableName === "Call" && <CallFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
            {tableName === "Ticket" && <TicketFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
            {tableName === "Dynamic Fields" && <DynamicFieldsFilterHeader filterUltimate={filterUltimate} setFilterUltimate={setFilterUltimate}/>}
          </div>
        </div>
      </div>
      <div>
        <Button style={{marginRight:"12px"}} type="default" onClick={handleResetAllFilters}>
          Reset All Filters
        </Button>
        <Button
          type="default"
          onClick={() => {
            dispatch(dispatchFun(filterUltimate))
            console.log(toQueryString(filterUltimate))}}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default FilterHeader;
