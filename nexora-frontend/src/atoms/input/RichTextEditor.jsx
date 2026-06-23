import { useField, useFormikContext } from 'formik';
import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'; 

const RichTextEditor = ({ label, name, type, required, isTextarea ,span,defaults,disable}) => {
    const [field, meta, helpers] = useField(name);
    const { setFieldValue } = useFormikContext();
    return (
      <div className={`sm:col-span-${span?span:"1"}`} style={{height:"300px"}}>
        <label
          htmlFor={name}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
        <ReactQuill
    value={field.value || ""}
      onChange={(content) => setFieldValue(name, content)}
      readOnly={disable}
      style={{height:"250px"}}
      
        theme="snow"
      modules={{
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline', 'strike'], // added 'strike'
          [{ 'color': [] }, { 'background': [] }], // added color and background color options
          [{ 'align': [] }],
          ['clean'] // remove formatting button
        ],
      }}
      formats={[
        'header', 'font', 'size', 
        'bold', 'italic', 'underline', 'strike', // added 'strike'
        'list', 'bullet', 
        'align', 'color', 'background', // added 'color' and 'background'
     
      ]}
    />
      
    </div>
  )
}

export default RichTextEditor
