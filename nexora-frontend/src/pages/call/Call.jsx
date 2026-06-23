import React, { useEffect, useState } from "react";
import {
    useDeleteCallMutation,
    useDeleteMeetingMutation,
  useDeleteProductMutation,
  useFetchCallQuery,
  useFetchMeetingQuery,
  useFetchProductQuery,
  useFetchDynamicFieldsByModuleQuery,
} from "../../features/allApi";
import { Popconfirm, Tag, Tooltip } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  TagOutlined,
  CheckCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import EResponse from "../../atoms/response/EResponse";
import { useSelector } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import { CallPage, CallString, MeetingPage, MeetingString, ProductString, Refetch_Model } from "../../features/remainingSlice";
import { toQueryString } from "../../atoms/State";
import CustomModel from "../../atoms/model/CustomModel";
import MainCall from "./form/MainCall";
import { useDispatch } from "react-redux";
import ModelRealtimeListener  from "../../socket/ModelRealtimeListener";
import ExportCsvButton from '../../components/common/ExportCsvButton';
import { generateDynamicFieldColumns, mergeColumnsWithDynamicFields } from "../../utils/dynamicFieldsUtils.jsx";
import CallViewModal from "./components/CallViewModal";
const modelName = "Call";

const Call = ({lead_id,insideLead}) => {
  const { user, userToken, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [deleteTask, GetTaskResponse] = useDeleteCallMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };
  const { call_filter, call_string,call_page,refetch_model } = useSelector(
    (state) => state.remaining
  );
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch
  } = useFetchCallQuery({
    lead_id: lead_id ? `&lead=${lead_id}` : "",
    page:call_page?`&page=${call_page}`:"",
    filterString: call_string ? `&search=${call_string}` : "",
    filterObj: toQueryString(call_filter),
  });

  // Fetch dynamic fields for call module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "call" });

  const columns = [
		{
			title: <span>Sr. No.</span>,

			dataIndex: "_id",
			width: "70px",
			fixed: "left", // Fixed to the left
			key: "_id",
			render: (_id, _, index) => {
				return <span>{call_page * 10 - 10 + index + 1}</span>;
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
			render: (text, record) => (
				<div
					className=" font-medium"
					style={{ color: "var(--color-primary)", cursor: "pointer" }}
				>
					{record?.lead?.firstName}
				</div>
			),
		},
		{
			title: (
				<span>
					<TagOutlined /> Title
				</span>
			),
			dataIndex: ["title"],
			key: ["title"],
			// render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
		},

		{
			title: (
				<span>
					<CheckCircleOutlined /> Call Done
				</span>
			),
			dataIndex: ["callDone"],
			key: "callDone",
			render: (callDone) => (
				<Tooltip
					title="Current status of the lead"
					placement="left"
					overlayClassName="customTooltip"
				>
					{callDone ? (
						<Tag className="text-sm font-semibold" color="green">
							Call Done
						</Tag>
					) : (
						<Tag color="red">Not Called</Tag>
					)}
				</Tooltip>
			),
			width: 180,
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
			width: "100px",
			fixed: "right",
			render: (_, record) => (
				<div style={{ display: "flex", gap: "10px" }}>
          <EyeOutlined
            className="edit-button"
            onClick={() => handleView(record)}
            title="View Call"
          />

					{(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
						<EditOutlined className="edit-button" onClick={() => handleEdit(record)} />
					)}

					{(checkAccess(user, modelName, "delete") || hasFeature(user, modelName)) && (
						<Popconfirm title="Sure To Delete?" onConfirm={() => handleDelete(record)}>
							<DeleteOutlined className="delete-button" />
						</Popconfirm>
					)}
				</div>
			),
		},
  ];

    // Generate dynamic field columns
  const dynamicColumns = generateDynamicFieldColumns(dynamicFields, 'call');
  
  console.log('dynamicFields', dynamicFields);
  console.log('dynamicFields length:', dynamicFields?.length);
  console.log('dynamicFields details:', dynamicFields?.map(field => ({
    fieldName: field.fieldName,
    displayName: field.displayName,
    fieldType: field.fieldType,
    isActive: field.isActive,
    isExportable: field.isExportable
  })));
  console.log('data?.content sample:', data?.content?.[0]);
  console.log('All data content:', data?.content);
  console.log('Checking for dynamicFields in records:');
  data?.content?.forEach((record, index) => {
    console.log(`Record ${index}:`, record);
    console.log(`Record ${index} dynamicFields:`, record?.dynamicFields);
    console.log(`Record ${index} has dynamicFields:`, !!record?.dynamicFields);
    console.log(`Record ${index} dynamicFields keys:`, record?.dynamicFields ? Object.keys(record.dynamicFields) : []);
  });
  console.log('dynamicColumns generated:', dynamicColumns);
  
  // Merge static columns with dynamic columns
  const mergedColumns = mergeColumnsWithDynamicFields(columns, dynamicColumns);

  console.log('mergedColumns', mergedColumns);
  console.log('Final merged columns length:', mergedColumns.length);
  console.log('Original columns length:', columns.length);
  console.log('Dynamic columns length:', dynamicColumns.length);


  const [modelShow, setModelShow] = useState(false);
  const [getData, setGetData] = useState();
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  const handleView = (record) => {
    setSelectedCall(record || null);
    setViewOpen(true);
  };

  const closeView = () => {
    setSelectedCall(null);
    setViewOpen(false);
  };

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
  const dispatch= useDispatch()

  useEffect(() => {
    if(modelName===refetch_model){
      refetch()
      dispatch(Refetch_Model(''))
    }

      }, [refetch_model]);
    const callRows = Array.isArray(data?.content) ? data.content : [];

  return (
    <>
      <ModelRealtimeListener eventNames={["call_updated", "call_deleted"]} refetch={refetch} />
      <EResponse Response={GetTaskResponse} type={"delete"} />

      <div className={insideLead ? "" : "feature-table-layout"}>
        <ModuleHeader
          search={true}
          filter={true}
          dispatchSearchFun={CallString}
          filterObj={call_filter}
          filterString={call_string}
          handleCreate={handleCreate}
          title={"Call"}
          disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
        />
        {data ? (
           <>
           {!insideLead ? (
             <SimpleTable
               data={Array.isArray(data?.content) ? data?.content : []}
               columns={mergedColumns}
               size={"small"}
               pagination={true}
               dispatchFun={CallPage}
               count={data?.totalElements}
               page={call_page}
             />
           ) : (
             <SimpleTable data={Array.isArray(data?.content) ? data?.content : []} columns={mergedColumns} size={"small"} x={800}/>
           )}
         </>
        ) : (
          <LoadingHV />
        )}
      </div>

      {modelShow && 
      
      <CustomModel performCancel={() => performCancel()} width={"80vw"} >

          <MainCall lead_id={lead_id} call_id={getData} performCancel={performCancel}/>
      </CustomModel>
      }

      <CallViewModal
        open={viewOpen}
        onClose={closeView}
        selectedCall={selectedCall}
        setSelectedCall={setSelectedCall}
        callRows={callRows}
        user={user}
      />
    </>
  );
};

export default Call;
