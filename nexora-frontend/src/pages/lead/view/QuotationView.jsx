import React, { useState } from "react";
import {
  useDeleteProductMutation,
  useDeleteQuotationMutation,
  useFetchProductQuery,
  useFetchQuotationQuery,
} from "../../../features/allApi";
import { Popconfirm, Tag } from "antd";
import SimpleTable from "../../../components/tables/SimpleTable";
import LoadingHV from "../../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import EResponse from "../../../atoms/response/EResponse";
import { useSelector } from "react-redux";
import { checkAccess, hasFeature } from "../../../atoms/static";
import { ProductString, QuotationFilter, QuotationString } from "../../../features/remainingSlice";
import { toQueryString } from "../../../atoms/State";
import MainQuotation from "../../quotation.jsx/form/MainQuotation";
import CustomModel from "../../../atoms/model/CustomModel";
import QuotationDetailView from "../../quotation.jsx/view/QuotationDetailView";
import { QuotationFilterObj } from "../../../atoms/StaticFilter";
const modelName = "Quotation";

const QuotationView = ({deal_id,lead}) => {
  const { user, userToken, loading } = useSelector((state) => state.user);

  console.log("deal_id", deal_id);
  const navigate = useNavigate();

  const [deleteTask, GetTaskResponse] = useDeleteQuotationMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };
  const { quotation_filter, quotation_string } = useSelector(
    (state) => state.remaining
  );
  const canCreate = checkAccess(user, modelName, "write") || hasFeature(user, modelName);
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useFetchQuotationQuery({
    filterString: quotation_string ? `&search=${quotation_string}` : "",lead: lead ? `&lead=${lead}` : "",
    filterObj: toQueryString(quotation_filter),
    // If you want to keep deal_id filter, you can merge it here if needed
  });

  const columns = [
    {
      title: <span>Sr. No.</span>,

      dataIndex: "_id",
      width: "70px",
      fixed: "left", // Fixed to the left
      key: "_id",
      render: (_id, _, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: (
        <span>
          <UserOutlined /> Name
        </span>
      ),
      dataIndex: "name",
      key: "name",
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
      render: (text, record) => (
        <div>
          <div className="text-[#010101] font-medium">{record?.name}</div>
        </div>
      ), //
    },
    {
      title: (
        <span>
          <UserOutlined /> Quotation No.
        </span>
      ),
      dataIndex: "name",
      key: "name",
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
      render: (text, record) => (
        <div>
          <div className="text-[#010101] font-medium">{record?.quotationNo}</div>
        </div>
      ), //
    },
    {
      title: (
        <span>
          <UserOutlined /> Revision No
        </span>
      ),
      width: "130px",

      dataIndex: ["revisionNo"],
      key: ["revisionNo"],
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
    },
    // {
    //   title: (
    //     <span>
    //       <UserOutlined /> Created By
    //     </span>
    //   ),
    //   dataIndex: ["createdBy","name"],
    //   key: ["createdBy","name"],
    //   // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,

    // },

    {
      title: (
        <span>
          <HomeOutlined /> Lead
        </span>
      ),
      dataIndex: ["lead", "firstName"],
      key: ["lead", "firstName"],
    },
    {
      title: (
        <span>
          <HomeOutlined /> Deal
        </span>
      ),
      dataIndex: ["deal", "dealType"],
      key: ["deal", "dealType"],
    },

    {
      title: (
        <span>
          <HomeOutlined /> Discount
        </span>
      ),
      dataIndex: ["discount"],
      key: "discount",
    },
  
 

    {
      title: (
        <span>
          <ClockCircleOutlined /> Created At
        </span>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "Action",
      key: "edit",
      width: "140px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {checkAccess(user, modelName, "update") && (
            <EyeOutlined
              className="edit-button"
              onClick={() => handleView(record)}
            />
          )}
          {(checkAccess(user, modelName, "update") || hasFeature(user, modelName))  && (
            <EditOutlined
              className="edit-button"
              onClick={() => handleEdit(record)}
            />
          )}

          {(checkAccess(user, modelName, "delete") || hasFeature(user, modelName))  && (
            <Popconfirm
              title="Sure To Delete?"
              onConfirm={() => handleDelete(record)}
            >
              <DeleteOutlined className="delete-button" />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const [modelShow, setModelShow] = useState(false);
  const [modelShowView, setModelShowView] = useState(false);
  const [getData, setGetData] = useState();
  const performCancel = () => {
    setGetData();
    setModelShow(false);
    setModelShowView(false);
  };
  const handleCreate = () => {
    setModelShow(true);
  };
  const handleEdit = (record) => {
    // navigate(`/task-create/${record?._id}`)
    setGetData(record?._id);
    setModelShow(true);
  };
  const handleView = (record) => {
    // navigate(`/task-create/${record?._id}`)
    setGetData(record?._id);
    setModelShowView(true);
  };

  return (
    <>
      <EResponse Response={GetTaskResponse} type={"delete"} />

      <ModuleHeader
        search={true}
        filter={true}
        dispatchSearchFun={QuotationString}
        filterObj={quotation_filter}
        filterString={quotation_string}
        handleCreate={handleCreate}
        title={modelName}
        disabled={canCreate}
      />
      {data ? (
        <SimpleTable data={data} columns={columns} size={"small"} x={1500} />
      ) : (
        <LoadingHV />
      )}

      {modelShow && (
        <CustomModel
          width={"75vw"}
          performCancel={performCancel}
          fetch={false}
        >
          <MainQuotation getData={getData} lead={lead} deal_id={deal_id} performCancel={performCancel} />
        </CustomModel>
      )}

      {modelShowView && (
        <CustomModel
          width={"80vw"}
          height={"80vh"}
          performCancel={performCancel}
          fetch={false}
        >
          <QuotationDetailView getData={getData} performCancel={performCancel} />
        </CustomModel>
      )}
    </>
  );
};

export default QuotationView;
