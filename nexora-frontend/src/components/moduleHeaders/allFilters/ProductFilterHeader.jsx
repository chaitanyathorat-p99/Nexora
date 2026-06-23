import React from "react";
import FilterButton from "../../../atoms/button/FilterButton";
import { MdCurrencyBitcoin } from "react-icons/md";
import SelectOneValueFilter from "../../../atoms/cards/SelectOneValueFilter";
import { cityArray, productType, sourceArray } from "../../../atoms/State";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import RangeFilter from "../../../atoms/cards/RangeFilter";
import { FaProductHunt } from "react-icons/fa6";
import { useFetchProductTypeQuery } from '../../../features/allApi';

const ProductFilterHeader = ({ filterUltimate, setFilterUltimate }) => {
  const { data: productTypes } = useFetchProductTypeQuery();
  return (
    <>
      <FilterButton
        label="Product Type"
        icon={<FaProductHunt />}
        active={!!filterUltimate["productType"]}
        customContent={
          <SelectOneValueFilter
            array={productTypes ? productTypes.map(pt => ({ label: pt.name, value: pt._id })) : []}
            nameKey={"productType"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
      <FilterButton
        label="Amount"
        icon={<RiMoneyDollarCircleLine />}
        active={!!filterUltimate["Amount"]}
        customContent={
          <RangeFilter
            nameKey={"Amount"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />
    </>
  );
};

export default ProductFilterHeader;
