import React, { useEffect } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { ModuleArray } from "../../../atoms/State";

const permissionTypes = ["read", "update", "write", "delete"];
const specialPermissionModules = ["Call", "Meeting", "Task", "Lead"];

const PermissionsField = ({ label, name, allowedModules }) => {
  const { values, setFieldValue } = useFormikContext();
  // Filter modules based on allowedModules
  const filteredModules = Array.isArray(allowedModules) && allowedModules.length > 0
    ? ModuleArray.filter((module) => allowedModules.includes(module))
    : ModuleArray;

  // Ensure permissions array is initialized for filtered modules
  useEffect(() => {
    if (!values[name] || values[name].length !== filteredModules.length) {
      const existing = values[name] || [];
      const newPermissions = filteredModules.map((module) => {
        const found = existing.find((p) => p.modelName === module);
        return (
          found || {
            modelName: module,
            read: false,
            update: false,
            write: false,
            delete: false,
          }
        );
      });
      setFieldValue(name, newPermissions);
    }
    // eslint-disable-next-line
  }, [allowedModules]);

  const permissions = values[name] || [];

  const handleCheckbox = (rowIdx, permType) => (e) => {
    const updated = [...permissions];
    updated[rowIdx] = {
      ...updated[rowIdx],
      [permType]: e.target.checked,
    };
    setFieldValue(name, updated);
  };

  return (
    <div className="mt-6">
      <label className="block text-lg font-medium leading-6 text-gray-900 mb-2">
        {label}
      </label>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-base font-medium text-gray-700 uppercase tracking-wider rounded-tl-lg">
                Model Name
              </th>
              {permissionTypes.map((type) => (
                <th key={type} className="px-6 py-3 text-center text-base font-medium text-gray-700 uppercase tracking-wider">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </th>
              ))}
              <th className="px-6 py-3 text-center text-base font-medium text-gray-700 uppercase tracking-wider">
                Special
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((module, idx) => (
              <tr key={module} className="border-b last:border-b-0">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800 text-base">
                  {module}
                </td>
                {permissionTypes.map((type) => (
                  <td key={type} className="px-6 py-4 text-center text-base">
                    <input
                      type="checkbox"
                      checked={permissions[idx]?.[type] || false}
                      onChange={handleCheckbox(idx, type)}
                      className="h-4 w-4"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 text-center text-base">
                  {specialPermissionModules.includes(module) ? (
                    <input
                      type="checkbox"
                      checked={permissions[idx]?.special || false}
                      onChange={handleCheckbox(idx, "special")}
                      className="h-4 w-4"
                    />
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-600 text-sm mt-1"
      />
    </div>
  );
};

export default PermissionsField;
