import React from "react";
import CustomModel from "../../atoms/model/CustomModel";
import Lead from "./Lead";
import { useFormikContext } from "formik";
import { message } from "antd";

const LeadPopUp = ({ performCancel, setSelectedLead }) => {
  const { setFieldValue } = useFormikContext();

    const selectLead=(data)=>{


        setFieldValue("lead",data)
		if (setSelectedLead) {
			setSelectedLead(data);
		}        performCancel()
        message.success("Lead Selected")
    }
  return (
    <div>
      <CustomModel performCancel={performCancel} width={"80vw"}>
        <Lead popUp={true} selectLead={selectLead}/>
      </CustomModel>
    </div>
  );
};

export default LeadPopUp;
