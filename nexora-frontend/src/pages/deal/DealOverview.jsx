import React, { useState } from "react";
import {
  useDeleteDealsMutation,
  useFetchDealQuery,
  useFetchDynamicFieldsByModuleQuery,
} from "../../features/allApi";
import { Popconfirm, Tag, Button as AntButton, Tooltip } from "antd"; // Imported AntButton to avoid name conflicts
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileAddOutlined,
  FileExcelFilled,
  FileTextTwoTone,
  FileTextOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import EResponse from "../../atoms/response/EResponse";
import { useSelector } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import MainDeal from "./form/MainDeal";
import CustomModel from "../../atoms/model/CustomModel";
import DealStageComponent from "../lead/view/componenets/DealStageComponent";
import { FileEdit } from "lucide-react";
import { toQueryString } from "../../atoms/State";
import { DealPage, DealString } from "../../features/remainingSlice";
import DealView from "./view/DealView";
import MainDealView from "./view/MainDealView";
import { DealColumns } from "../../components/allColumns/DealColumns";
import ModelRealtimeListener from "../../socket/ModelRealtimeListener";
// Utility function to create query params
const createQueryParams = (params) => {
  const queryString = Object.keys(params)
    .map((key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        return value.map((item) => `${key}=${item}`).join("&");
      }
      return `${key}=${value}`;
    })
    .filter((param) => param)
    .join("&");
  return queryString;
};

const modelName = "Deal";

const DealOverview = ({ popUp, lead_id, insideLead }) => {
  const { user,columns } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [deleteTask, GetTaskResponse] = useDeleteDealsMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };
  const { deal_filter, deal_string, deal_page } = useSelector(
    (state) => state.remaining
  );

  const { data, isLoading, isFetching, error, refetch } = useFetchDealQuery({
    lead_id: lead_id ? `&lead=${lead_id}` : "",

    filterString: insideLead
      ? deal_string
        ? `&search=${deal_string}`
        : ""
      : "",
    filterObj: insideLead ? toQueryString(deal_filter) : "",
    page: insideLead ? (deal_page ? `&page=${deal_page}` : "") : "",
  });

  // Fetch dynamic fields for deal module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "deal" });
  const [deal_id, setDealId] = useState();
  const [showQuotation, setShowQuotation] = useState(false);
  const QuotationView = (record) => {
    if (insideLead) {
      navigate(`/deals/${record?._id}`);
    } else {
      setShowQuotation(true);
      setDealId(record);
    }
  };

  const [modelShow, setModelShow] = useState(false);
  const [getData, setGetData] = useState();

  const performCancel = () => {
    setGetData();
    setModelShow(false);
    setDealId();
    setShowQuotation(false);
  };

  const handleCreate = () => {
    if (popUp) {
      setModelShow(true);
    } else {
      navigate("create");
    }
  };

  const handleEdit = (record) => {
    if (popUp) {
      setGetData(record?._id);
      setModelShow(true);
    } else {
      navigate(`create/${record?._id}`);
    }
  };

  return (
    <>
      <ModelRealtimeListener eventNames={["deal_updated", "deal_deleted"]} refetch={refetch} />
      <EResponse Response={GetTaskResponse} type={"delete"} />

      {/* <DealStageComponent /> */}

      <div className={popUp ? "" : "feature-table-layout"}>
        <ModuleHeader
          handleCreate={handleCreate}
          title={"Deal"}
          filter={insideLead}
          disabled={checkAccess(user, "Deal", "write") || hasFeature(user, "Deal")}
          dispatchSearchFun={DealString}
          filterObj={deal_filter}
          filterString={deal_string}
        />

        {data ? (
          <>
            {insideLead ? (
              <SimpleTable
                data={data?.content}
                columns={DealColumns({
                  deal_page,
                  handleEdit,
                  handleDelete,
                  user,
                  modelName,
                  columns,
                  insideLead,
                  QuotationView,
                  dynamicFields,
                })}
                size={"small"}
                pagination={true}
                dispatchFun={DealPage}
                count={data?.totalElements}
                page={deal_page}
              />
            ) : (
              <SimpleTable
                data={data}
                columns={DealColumns({
                  deal_page,
                  handleEdit,
                  handleDelete,
                  user,
                  modelName,
                  columns,
                  insideLead,
                  QuotationView,
                  dynamicFields,
                })}
                size={"small"}
              />
            )}
          </>
        ) : (
          <LoadingHV />
        )}
      </div>

      {modelShow && (
        <CustomModel performCancel={() => performCancel()} width={"80vw"}>
          <MainDeal
            getData={getData}
            lead_id={lead_id}
            performCancel={performCancel}
          />
        </CustomModel>
      )}
      {showQuotation && (
        <CustomModel
          performCancel={() => performCancel()}
          width={"80vw"}
          height={"90vh"}
        >
          <MainDealView deal_id={deal_id} />
        </CustomModel>
      )}
    </>
  );
};

export default DealOverview;
