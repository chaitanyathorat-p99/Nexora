import React, { useEffect } from "react";
import { useDeleteTicketMutation, useFetchTicketsQuery, useUpdateTicketMutation, useFetchDynamicFieldsByModuleQuery } from "../../features/allApi";
import { Popconfirm, Space, Tag, Tooltip } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
	FileTextOutlined,
	TagOutlined,
	ClockCircleOutlined,
	EditOutlined,
	DeleteOutlined,
	UserOutlined,
	ExclamationCircleOutlined,
	EyeOutlined,
	ClockCircleTwoTone,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import EResponse from "../../atoms/response/EResponse";
import { Refetch_Model, TicketPage, TicketString } from "../../features/remainingSlice";
import { toQueryString } from "../../atoms/State";
import ModelRealtimeListener from "../../socket/ModelRealtimeListener";
import { generateDynamicFieldColumns, mergeColumnsWithDynamicFields } from "../../utils/dynamicFieldsUtils.jsx";

const Ticket = () => {
	const modelName = "TICKET";
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.user);
	const { ticket_filter, ticket_string, ticket_page, refetch_model } = useSelector((state) => state.remaining);
	
	console.log(ticket_filter)

	console.log("ticket_page", ticket_page);
	const {
		data,
		isLoading,
		isFetching,
		error,
		refetch
	} = useFetchTicketsQuery({
		filterString: ticket_string ? `search=${ticket_string}` : "",
		filterObj: toQueryString(ticket_filter),
		page: ticket_page ? `page=${ticket_page}` : "",
	});

	// Fetch dynamic fields for ticket module
	const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "ticket" });

	const [deleteTicket, deleteResponse] = useDeleteTicketMutation();
	const [updateUser, updateUserResponse] = useUpdateTicketMutation();

	// REMOVE: Real-time ticket update logic (useEffect with socket.io-client)

	useEffect(() => {
		if (modelName === refetch_model) {
			refetch();
			dispatch(Refetch_Model(''));
		}
	}, [refetch_model, refetch, dispatch]);

	const handleEdit = (record) => {
		navigate(`create/${record?._id}`);
	};

	const handleView = (record) => {
		navigate(`${record?._id}`);
	};

	const handleDelete = (record) => {
		deleteTicket(record);
	};

	const getSlaDueStatus = (dueDate) => {
		if (!dueDate) return "normal";
		
		const now = new Date();
		const due = new Date(dueDate);
		const diffHours = (due - now) / (1000 * 60 * 60);
		
		if (diffHours < 0) return "overdue";
		if (diffHours < 24) return "soon";
		return "normal";
	};

	const columns = [
		{
			title: <span>Sr. No.</span>,
			dataIndex: "_id",
			width: "70px",
			fixed: "left",
			render: (_id, record, index) => {
				return <span>{index + 1}</span>;
			},
		},
		{
			title: (
				<span>
					<FileTextOutlined /> Subject
				</span>
			),
			dataIndex: "subject",
			key: "subject",
			render: (text, record) => (
				<div>
					<div className="text-[#010101] font-medium">{record?.subject}</div>
					<div className="customAge">
						{record?.description ? `${record.description.substring(0, 50)}...` : ""}
					</div>
				</div>
			),
		},
		{
			title: (
				<span>
					<TagOutlined /> Category
				</span>
			),
			dataIndex: "category",
			key: "category",
			render: (category) => {
				const normalized = String(category || "").trim().toLowerCase();
				const value = normalized || "n/a";
				return (
					<Tag color={value === "question" ? "blue" : value === "problem" ? "orange" : "default"}>
						{value === "n/a" ? "N/A" : value.charAt(0).toUpperCase() + value.slice(1)}
					</Tag>
				);
			},
		},
		{
			title: (
				<span>
					<TagOutlined /> Status
				</span>
			),
			dataIndex: "status",
			key: "status",
			render: (status) => {
				const normalized = String(status || "").trim().toLowerCase().replace(/\s+/g, "_");
				let color;
				switch (normalized) {
					case "open":
						color = "blue";
						break;
					case "in_progress":
						color = "orange";
						break;
					case "resolved":
						color = "green";
						break;
					case "closed":
						color = "gray";
						break;
					default:
						color = "gray";
				}
				return <Tag color={color}>{normalized ? normalized.toUpperCase() : "N/A"}</Tag>;
			},
		},
		{
			title: (
				<span>
					<ExclamationCircleOutlined /> Priority
				</span>
			),
			dataIndex: "priority",
			key: "priority",
			render: (priority) => {
				const normalized = String(priority || "").trim().toLowerCase();
				let color;
				switch (normalized) {
					case "urgent":
						color = "red";
						break;
					case "high":
						color = "orange";
						break;
					case "medium":
						color = "blue";
						break;
					case "low":
						color = "green";
						break;
					default:
						color = "gray";
				}
				return <Tag color={color}>{normalized ? normalized.toUpperCase() : "N/A"}</Tag>;
			},
		},
		{
			title: (
				<span>
					<ClockCircleOutlined /> SLA Due
				</span>
			),
			dataIndex: "slaDue",
			key: "slaDue",
			render: (slaDue) => {
				const status = getSlaDueStatus(slaDue);
				let color = "#1890ff";
				if (status === "overdue") color = "#ff4d4f";
				if (status === "soon") color = "#faad14";
				
				return (
					<Tooltip title={status === "overdue" ? "Overdue" : "Due by"}>
						<span style={{ color }}>
							<ClockCircleTwoTone twoToneColor={color} style={{ marginRight: 5 }} />
							{slaDue ? new Date(slaDue).toLocaleString() : "N/A"}
						</span>
					</Tooltip>
				);
			},
		},
		{
			title: (
				<span>
					<UserOutlined /> Agent
				</span>
			),
			dataIndex: "assignedTo",
			key: "assignedTo",
			render: (assignedTo) => {
				if (!assignedTo) return "Unassigned";
				if (typeof assignedTo === "string") return assignedTo;
				return assignedTo?.username || assignedTo?.name || assignedTo?._id || "Unassigned";
			},
		},
		{
			title: (
				<span>
					<TagOutlined /> Tags
				</span>
			),
			dataIndex: "tags",
			key: "tags",
			render: (tags) => (
				<Space size={[0, 4]} wrap>
					{tags && tags.length > 0 ? (
						tags.map((tag) => (
							<Tag key={tag} color="cyan">
								{tag}
							</Tag>
						))
					) : (
						<span>No tags</span>
					)}
				</Space>
			),
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
			key: "action",
			width: "120px",
			fixed: "right",
			render: (_, record) => (
				<div style={{ display: "flex", gap: "5px" }}>
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
	const dynamicColumns = generateDynamicFieldColumns(dynamicFields, 'ticket');
	
	// Merge static columns with dynamic columns
	const mergedColumns = mergeColumnsWithDynamicFields(columns, dynamicColumns);

	const handleCreate = () => {
		navigate("create");
	};

	// For future Kanban toggle functionality
	const handleViewToggle = () => {
		// Function for toggling between table and kanban view
		// Can be implemented in the future similar to Task
	};

	return (
		<>
			<ModelRealtimeListener eventNames={["ticket_updated", "ticket_deleted"]} refetch={refetch} />
			<EResponse Response={deleteResponse} type={"delete"} />
			<EResponse Response={updateUserResponse} type={"update"} />
			
			<div className="feature-table-layout">
				<ModuleHeader
					filterObj={ticket_filter}
					filterString={ticket_string}
					dispatchSearchFun={TicketString}
					filter={true}
					handleCreate={handleCreate}
					title={"Ticket"}
					disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
				/>
				
				{/* Uncomment when kanban view is implemented
				<Button onClick={() => handleViewToggle()}>
					View {!kanban ? <>Kanban</> : <>Table</>}
				</Button>
				*/}
				
				{data ? (
					<SimpleTable
						pagination={true}
						dispatchFun={TicketPage}
						count={data?.data?.total}
						page={ticket_page || 1}
						data={data?.data?.tickets}
						columns={mergedColumns}
						size={"small"}
						x={1500}
					/>
				) : (
					<LoadingHV />
				)}
			</div>
		</>
	);
};

export default Ticket; 