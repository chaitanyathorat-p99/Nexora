import React, { useEffect, useState } from "react";
import {
  useDeleteMeetingMutation,
  useDeleteProductMutation,
  useFetchMeetingQuery,
  useFetchProductQuery,
  useFetchDynamicFieldsByModuleQuery,
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
  TeamOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  CheckCircleOutlined,
  DesktopOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import EResponse from "../../atoms/response/EResponse";
import { useSelector } from "react-redux";
import { checkAccess } from "../../atoms/static";
import { MeetingPage, MeetingString, ProductString, Refetch_Model } from "../../features/remainingSlice";
import { hasFeature, toQueryString } from "../../atoms/State";
import MainMeeting from "./form/MainMeeting";
import CustomModel from "../../atoms/model/CustomModel";
import { useDispatch } from "react-redux";
import ModelRealtimeListener from "../../socket/ModelRealtimeListener";
import ExportCsvButton from '../../components/common/ExportCsvButton';
import { generateDynamicFieldColumns, mergeColumnsWithDynamicFields } from "../../utils/dynamicFieldsUtils.jsx";
import MeetingViewModal from "./components/MeetingViewModal";
const modelName = "Meeting";

const Meeting = ({lead_id,insideLead}) => {
  const { user, userToken, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [deleteTask, GetTaskResponse] = useDeleteMeetingMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };
  const { meeting_filter, meeting_string,meeting_page,refetch_model } = useSelector(
    (state) => state.remaining
  );
  
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch,
  } = useFetchMeetingQuery({
    lead_id: lead_id ? `&lead=${lead_id}` : "",
    page:meeting_page?`&page=${meeting_page}`:"",
    filterString: meeting_string ? `&search=${meeting_string}` : "",
    filterObj: toQueryString(meeting_filter),
  });

  // Fetch dynamic fields for meeting module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "meeting" });
  const dispatch= useDispatch()

  useEffect(() => {
    if(modelName===refetch_model){
      refetch()
      dispatch(Refetch_Model(''))
    }

      }, [refetch_model]);
  const columns = [
		{
			title: <span>Sr. No.</span>,

			dataIndex: "_id",
			width: "70px",
			fixed: "left", // Fixed to the left
			key: "_id",
			render: (_id, _, index) => {
				return <span>{meeting_page * 10 - 10 + index + 1}</span>;
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
					<CalendarOutlined /> Title
				</span>
			),
			dataIndex: ["title"],
			key: ["title"],
			// render: (text) => <span className="text-[#010101] font-medium" >{text}</span>,
		},
		{
			title: (
				<span>
					<TeamOutlined /> Meeting Type
				</span>
			),
			dataIndex: ["meetingType"],
			key: ["meetingType"],
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
					<CheckCircleOutlined /> Meeting Done
				</span>
			),
			dataIndex: ["meetingDone"],
			key: "meetingDone",
      render: (meetingDone) => meetingDone ? <span style={{color: 'green',fontWeight: 'bold'}}>Completed</span> : <span style={{fontWeight: 'bold'}}>Pending</span>,
		},

		{
			title: (
				<span>
					<DesktopOutlined /> Platform
				</span>
			),
			dataIndex: ["platForm"],
			key: "platForm",
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
            title="View Meeting"
          />

					{checkAccess(user, modelName, "update") && (
						<EditOutlined className="edit-button" onClick={() => handleEdit(record)} />
					)}

					{checkAccess(user, modelName, "delete") && (
						<Popconfirm title="Sure To Delete?" onConfirm={() => handleDelete(record)}>
							<DeleteOutlined className="delete-button" />
						</Popconfirm>
					)}
				</div>
			),
		},
  ];

  // Generate dynamic field columns
  const dynamicColumns = generateDynamicFieldColumns(dynamicFields, 'meeting');
  
  // Merge static columns with dynamic columns
  const mergedColumns = mergeColumnsWithDynamicFields(columns, dynamicColumns);

  const [modelShow, setModelShow] = useState(false);
  const [getData, setGetData] = useState();
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleView = (record) => {
    setSelectedMeeting(record || null);
    setViewOpen(true);
  };

  const closeView = () => {
    setSelectedMeeting(null);
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

  const meetingRows = Array.isArray(data?.content) ? data.content : [];

  return (
    <>
      <ModelRealtimeListener eventNames={["meeting_updated", "meeting_deleted"]} refetch={refetch} />
      <EResponse Response={GetTaskResponse} type={"delete"} />

      <div className={insideLead ? "" : "feature-table-layout"}>
        <ModuleHeader
          search={true}
          filter={true}

          dispatchSearchFun={MeetingString}
          filterObj={meeting_filter}
          filterString={meeting_string}
          handleCreate={handleCreate}
          title={"Meeting"}
          disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName) }
        />

        {data ? (
           <>
           {!insideLead ? (
             <SimpleTable
               data={Array.isArray(data?.content) ? data?.content : []}
               columns={mergedColumns}
               size={"small"}
               pagination={true}
               dispatchFun={MeetingPage}
               count={data?.totalElements}
               page={meeting_page}
             />
           ) : (
             <SimpleTable data={Array.isArray(data?.content) ? data?.content : []} columns={mergedColumns} size={"small"} x={1500}/>
           )}
         </>
        ) : (
          <LoadingHV />
        )}
      </div>

      {modelShow && 
      
      <CustomModel performCancel={() => performCancel()} width={"80vw"} >

          <MainMeeting lead_id={lead_id} meeting_id={getData} performCancel={performCancel}/>
      </CustomModel>
      }

      <MeetingViewModal
        open={viewOpen}
        onClose={closeView}
        selectedMeeting={selectedMeeting}
        setSelectedMeeting={setSelectedMeeting}
        meetingRows={meetingRows}
        user={user}
      />
    </>
  );
};

export default Meeting;
