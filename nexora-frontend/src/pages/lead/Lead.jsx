import React from "react";
import {
  useDeleteLeadMutation,
  useFetchLeadQuery,
  useImportLeadMutation,
  useFetchDynamicFieldsByModuleQuery,
} from "../../features/allApi";

import SimpleTable from "../../components/tables/SimpleTable";
import LoadingHV from "../../atoms/loading/LoadingHV";

import ModuleHeader from "../../components/moduleHeaders/ModuleHeader";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import EResponse from "../../atoms/response/EResponse";
import { checkAccess } from "../../atoms/static";
import { useSelector } from "react-redux";
import { PlusIcon } from "lucide-react";
import { LeadPage, LeadString } from "../../features/remainingSlice";
import { hasFeature, toQueryString } from "../../atoms/State";
import {  LeadColumns } from "../../components/allColumns/LeadColumns";
import ModelRealtimeListener from "../../socket/ModelRealtimeListener";
import ExportCsvButton from '../../components/common/ExportCsvButton';
const modelName = "Lead";
const Lead = ({ popUp, selectLead }) => {
  const navigate = useNavigate();
  const [deleteTask, GetTaskResponse] = useDeleteLeadMutation();
  const [importLead, GetImportLeadResponse] = useImportLeadMutation();

  const handleDelete = (record) => {
    if (!(checkAccess(user, modelName, "delete") || hasFeature(user, modelName))) {
      return;
    }
    deleteTask(record);
  };
  const { user, userToken, loading,columns } = useSelector((state) => state.user);
  const { lead_filter, lead_string, lead_page } = useSelector(
    (state) => state.remaining
  );
  const { report_filter } = useSelector(
    (state) => state.remaining
  );
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
    refetch
  } = useFetchLeadQuery({
    filterString: lead_string ? `&search=${lead_string}` : "",
    filterObj: toQueryString(lead_filter),
    page: lead_page ? `&page=${lead_page}` : ""
  });

  // Fetch dynamic fields for lead module
  const { data: dynamicFields } = useFetchDynamicFieldsByModuleQuery({ moduleType: "lead" });
  const handleEdit = (record) => {
    navigate(`create/${record?._id}`);
  };
  const handleView = (record) => {
    navigate(`${record?._id}`);
  };

  const handleCreate = () => {
    navigate("create");
  };


  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      await importLead(formData);
    };
    input.click();
  }

  return (
    <>
      <ModelRealtimeListener eventNames={["lead_updated", "lead_deleted"]} refetch={refetch} />
      <EResponse Response={GetTaskResponse} type={"delete"} />

      <div className={popUp ? "" : "feature-table-layout"}>
        <ModuleHeader
          filter={true}
          search={true}
          uploadFun={true}
          dispatchSearchFun={LeadString}
          filterObj={lead_filter}
          filterString={lead_string}
          handleCreate={handleCreate}
          // handleImport={handleImport}
          title={"Lead"}
          disabled={(checkAccess(user, modelName, "write") || hasFeature(user, modelName)) && !popUp}
        />
        {data ? (
          <SimpleTable
            pagination={true}
            dispatchFun={LeadPage}
            count={data?.totalElements}
            page={lead_page}

            className="headerColor colorText"
            data={data?.content}
            columns={LeadColumns({handleView,lead_page,handleEdit,selectLead,handleDelete,popUp,user,modelName,columns,dynamicFields})}
            size={"small"}
          />
        ) : (
          <LoadingHV />
        )}
      </div>
    </>
  );
};

export default Lead;
