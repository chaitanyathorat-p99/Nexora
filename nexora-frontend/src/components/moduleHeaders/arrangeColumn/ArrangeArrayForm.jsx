import React from "react";
import { Field, FieldArray, ErrorMessage } from "formik";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import InputField from "../../../atoms/input/InputField";
import { getLabel } from "../../../atoms/State";

const ArrangeArrayForm = ({ label, name, setModelShow }) => {
  // Function to handle the drag end event
  const onDragEnd = (result, provided, values, setFieldValue) => {
    const { source, destination } = result;

    // If dropped outside the list, do nothing
    if (!destination) return;

    const items = Array.from(values[name]);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    // Update the arrange field based on the new index
    const updatedItems = items.map((item, index) => ({
      ...item,
      arrange: index + 1, // Set arrange based on the current index (1-based index)
    }));

    // Update the Formik field with the new order and arrange values
    setFieldValue(name, updatedItems);
  };

  return (
    <FieldArray name={name}>
      {({ form, push, remove }) => {
        const { values, setFieldValue } = form;
        const products = (values && values[name]) || [];
        // const products = [...values[name].filter(value => value.show),...values[name].filter(value => !value.show)];

        return (
          <DragDropContext
            onDragEnd={(result) =>
              onDragEnd(result, undefined, values, setFieldValue)
            }
          >
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    span: "4",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    textAlign: "center",
                  }}
                >
                  {products && products.length > 0
                    ? products.map((product, index) => (
                        <Draggable
                          key={index}
                          draggableId={`${name}-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="border p-2 mb-2 rounded column-drag"
                              style={{ position: "relative" }}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div
                                className={`grid grid-cols-[3fr_3fr] sm:grid-cols gap-4`}
                              >
                                {/* <div className={`sm:col-span-${"1"}`}>
                                  {index ? null : (
                                    <label className="block text-sm font-medium leading-6 text-gray-900">
                                      Sr.No.
                                    </label>
                                  )}
                                  <Field
                                    disabled={true}
                                    type={"text"}
                                    value={index + 1}
                                    className="block border-none bg-transparent w-full rounded-md sm:text-sm sm:leading-6 text-center"
                                  />
                                </div> */}

                                <InputField
                                  disable={true}
                                  labelDisable={index}
                                  name={`${name}.${index}.name`}
                                  label={"Key"}
                                  display={"none"}
                                />
                                <div style={{textAlign:"start"}}>{getLabel(product?.name)}</div>

                                {/* <InputField
                                  labelDisable={index}
                                  type={"number"}
                                  name={`${name}.${index}.arrange`}
                                  label={"Arrange"}
                                  value={index + 1} // Automatically update arrange field
                                  disabled={true} // Disable manual editing
                                /> */}

                                <div>
                                  <Field
                                    name={`${name}.${index}.show`}
                                    type="checkbox"
                                    className="mr-2 leading-tight"
                                  />
                                  <ErrorMessage
                                    name={`${name}.${index}.write`}
                                    component="div"
                                    className="text-red-600 text-sm mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    : null}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        );
      }}
    </FieldArray>
  );
};

export default ArrangeArrayForm;
