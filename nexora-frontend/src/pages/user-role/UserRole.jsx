import React from "react";
import { useDeleteTaskMutation, useDeleteUserRoleMutation, useFetchLeadQuery, useFetchLeadStatusQuery, useFetchTaskQuery, useFetchUserRoleQuery } from "../../features/allApi";
import { GiConsoleController } from "react-icons/gi";
import { Popconfirm, Tag } from "antd";
import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import EResponse from "../../atoms/response/EResponse";
import { checkAccess, hasFeature } from "../../atoms/static";
import { useSelector } from "react-redux";
import { UserRoleString } from "../../features/remainingSlice";
import ExportCsvButton from '../../components/common/ExportCsvButton';
const modelName = "User-Role";

const UserRole = () => {
  const navigate=useNavigate()
  const { user, userToken, loading} = useSelector(
    (state) => state.user
  );
  const handleEdit=(record)=>{
    navigate(`create/${record?._id}`)
    
    }
    const [deleteTask, GetTaskResponse] = useDeleteUserRoleMutation();

  const handleDelete=(record)=>{
    deleteTask(record)
    }
    const { user_role_filter,user_role_string} = useSelector(
      (state) => state.remaining
    );
    const {
        data: data,
        isLoading: isLoading,
        isFetching: fetch,
        error: error,
      } = useFetchUserRoleQuery({
        filterString:user_role_string?`&search=${user_role_string}`:"",

      });
    
      const columns = [
        {
          title: <span>Sr. No.</span>,
          
          dataIndex: "_id",
          width:"70px",
          fixed: 'left', // Fixed to the left
          key: "_id",
          render: (_id, _,index) => {
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
              {/* <div className="customAge">{record?.description}</div> */}
            </div>
          ), // 
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
          title: 'Action',
          key: 'edit',
          width: "100px",
          fixed: 'right',
          render: (_, record) => (<div style={{display:"flex",gap:"10px"}}>
            {(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
            <EditOutlined
              className="edit-button"
              onClick={() => handleEdit(record)}
            />
          )}
          
          {(checkAccess(user, modelName, "update") || hasFeature(user, modelName)) && (
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
      const handleCreate = () => {
        navigate('create')
      };

  return (
    <>
          <EResponse  Response={GetTaskResponse} type={"delete"} />

    <div className="feature-table-layout">
      <ModuleHeader
      search={true}
        filterObj={user_role_filter}
        filterString={user_role_string}
        dispatchSearchFun={UserRoleString}
      handleCreate={handleCreate} title={"User Role"}  disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}/>

      {data ? (
        <SimpleTable data={data?.data} columns={columns} size={"small"}  x={800}/>
      ) : (
        <LoadingHV />
      )}
    </div>
  </>
  )
}

export default UserRole
