import React from "react";
import { MdCurrencyBitcoin } from "react-icons/md";
import FilterButton from "../../../atoms/button/FilterButton";
import SelectOneValueFilter from "../../../atoms/cards/SelectOneValueFilter";
import { moduleType } from "../../../atoms/State";
import { useFetchUserQuery } from "../../../features/allApi";

const ActivityFilterHeader = ({ filterUltimate = {}, setFilterUltimate }) => {
    const filterWithDefaults = { ...filterUltimate, module: filterUltimate.module || "" };

    const {
        data: system_user,
        isLoading: system_isLoading,
        isFetching: system_fetch,
    } = useFetchUserQuery({ type: `userType=System` });
    return (
        <>
            <FilterButton
                label="Module Type"
                icon={<MdCurrencyBitcoin />}
                active={!!filterUltimate["module"]}
                customContent={
                    <SelectOneValueFilter
                        array={moduleType}
                        nameKey={"module"}
                        filterUltimate={filterWithDefaults}
                        setFilterUltimate={setFilterUltimate}
                    />
                }
            />

            <FilterButton
                label="User"
                icon={<MdCurrencyBitcoin />}
                active={!!filterUltimate["createdBy"]}
                customContent={
                    <SelectOneValueFilter
                        admin={true}
                        array={system_user?.data}
                        nameKey={"createdBy"}
                        filterUltimate={filterUltimate}
                        setFilterUltimate={setFilterUltimate}
                    />
                }
            />
        </>
    );
};

export default ActivityFilterHeader;
