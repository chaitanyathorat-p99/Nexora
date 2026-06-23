import { Button, Input } from "antd";
import { Check, Cross, Pencil } from "lucide-react";
import React, { useState } from "react";
import { MakeEditStructure, mergeAndOverwrite } from "../static";
import { MdOutlineWrongLocation } from "react-icons/md";
import SmallCheck from "../button/SmallCheck";
import SmallCross from "../button/SmallCross";
import { useUpdateLeadMutation } from "../../features/allApi";
import EResponse from "../response/EResponse";
import { RxPencil1 } from "react-icons/rx";
const EditButtonOverView = ({
  saveTo,
  editThe,
  setEditThe,
  style,
  data,
  label,
  toUpdate,
  edit
}) => {
  const [updateLead, GetUpdateLeadResponse] = useUpdateLeadMutation();

  const [inputValue, setInputValue] = useState(data);
  const handleSave = () => {
    setEditThe();
    const structure = MakeEditStructure({ saveTo, inputValue,initialData:toUpdate });
    // structure._id = toUpdate;
    const newStruct = mergeAndOverwrite(toUpdate ,structure);
    updateLead(newStruct)
  };
  return (
    <div style={style} className="edit_visible_button">
      <EResponse
        error={GetUpdateLeadResponse?.error?.data?.message}
        Response={GetUpdateLeadResponse}
        type={"update"}
      />
      {edit===editThe ? (
        <>
          <div>
            <strong>{label}</strong>
            <div style={{ display: "flex", gap: "5px", alignItems: "start",flexDirection:"column",justifyContent:"flex-start" }}>
              <Input
                defaultValue={data}
                onChange={(e) => setInputValue(e.target.value)}
              />

              <div style={{ display: "flex", gap: "5px" }}>
                <SmallCheck handleSave={handleSave} />
                <SmallCross onclick={() => setEditThe()} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <strong>{label?`${label} :`:null}</strong> {data}
          </div>
          <span>
            <RxPencil1
              onClick={() => setEditThe(edit)}
              style={{ fontSize: "18px" ,color:"#2a2a2a", cursor: "pointer", transition: "transform 0.2s"}}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.2)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            />
          </span>
        </>
      )}
    </div>
  );
};

export default EditButtonOverView;
