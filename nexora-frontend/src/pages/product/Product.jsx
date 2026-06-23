import React, { useState } from "react";
import {
  useDeleteProductMutation,
  useDeleteTaskMutation,
  useFetchLeadQuery,
  useFetchLeadStatusQuery,
  useFetchProductQuery,
  useFetchTaskQuery,
  useFetchProductTypeQuery,
  useFetchDynamicFieldsByModuleQuery,
} from "../../features/allApi";
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
  TagOutlined,
  DollarOutlined,
  ShoppingOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";
import EResponse from "../../atoms/response/EResponse";
import { useSelector } from "react-redux";
import { checkAccess, hasFeature } from "../../atoms/static";
import MainProduct from "./form/MainProduct";
import { ProductString } from "../../features/remainingSlice";
import { toQueryString } from "../../atoms/State";
import ModelRealtimeListener from "../../socket/ModelRealtimeListener";
import { generateDynamicFieldColumns, mergeColumnsWithDynamicFields } from "../../utils/dynamicFieldsUtils.jsx";
const modelName = "Product";

const Product = () => {
  const { user, userToken, loading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [deleteTask, GetTaskResponse] = useDeleteProductMutation();

  const handleDelete = (record) => {
    deleteTask(record);
  };
  const { product_filter,product_string} = useSelector(
    (state) => state.remaining
  );
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch,
  } = useFetchProductQuery({
    filterString:product_string?`&search=${product_string}`:"",
    filterObj:toQueryString(product_filter)

  });

  // Fetch dynamic fields for product module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "product" });

  const { data: productTypes } = useFetchProductTypeQuery();

  const getProductTypeName = (productType) => {
    if (!productType) return '';
    // If populated (object)
    if (typeof productType === 'object' && productType !== null && productType.name) {
      return productType.name;
    }
    // If string, try to find in productTypes
    if (productTypes) {
      const found = productTypes.find(pt => pt._id === productType);
      return found ? found.name : productType;
    }
    return productType;
  };

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
          <TagOutlined /> Name
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
          <SolutionOutlined /> Product Type
        </span>
      ),
      dataIndex: ["productType"],
      key: ["productType"],
      render: (productType) => (
        <span className="text-[#010101] font-medium">
          {getProductTypeName(productType)}
        </span>
      ),
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
          <DollarOutlined /> Price Type
        </span>
      ),
      dataIndex: ["priceType"],
      key: "priceType",
    },

    {
      title: (
        <span>
          <TagOutlined /> Discount
        </span>
      ),
      dataIndex: ["discount"],
      key: "discount",
    },
    {
      title: (
        <span>
          <DollarOutlined /> Price
        </span>
      ),
      dataIndex: ["price"],
      key: "price",
    },
    {
      title: (
        <span>
          <ShoppingOutlined /> Subscription Cycle
        </span>
      ),
      dataIndex: ["subscriptionCycle"],
      key: "subscriptionCycle",
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

  // Generate dynamic field columns
  const dynamicColumns = generateDynamicFieldColumns(dynamicFields, 'product');
  
  // Merge static columns with dynamic columns
  const mergedColumns = mergeColumnsWithDynamicFields(columns, dynamicColumns);

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
    setGetData(record)
    setModelShow(true)
  };

  return (
    <>
      <ModelRealtimeListener eventNames={["product_updated", "product_deleted"]} refetch={refetch} />
      <EResponse Response={GetTaskResponse} type={"delete"} />

      <div className="feature-table-layout">
        <ModuleHeader
        search={true}
              filter={true}
              dispatchSearchFun={ProductString}
              filterObj={product_filter}
              filterString={product_string}
          handleCreate={handleCreate}
          title={"Product"}
          disabled={checkAccess(user, modelName, "write") || hasFeature(user, modelName)}
        />
        {data ? (
          <SimpleTable data={data} columns={mergedColumns} size={"small"} x={1500} />
        ) : (
          <LoadingHV />
        )}
      </div>

      {modelShow && <MainProduct getData={getData} performCancel={performCancel}/>}
    </>
  );
};

export default Product;
