import React, { useState } from "react";
import { Field, FieldArray, ErrorMessage } from "formik";
import {
  FinalTotal,
  FinalTotalDiscount,
  getDiscountValue,
  ModuleArray,
  priceTypeArray,
  // productType,
} from "../../../atoms/State";
import { Button, Popconfirm, Tooltip } from "antd";
import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import InputField from "../../../atoms/input/InputField";
import SelectButton from "../../../atoms/select/SelectButton";
import CalculatedField from "../../../atoms/input/CalculatedField";

const ProductArray = ({ label, name, setModelShow }) => {
  return (
    <>
      <FieldArray name={name}>
        {({ push, remove, form }) => {
          const { values } = form;
          const products = Array.isArray(values[name]) ? values[name] : [];

          return (
            <>
              <label className="block text-sm font-medium leading-6 text-gray-900 text-center">
                {label}
              </label>
              <div style={{ span: "4", display: "flex", flexDirection: "column", gap: "1rem", textAlign: "center" }}>
                {products && products.length > 0
                  ? products.map((product, index) => (
                    <div
                      key={index}
                      className="border p-2 mb-2 rounded"
                      style={{ position: "relative" }}
                    >
                      <div
                        className="flex justify-end items-center"
                        style={{
                          position: "absolute",
                          top: "-15px",
                          right: "-15px",
                        }}
                      >
                        {/* <strong>Products {index + 1}</strong> */}
                        <Tooltip title="remove">
                          <Popconfirm
                            title="Sure To Delete?"
                            onConfirm={() => remove(index)}
                          >
                            {/* <DeleteOutlined /> */}
                            <CloseOutlined className="delete-button" />
                          </Popconfirm>
                        </Tooltip>
                      </div>
                      <div className={`grid grid-cols-[1fr_3fr_3fr] ${product?.priceType === "Subscription" ? "sm:grid-cols-[1fr_2fr_2fr_2fr_2fr_2fr_2fr_2fr_2fr]" : "sm:grid-cols-[1fr_3fr_3fr_3fr_3fr_3fr_3fr]"} gap-4`}>
                      <div className={`sm:col-span-${"1"}`}>
                          {
                            index ? null :
                              <label
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Sr.No.
                              </label>
                          }
                          <Field

                            disabled={true}
                            type={"text"}
                            value={index+1}
                            className="block border-none bg-transparent w-full rounded-md sm:text-sm sm:leading-6 text-center"
                          />
                        </div>
                        <InputField
                          labelDisable={index}
                          name={`${name}.${index}.name`}
                          label={"Name"}
                        />
                        <InputField
                          labelDisable={index}
                          name={`${name}.${index}.productType.name`}
                          label={"Product Type"}
                          value={product?.productType?.name || product?.productType || ''}
                          disabled={true}
                        />
                        {/* <SelectButton
                            labelDisable={index}
                            // array={productType}
                            name={`${name}.${index}.productType`}
                            label={"Product Type"}
                          /> */}
                        {/* <SelectButton
                            labelDisable={index}
                            name={`${name}.${index}.priceType`}
                            array={priceTypeArray}
                            label={"Price Type"}
                          /> */}

                        <InputField
                          labelDisable={index}
                          name={`${name}.${index}.price`}
                          type={"number"}
                          label={"Price"}
                        />
                        <InputField
                          labelDisable={index}
                          name={`${name}.${index}.discount`}
                          type={"number"}
                          label={"Discount"}
                        />

                        <InputField
                          labelDisable={index}
                          type={"number"}
                          name={`${name}.${index}.quantity`}
                          label={"Quantity"}
                        />
                        <CalculatedField
                          labelDisable={index}
                          name={`${name}.${index}.total`}
                          priceField={`${name}.${index}.price`}
                          quantityField={`${name}.${index}.quantity`}
                        />
                        {product?.priceType === "Subscription" && (
                          <>
                            <InputField
                              labelDisable={index}
                              required={true}
                              placeholder={"Sub Cycle"}
                              type={"number"}
                              name={`${name}.${index}.subscriptionCycle`}
                              label={"Sub Cycle"}
                            />
                            <InputField
                              labelDisable={index}
                              name={`${name}.${index}.billingCycle`}
                              required={true}
                              placeholder={"Billing Cycle"}

                              label={"Billing Cycle"}
                            />
                          </>
                        )}
                      </div>
                      {/* <div style={{ display: "flex", gap: "10px" }}>
                          <span>
                            {getDiscountValue(products, index, "Sub Total")}
                            {"  "}
                          </span>
                          {"  "}
                          <span>
                            save Rs {getDiscountValue(products, index, "Save")}
                          </span>
                        </div> */}
                    </div>
                  ))
                  : null}
                <button
                  type="button"
                  style={{ width: "280px", padding: "6px 12px", alignSelf: "flex-start", background: '#3b82f6', color: 'white', borderRadius: '0.375rem', margin: '0.5rem', border: 'none' }}
                  onClick={() => setModelShow(true)}
                >
                  Add Custom Product
                </button>
              </div>
              <h2 style={{ fontWeight: "600", fontSize: "20px" }}>
                Total : RS {FinalTotal(products) - FinalTotalDiscount(products, values?.discount || 0)}{" "}
                Saved {FinalTotalDiscount(products, values?.discount || 0)}
              </h2>
            </>
          );
        }}
      </FieldArray>
    </>
  );
};

export default ProductArray;
