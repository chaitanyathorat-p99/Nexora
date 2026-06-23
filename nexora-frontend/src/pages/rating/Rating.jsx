import React, { useEffect, useState } from "react";
import {
    useDeleteRatingMutation,
  useDeleteProductMutation,
  useFetchRatingQuery,
  useFetchProductQuery,
} from "../../features/allApi";
import { Popconfirm, Tag } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import EResponse from "../../atoms/response/EResponse";
import { useSelector } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import MainRating from "./form/MainRating";
import CustomModel from "../../atoms/model/CustomModel";
import { useDispatch } from "react-redux";
import ExportCsvButton from '../../components/common/ExportCsvButton';
const modelName = "Rating";

const Rating = ({lead_id,insideLead}) => {
  const { user, userToken, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [deleteTask, GetTaskResponse] = useDeleteRatingMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };

  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch,
  } = useFetchRatingQuery();
  const dispatch= useDispatch()


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
          <UserOutlined /> Field
        </span>
      ),
      dataIndex: ["field"],
      key: ["field"],
      // render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
    },
    {
      title: (
        <span>
          <UserOutlined /> Weight
        </span>
      ),
      dataIndex: ["weight"],
      key: ["weight"],
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
      width: "100px",
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
            <EditOutlined
              className="edit-button"
              onClick={() => handleEdit(record)}
            />
          )}

          {(checkAccess(user, modelName, "delete") || hasFeature(user, modelName)) && (
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
  const [getData, setGetData] = useState();
  const performCancel = () => {
    setGetData();
    setModelShow(false);
  };
  const handleCreate = () => {
    setModelShow(true);
  };
  const handleEdit = (record) => {
    // navigate(`/task-create/${record?._id}`)
    setGetData(record);
    setModelShow(true);
  };

  return (
    <>
      <EResponse Response={GetTaskResponse} type={"delete"} />

      <ModuleHeader
        search={false}
        filter={false}
        handleCreate={handleCreate}
        title={"Rating"}
        disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
      />
      {data ? (
         <>
        
           <SimpleTable data={data} columns={columns} size={"small"} x={800}/>
         
       </>
      ) : (
        <LoadingHV />
      )}

      {modelShow && 
      
      <CustomModel performCancel={() => performCancel()} width={"80vw"} >

          <MainRating lead_id={lead_id} Rating_id={getData} performCancel={performCancel}/>
      </CustomModel>
      }
    </>
  );
};

export default Rating;
