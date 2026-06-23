import React from "react";
import CreateProduct from "./CreateProduct";
import CustomModel from "../../../atoms/model/CustomModel";

const MainProduct = ({ performCancel, getData }) => {
  return (
    <div>
      <CustomModel performCancel={performCancel} fetch={false} width={"min(1000px, calc(100vw - 48px))"}>
        <CreateProduct  performCancel={performCancel} formValue={getData}/>
      </CustomModel>
    </div>
  );
};

export default MainProduct;
