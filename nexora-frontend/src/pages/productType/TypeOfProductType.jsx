import React, { useEffect, useState } from "react";
import {
  useDeleteProductTypeMutation,
  useFetchProductTypeQuery,
} from "../../features/allApi";
import { Popconfirm } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
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
import { ProductTypeColumns } from "../../components/allColumns/AllColumns";
import MainProductType from "./form/MainProductType";
const modelName = "Product-Type";

const TypeOfProductType = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [deleteTask, GetTaskResponse] = useDeleteProductTypeMutation();
  const handleDelete = (record) => {
    deleteTask(record);
  };
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch,
  } = useFetchProductTypeQuery();
  const dispatch = useDispatch();
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
          title={"Product Type"}
          disabled={checkAccess(user, modelName, "create") || hasFeature(user, modelName)}
        />
        {data ? (
          <>
            <SimpleTable data={data} columns={ProductTypeColumns({ handleEdit, handleDelete, user, modelName })} size={"small"} x={800} />
          </>
        ) : (
          <LoadingHV />
        )}
      </div>
      {modelShow &&
        <CustomModel performCancel={() => performCancel()} width={"80vw"} >
          <MainProductType product_type_id={getData} performCancel={performCancel} />
        </CustomModel>
      }
    </>
  );
};

export default TypeOfProductType; 