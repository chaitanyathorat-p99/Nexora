import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Popconfirm, Tag, Button as AntButton } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import EResponse from "../../atoms/response/EResponse";
import CustomModel from "../../atoms/model/CustomModel";
import MainDeal from "./form/MainDeal";
import {
  useDeleteDealsMutation,
  useFetchDealQuery,
} from "../../features/allApi";
import { checkAccess } from "../../atoms/static";
import { filterDealsByAmount } from "../../atoms/static";
import { DealPage, DealString } from "../../features/remainingSlice";
import { toQueryString } from "../../atoms/State";
import DealOverview from "./DealOverview";

const Deal = ({ popUp, lead_id }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { deal_filter, deal_string,deal_page } = useSelector((state) => state.remaining);





  const { data, isLoading, isFetching, error } = useFetchDealQuery({
    lead_id:lead_id?`&lead_id=${lead_id}`:"",
    filterString:deal_string?`&search=${deal_string}`:"",
    filterObj:toQueryString(deal_filter),
    page:deal_page?`&page=${deal_page}`:""
    

  });







 

  const [modelShow, setModelShow] = useState(false);
  const [getData, setGetData] = useState();

  const performCancel = () => {
    setGetData();
    setModelShow(false);
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

     <DealOverview popUp={popUp} lead_id={lead_id} insideLead={true}/>

    </>
  );
};

export default Deal;
