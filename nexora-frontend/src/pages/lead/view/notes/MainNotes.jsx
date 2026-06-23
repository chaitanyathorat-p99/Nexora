import React from "react";
import { BiPencil } from "react-icons/bi";
import { FaClock } from "react-icons/fa6";
import { IDateOnly,IDate } from "../../../../atoms/State";

const MainNotes = ({ notes }) => {
  return (
    <div style={{ height: "200px", overflowY: "scroll", marginTop: "10px" }}>
      {notes?.map((item) => (
        <div
        key={item?._id}
          style={{
            border: "1px solid lightgrey",
            padding: "20px 5px",
            margin: "5px 0px",
          }}
        >
          <p style={{ fontSize: "14px" }}>{item?.description}</p>
          <p style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{display:"flex",alignItems:"center",gap:"5px"}}>
              {item?.createdBy?.name}
              <BiPencil/>
            </span>
            <span style={{display:"flex",alignItems:"center",gap:"5px"}}>
              {IDate(item?.createdAt)}
              <FaClock/>
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default MainNotes;
