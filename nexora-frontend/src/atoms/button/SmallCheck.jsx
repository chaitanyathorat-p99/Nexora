import { Check } from "lucide-react";
import React from "react";
import { RxCheck } from "react-icons/rx";
import { RxCheckCircled } from "react-icons/rx";

const SmallCheck = ({handleSave}) => {
  return (
    <div
    onClick={()=>handleSave()}
      style={{
        // width: "20px",
        // height: "20px",
        // background: "#00ff00",
        // borderRadius: "360px",
        // padding:"2px"
      }}
    >
      <RxCheckCircled style={{color:"green",fontSize:"18px"}}/>
      {/* <Check style={{ fontSize:"10px",width: "20px", color: "white", height: "20px" }} /> */}
    </div>
  );
};

export default SmallCheck;
