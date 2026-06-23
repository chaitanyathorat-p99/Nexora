import React, { useState } from "react";
import FilterButton from "../../../atoms/button/FilterButton";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import RangeFilter from "../../../atoms/cards/RangeFilter";
import SelectMultiValueFilter from "../../../atoms/cards/SelectMultiValueFilter";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { MdCurrencyBitcoin } from "react-icons/md";
import SelectOneValueFilter from "../../../atoms/cards/SelectOneValueFilter";
import { currencyCodes, dealTypeArray } from "../../../atoms/State";
import { SiGoogleads } from "react-icons/si";
import LeadPopUp from "../../../pages/lead/LeadPopUp";
import CustomModel from "../../../atoms/model/CustomModel";
import Lead from "../../../pages/lead/Lead";
import { Button, message } from "antd";
import LeadFilterButton from "./LeadFilterButton";

// Utility to check if a filter is active
function isFilterActive(value, key) {
  if (key === "amount" && Array.isArray(value)) {
    // Only highlight if not default range for deals
    return !(value[0] === 0 && value[1] === 1000000000000000);
  }
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== '';
}

const DealFilterHeader = ({ filterUltimate, setFilterUltimate }) => {

  return (
    <>
    <LeadFilterButton   filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}/>
  
      <FilterButton
        label="Amount"
        icon={<RiMoneyDollarCircleLine />}
        active={isFilterActive(filterUltimate["amount"], "amount")}
        customContent={
          <RangeFilter
            nameKey={"amount"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
            defaultRange={[0, 1000000000000000]}
          />
        }
      />
      <FilterButton
        label="Deal Type"
        icon={<VscTypeHierarchySub />}
        active={isFilterActive(filterUltimate["dealType"])}
        customContent={
          <SelectMultiValueFilter
            array={dealTypeArray}
            nameKey={"dealType"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
      <FilterButton
        label="Currency Type"
        icon={<MdCurrencyBitcoin />}
        active={isFilterActive(filterUltimate["currencyType"])}
        customContent={
          <SelectOneValueFilter
            array={currencyCodes}
            nameKey={"currencyType"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
    </>
  );
};

export default DealFilterHeader;
