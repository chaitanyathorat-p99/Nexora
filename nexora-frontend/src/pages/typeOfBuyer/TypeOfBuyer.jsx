import React, { useEffect, useState } from "react";
import {
  useDeleteRatingMutation,
  useDeleteProductMutation,
  useFetchRatingQuery,
  useFetchProductQuery,
  useDeleteTypeOfBuyerMutation,
  useFetchTypeOfBuyerQuery,
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
import CustomModel from "../../atoms/model/CustomModel";
import { useDispatch } from "react-redux";
import {  TypeOfBuyerColumns } from "../../components/allColumns/AllColumns";
import MainTypeOfBuyer from "./form/MainTypeOfBuyer";
const modelName = "Type of Buyer";

const TypeOfBuyer = ({ lead_id, insideLead }) => {
  const { user, userToken, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [deleteTask, GetTaskResponse] = useDeleteTypeOfBuyerMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };

  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch,
  } = useFetchTypeOfBuyerQuery();
  const typeOfBuyerRows = Array.isArray(data?.data?.items) ? data.data.items : [];
  const dispatch = useDispatch()



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

      <div className="feature-table-layout">
        <ModuleHeader
          search={false}
          filter={false}

          handleCreate={handleCreate}
          title={"Type Of Buyer"}
          disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
        />
        {data ? (
          <>

            <SimpleTable data={typeOfBuyerRows} columns={TypeOfBuyerColumns({ handleEdit, handleDelete, user, modelName })} size={"small"} x={800} />

          </>
        ) : (
          <LoadingHV />
        )}
      </div>

      {modelShow &&

        <CustomModel performCancel={() => performCancel()} width={"80vw"} >

          <MainTypeOfBuyer id={lead_id} buyer_id={getData} performCancel={performCancel} />
        </CustomModel>
      }
    </>
  );
};

export default TypeOfBuyer;
