import React, { useEffect, useState } from "react";
import {
    useDeleteIndustryTypeMutation,
    useFetchIndustryTypeQuery,
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
import { checkAccess } from "../../atoms/static";
// import MainRating from "./form/MainRating";
import CustomModel from "../../atoms/model/CustomModel";
import { useDispatch } from "react-redux";
import { SegmentColumns, } from "../../components/allColumns/AllColumns";
import { Refetch_Model } from "../../features/remainingSlice";
import MainSegment from "./form/MainIndustryType";
import { hasFeature } from "../../atoms/State";
const modelName = "Industry-Type";

const IndustryType = ({ lead_id, insideLead }) => {
    const { user, userToken, loading } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [deleteTask, GetTaskResponse] = useDeleteIndustryTypeMutation();

    const handleDelete = (record) => {
        deleteTask(record);
    };
    const { refetch_model } = useSelector(
        (state) => state.remaining
    );

    const {
        data: data,
        isLoading: isLoading,
        isFetching: fetch,
        error: error,
        refetch,
    } = useFetchIndustryTypeQuery();
    const industryTypeRows = Array.isArray(data?.data?.items) ? data.data.items : [];
    const dispatch = useDispatch()

    useEffect(() => {
        if (modelName === refetch_model) {
            refetch()
            dispatch(Refetch_Model(''))
        }

    }, [refetch_model]);


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
                    title={"Industry Type"}
                    disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
                />
                {data ? (
                    <>

                        <SimpleTable data={industryTypeRows} columns={SegmentColumns({ handleEdit, handleDelete, user, modelName })} size={"small"} x={800} />

                    </>
                ) : (
                    <LoadingHV />
                )}
            </div>

            {modelShow &&

                <CustomModel performCancel={() => performCancel()} width={"80vw"} >

                    <MainSegment id={lead_id} buyer_id={getData} performCancel={performCancel} />
                </CustomModel>
            }
        </>
    );
};

export default IndustryType;
