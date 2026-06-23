import { DatePicker } from "antd";
import { useField, useFormikContext } from "formik";
import dayjs from "dayjs";

const DatePickerField = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);

  return (
    <div>
      <label
        htmlFor={props.name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {props.label}
      </label>
      <DatePicker
        {...field}
        {...props}
        showTime
        required={props.require?props.require:false}
        value={field.value ? dayjs(field.value) : null}
        onChange={(date) => {
          setFieldValue(field.name, date ? date.toISOString() : null);
        }}
        format="DD/MM/YYYY HH:mm"
        className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default DatePickerField;
