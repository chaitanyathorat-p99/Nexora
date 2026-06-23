import React, { useState } from "react";
import { Table, Input, Select, Button, Tooltip } from "antd";
import "./moduleheader.css";
import {
  ColumnWidthOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import FilterHeader from "./FilterHeader";
import {
  ActivityFilterObj,
  CallFilterObj,
  DealFilterObj,
  EnquiryFilterObj,
  FeaturesMasterFilterObj,
  LeadFilterObj,
  LimitFilterObj,
  MeetingFilterObj,
  PlanFilterObj,
  ProductFilterObj,
  ReportFilterObj,
  SubscriptionFilterObj,
  TaskFilterObj,
  TicketFilterObj,
  QuotationFilterObj,
} from "../../atoms/StaticFilter";
import {
  ActivityFilter,
  CallFilter,
  DealFilter,
  EnquiryFilter,
  FeaturesMasterFilter,
  LeadFilter,
  LimitFilter,
  MeetingFilter,
  PlanFilter,
  ProductFilter,
  ReportFilter,
  SubscriptionFilter,
  TaskFilter,
  TicketFilter,
  Trending_page,
  QuotationFilter,
  DynamicFieldsFilter,
} from "../../features/remainingSlice";
import DealFilterHeader from "./allFilters/DealFilterHeader";
import { useDispatch, useSelector } from "react-redux";
import { FaFileExport } from "react-icons/fa6";
import { LuImport } from "react-icons/lu";
import { Columns } from "lucide-react";
import CustomModel from "../../atoms/model/CustomModel";
import ArrangeColumn from "./arrangeColumn/ArrangeColumn";
import { columnsRender } from "../../features/authfunctions/userLogin";
import TicketFilterHeader from "./allFilters/TicketFilterHeader";
import ExportCsvButton from '../../components/common/ExportCsvButton';
import ImportCsvButton from '../../components/common/ImportCsvButton';
import { notification } from 'antd';

const { Option } = Select;
const { Search } = Input;
const StyledHR = styled.hr`
  border: none;
  height: 1px;
  background-color: #1414143b;
  /* margin: 20px 0;  */
`;
const getModuleKey = (title) => {
  // Map display title to module key used in export
  switch (title) {
    case 'Call': return 'calls';
    case 'Meeting': return 'meetings';
    case 'Task': return 'tasks';
    case 'Lead': return 'leads';
    case 'Deal': return 'deals';
    case 'Product': return 'products';
    case 'Quotation': return 'quotations';
    case 'Ticket': return 'tickets';
    case 'User Role': return 'user-roles';
    case 'Lead Status': return 'lead-status';
    case 'Product Type': return 'product-types';
    case 'Industry Type': return 'industry-types';
    case 'Type Of Buyer': return 'type-of-buyers';
    case 'Reports': return 'reports';
    case 'Email Templates': return 'email-templates';
    case 'Rating': return 'ratings';
    case 'Feature Master': return 'features-master';
    case 'Feature Limit': return 'feature-limits';
    case 'Limit Management': return 'limits';
    case 'Plan': return 'plans';
    case 'System User':return 'users';
    case 'Subscription': return 'subscription';
    case 'Enquiry': return 'enquiry'
    default: return title.toLowerCase();
  }
};
const ModuleHeader = ({
  search,
  filter,
  dispatchSearchFun,
  handleCreate,
  title,
  disabled,
  filterObj,
  filterString,
  handleExport,
  exportFun,
  uploadFun,
  handleImport,
  module: moduleProp, // allow explicit module override
}) => {
  const [searchText, setSearchText] = useState(filterString);
  const dispatch = useDispatch();
  const handleSearch = () => {
    // setSearchText(value);
    dispatch(dispatchSearchFun(searchText));
  };

  const [showFilter, setShowFilter] = useState(false);
  const [editColumns, setEditColumns] = useState();
  const performCancel = () => {
    setEditColumns(false);
  };


  return (
    <>
      <div className="flex items-center justify-between mb-4 module-header-con">
        <div className="flex items-center space-x-4">
          <h1 style={{ fontSize: "30px", fontWeight: "600" }}>{title}</h1>
          {disabled && (
            <Tooltip title={`Create new ${title.toLowerCase()}`}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              ></Button>
            </Tooltip>
          )}
          {exportFun && (
            <Tooltip title="Export data">
              <Button
                type="primary"
                icon={<FaFileExport />}
                onClick={handleExport}
              ></Button>
            </Tooltip>
          )}
          {/* {uploadFun && (
            <Button
              type="primary"
              icon={<LuImport />}
              onClick={handleImport}
            ></Button>
          )} */}
          {/* Dynamic ExportCsvButton for supported modules */}
          {[
            'Call','Meeting','Task','Lead','Deal','Product','Quotation','Ticket','System User','Enquiry',
            'User Role','Lead Status','Product Type','Industry Type','Type Of Buyer','Reports','Email Templates','Rating','Feature Master','Feature Limit','Limit Management','Plan','Subscription'
          ].includes(title) && (
            <ExportCsvButton
              module={getModuleKey(title)}
              filters={{
                ...filterObj,
                ...(filterString ? { search: filterString } : {})
              }}
            />
          )}
          {/* ImportCsvButton for supported modules */}
          {['Task','Ticket','Product','Deal','Lead','Product Type','Industry Type','Type Of Buyer','User Role','Lead Status','Quotation','System User'].includes(title) &&
            <ImportCsvButton module={getModuleKey(title)} />
          }
        </div>
        <div className="flex items-center space-x-4">
          {search && (
            <Search
              placeholder="Search by name"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              onSearch={handleSearch}
              style={{ width: 200, height: "100%" }}
            />
          )}
          {filter && (
            <div>
              <Tooltip title="Filter data">
                <div>
                  <FilterOutlined
                    onClick={() => setShowFilter(!showFilter)}
                    className="edit-button"
                  />
                </div>
              </Tooltip>
            </div>
          )}
          <div>
            {(title === "Lead" ||
              title === "Deal") && (
                <Tooltip title="Arrange columns">
                  <div>
                    <ColumnWidthOutlined
                      onClick={() => setEditColumns(!editColumns)}
                      className="edit-button"
                    />
                  </div>
                </Tooltip>
              )}
          </div>
        </div>
      </div>
      {showFilter && (
        <>
          <StyledHR />
          {title === "Deal" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={DealFilter}
              initialObj={DealFilterObj}
            />
          ) : title === "Meeting" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={MeetingFilter}
              initialObj={MeetingFilterObj}
            />
          ) : title === "Lead" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={LeadFilter}
              initialObj={LeadFilterObj}
            />
          ) : title === "Call" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={CallFilter}
              initialObj={CallFilterObj}
            />
          ) : title === "Task" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={TaskFilter}
              initialObj={TaskFilterObj}
            />
          ) : title === "Product" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={ProductFilter}
              initialObj={ProductFilterObj}
            />
          ) : title === "Quotation" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={QuotationFilter}
              initialObj={QuotationFilterObj}
            />
          ) : title === "Timeline History" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={ActivityFilter}
              initialObj={ActivityFilterObj}
            />
          ) : title === "Ticket" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={TicketFilter}
              initialObj={TicketFilterObj}
            />
          ) : title === "Dynamic Fields" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={DynamicFieldsFilter}
              initialObj={{}}
            />
          ) : title === "Industry Type Lead Count Report" ||
            title === "Lead, Buyer & Status Ratio Report" ||
            title === "Quotation & Status Ratio Report" ||
            title === "Quotation & Product Type Ratio Report" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={ReportFilter}
              initialObj={ReportFilterObj}
            />
          ) : title === "Features-Master" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={FeaturesMasterFilter}
              initialObj={FeaturesMasterFilterObj}
            />
          ) : title === "Limit Management" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={LimitFilter}
              initialObj={LimitFilterObj}
            />
          ) : title === "Plan" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={PlanFilter}
              initialObj={PlanFilterObj}
            />
          ) : title === "Subscription" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={SubscriptionFilter}
              initialObj={SubscriptionFilterObj}
            />
          ) : title === "Enquiry" ? (
            <FilterHeader
              filter={filterObj}
              tableName={title}
              dispatchFun={EnquiryFilter}
              initialObj={EnquiryFilterObj}
            />
          ) : null}
          <StyledHR />
        </>
      )}
      {editColumns && (
        <>
          <CustomModel performCancel={() => performCancel()} width={"350px"}>
            <ArrangeColumn
              title={title}
              performCancel={(token) => {
                performCancel();
                dispatch(columnsRender(token));
              }}
            />
          </CustomModel>
        </>
      )}
    </>
  );
};

export default ModuleHeader;
