import React from "react";
import FilterButton from "../../../atoms/button/FilterButton";
import {
  TagOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { MdCurrencyBitcoin } from "react-icons/md";
import SelectOneValueFilter from "../../../atoms/cards/SelectOneValueFilter";
import { useFetchUserQuery } from "../../../features/allApi";
import { useSelector } from "react-redux";
import { checkAccess } from "../../../atoms/static";

const TicketFilterHeader = ({ filterUltimate, setFilterUltimate }) => {
  const { user } = useSelector((state) => state.user);
  const {
    data: system_user,
    isLoading: system_isLoading,
    isFetching: system_fetch,
  } = useFetchUserQuery({ type: `userType=System` });

  const statusOptions = [
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  const categoryOptions = [
    { label: "Question", value: "question" },
    { label: "Problem", value: "problem" },
  ];

  return (
    <>
      <FilterButton
        label="Status"
        icon={<TagOutlined />}
        active={!!filterUltimate["status"]}
        customContent={
          <SelectOneValueFilter
            array={statusOptions}
            nameKey={"status"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />

      <FilterButton
        label="Priority"
        icon={<ExclamationCircleOutlined />}
        active={!!filterUltimate["priority"]}
        customContent={
          <SelectOneValueFilter
            array={priorityOptions}
            nameKey={"priority"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />

      <FilterButton
        label="Category"
        icon={<TagOutlined />}
        active={!!filterUltimate["category"]}
        customContent={
          <SelectOneValueFilter
            array={categoryOptions}
            nameKey={"category"}
            filterUltimate={filterUltimate}
            setFilterUltimate={setFilterUltimate}
          />
        }
      />

      <>
        <FilterButton
          label="Assigned To"
          icon={<UserOutlined />}
          active={!!filterUltimate["assignedTo"]}
          customContent={
            <SelectOneValueFilter
              admin={true}
              array={system_user?.data}
              nameKey={"assignedTo"}
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
              filterUltimate={filterUltimate}
              setFilterUltimate={setFilterUltimate}
            />
          }
        />
      </>
    </>
  );
};

export default TicketFilterHeader;
