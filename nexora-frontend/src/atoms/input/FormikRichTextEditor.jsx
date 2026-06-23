import React from 'react';
import { useField } from 'formik';
import { Form, Input, Typography } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Text } = Typography;

const FormikRichTextEditor = ({ label, name, extra, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const { setValue } = helpers;

  const handleChange = (content) => {
    setValue(content);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link'
  ];

  return (
    <Form.Item
      label={label}
      validateStatus={meta.touched && meta.error ? 'error' : ''}
      help={meta.touched && meta.error ? meta.error : ''}
    >
      <ReactQuill
        theme="snow"
        value={field.value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        style={{ height: '200px', marginBottom: '50px' }}
        {...props}
      />
      {extra && (
        <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
          {extra}
        </Text>
      )}
    </Form.Item>
  );
};

export default FormikRichTextEditor; 