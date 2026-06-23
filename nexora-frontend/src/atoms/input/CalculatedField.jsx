import { useEffect } from "react";
import InputField from "./InputField";
import { useFormikContext } from "formik";
import { SimpleSubTotal } from "../State";

const CalculatedField = ({ name, priceField, quantityField,labelDisable }) => {
    const { values, setFieldValue } = useFormikContext();
  
    useEffect(() => {
  
      const price = values?.product[labelDisable].price;
      const quantity = values?.product[labelDisable].quantity||1;
      const discount = values?.product[labelDisable].discount;
      const total = SimpleSubTotal(price,discount,quantity);
      setFieldValue(name, total);
    }, [values, priceField, quantityField, setFieldValue]);
  
    return (
      <InputField
      labelDisable={labelDisable}
        name={name}
        label="Total"
        type="number"
        disable={true} // This makes the field read-only
      />
    );
  };

export default CalculatedField;
