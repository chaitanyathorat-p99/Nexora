export const countryArray = [
  "India",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo, Democratic Republic of the",
  "Congo, Republic of the",
  "Costa Rica",
];
export const cityArray = ["Pune", "Mumbai", "Nashik"];
export const statesInIndia = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
export const leadWeightArray = ["Cold", "Warm", "Hot"];
export const sourceArray = ["Website", "Referral", "Whatsapp"];

export function hasFeature(user, featureName) {
  // Allow all authenticated users to access features
  // Permissions for delete/update operations are controlled elsewhere
  const features = user?.plan?.featuresMasterIds || [];
  return features.some(f => f.name === featureName) || true; // Show feature to all users
}

export const IDate = (date) => {
  if (date) {
    const IndianDate = new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    return IndianDate;
  } else {
    return "";
  }
};
export const IDateDesign = (date) => {
  if (date) {
    const IndianDate = new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return IndianDate.replace(",", ""); // Removes the comma between date and time
  } else {
    return "";
  }
};

export const IDateOnly = (date) => {
  if (date) {
    const IndianDate = new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return IndianDate;
  } else {
    return "";
  }
};

export const ITime = (date) => {
  if (date) {
    const IndianTime = new Date(date).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
    });
    return IndianTime;
  } else {
    return "";
  }
};

export const ModuleArray = [
  "System-User",
  "Client-User",
  "Lead",
  "Lead-Status",
  "Task",
  "Meeting",
  "Call",
  "User-Role",
  "Deal",
  "Product",
  "Industry-Type",
  "Product-Type",
  "Type of Buyer",
  "TICKET",
  "Plan",
  "Subscription",
  "Features-Master",
  "Feature-Limit",
  "Enquiry"
];
export const moduleUrlMap = {
  "System-User": "system-users",
  "Client-User": "client-users",
  Lead: "leads",
  "Lead-Status": "leads-status",
  Task: "tasks",
  Meeting: "meetings",
  Call: "calls",
  "User-Role": "user-role",
  Deal: "deals",
  Product: "products",
  "Features-Master": "features-master"
};

export const ModuleArray2 = [
  "System-User",
  "Client-User",
  "Lead",
  "Task",
  "Meeting",
  "Call",
  "User-Role",
  "Deal",
  "Product",
  "Industry-Type",
  "Product-Type",
  "Type of Buyer",
  "TICKET",
  "Plan",
  "Subscription",
  "Features-Master",
  "Feature-Limit",
  "Enquiry",
];
export const TaskStage = [
  "New",
  "Assigned",
  "In Process",
  "Review",
  "Completed",
];
export const QuotationStage = ["New", "Approved", "Rejected"];
export const priceTypeArray = ["One Time", "Subscription Cycle"];
export const addOrSubArray = ["Add", "Sub"];
export const betweenArray = [
  "is",
  "is not",
  "is empty",
  "is not empty",
  "is greater than",
  "is less than",
];
// export const priceTypeArray = ["One Time", "Subscription"];
export const productType = ["Web Service", "Mobile App"];

export const moduleType = [
  "Lead",
  "Call",
  "Meeting",
  "Task",
  "Deal",
  "Product",
  "Product-Type",
  "User",
  "Industry-Type",
  "Type of Buyer",
  "TICKET",
  "Plan",
  "Subscription",
];

export const rolesArray = [
  "SUPER_ADMIN",
  "ADMIN",
  "USER",
  "CLIENT",
  "FINANCE_HEAD",
  "FINANCE_EXECUTIVE",
  "MARKETING_HEAD",
  "SALES_AND_MARKETING_EXECUTIVE",
  "SOFTWARE_DEVELOPER",
  "TESTER",
  "HR_HEAD",
  "HR_EXECUTIVE",
  "UIUX_DESIGNER",
  "PRODUCT_MANAGER",
  "TEAM_LEAD",
  "PROJECT_MANAGER",
  "CTO",
];

export const dealTypeArray = ["New", "Expansion", "Profession Services"];
export const dealStagesArray = [
  "New",
  "Qualification",
  "Discovery",
  "Demo",
  "Negotiation",
  "Won",
  "Lost",
];
export const dealStagesArrayReason = [
  {
    name: "New",

    reason: false,
  },
  {
    reason: false,

    name: "Qualification",
  },
  {
    reason: false,

    name: "Discovery",
  },
  {
    reason: false,

    name: "Demo",
  },
  {
    name: "news",
    reason: false,
  },
  {
    name: "Negotiation",
    reason: false,
  },
  {
    name: "Won",
    reason: true,
  },
  {
    name: "Lost",
    reason: true,
  },
];


export const onlinePlatFormArray = [
  "Zoom Meet",
  "Google Meet",
  "Microsoft Meet",
  "Company Link",
  "Other",
];

export const offlinePlatFormArray = [
  "In Person",
  "Other",
];

export const platFormArray = [
  ...onlinePlatFormArray, ...offlinePlatFormArray
];

export const meetingTypeArray = ["Online", "Offline"];
export const currencyCodes = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "SGD",
  "NZD",
  "HKD",
  "SEK",
  "KRW",
  "NOK",
  "MXN",
  "PHP",
  "IDR",
  "BRL",
  "RUB",
  "ZAR",
  "TRY",
  "AED",
  "SAR",
  "THB",
  "PLN",
  "ILS",
  "DKK",
  "EGP",
  "MYR",
  "CZK",
  "HUF",
  "QAR",
  "ARS",
  "CLP",
  "TWD",
  "COP",
  "VND",
  "UAH",
  "NGN",
  "KWD",
  "BDT",
  "PKR",
  "OMR",
  "LBP",
  "RON",
  "CUP",
  "GTQ",
  "IRR",
  "IQD",
  "PYG",
  "BOB",
  "UYU",
  "DZD",
  "LKR",
  "UGX",
  "BYN",
  "HRK",
  "MAD",
  "SYP",
  "XAF",
  "JMD",
  "CUC",
  "XOF",
  "TZS",
  "NPR",
  "AOA",
  "UYU",
  "AFN",
  "MZN",
  "GHS",
  "TND",
  "MGA",
  "ETB",
  "SDG",
  "BMD",
  "BWP",
  "XPF",
  "BND",
  "MDL",
  "HNL",
  "NAD",
  "HTG",
  "XCD",
  "NIO",
  "RSD",
  "LSL",
  "KZT",
];

export function toQueryString(obj) {
  const parts = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        if (value.length > 0) {
          if (key === "amount") {
            // Only include amount if not default
            if (!(value[0] === 0 && value[1] === 1000000000)) {
              parts.push(
                `${encodeURIComponent(key)}_gte=${encodeURIComponent(value[0])}`
              );
              parts.push(
                `${encodeURIComponent(key)}_lte=${encodeURIComponent(value[1])}`
              );
            }
          } else if (key === "createdAt") {
            parts.push(`from=${encodeURIComponent(value[0])}`);
            parts.push(`to=${encodeURIComponent(value[1])}`);
          } else {
            value.forEach((v) => {
              parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(v));
            });
          }
        }
      } else if (value !== undefined && value !== null && value !== "") {
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }
  }
  return `&${parts.join("&")}`;
}

export const checkAssigned = (data, id) => {
  return data.filter((item) => item._id === id)[0]?.assignedTo.length;
};

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
export const SavedPrice = (products, index) => {
  const product = products[index];

  if (!product) return 0;

  const price = product.price || 0;
  const discountPercentage = product.discount || 0;
  const quantity = product.quantity || 1;

  const discountAmount = ((price * discountPercentage) / 100) * quantity;
  const discountedPrice = (price - discountAmount) * quantity;

  return discountAmount.toFixed(2);
};
export const SubTotal = (products, index) => {
  return (
    products[index]?.price *
    (products[index]?.quantity ? products[index]?.quantity : 1)
  ).toFixed(2);
};
export const SavedPriceWithOutIndex = (products) => {
  const product = products;

  if (!product) return 0;

  const price = product.price || 0;
  const discountPercentage = product.discount || 0;
  const quantity = product.quantity || 1;

  const discountAmount = ((price * discountPercentage) / 100) * quantity;
  const discountedPrice = (price - discountAmount) * quantity;

  return discountAmount.toFixed(2);
};
export const SubTotalWithOutIndex = (products) => {
  return (
    products?.price * (products?.quantity ? products?.quantity : 1)
  ).toFixed(2);
};
export const getDiscountValue = (products, index, forWhat) => {
  if (forWhat === "Sub Total") {
    return SubTotal(products, index) - SavedPrice(products, index);
  } else if (forWhat === "Save") {
    return SavedPrice(products, index);
  } else {
    return 1;
  }
};
export const FinalTotal = (products) => {
  let totalAmount = 0;
  let totalDiscount = 0;

  products?.forEach((product) => {
    const quantity = product.quantity || 1; // Default to 1 if not specified
    const price = product.price;
    const discount = product.discount || 0; // Default to 0 if not specified

    const productTotal = price * quantity;
    const productDiscount = (discount / 100) * productTotal;

    totalAmount += productTotal;
    totalDiscount += productDiscount;
  });

  return totalAmount.toFixed(2);
};
export const FinalTotalDiscount = (products, extraDis) => {
  let totalAmount = 0;
  let totalDiscount = 0;

  products?.forEach((product) => {
    const quantity = product.quantity || 1; // Default to 1 if not specified
    const price = product.price;
    const discount = product.discount + extraDis || 0; // Default to 0 if not specified

    const productTotal = price * quantity;
    const productDiscount = (discount / 100) * productTotal;

    totalAmount += productTotal;
    totalDiscount += productDiscount;
  });

  return totalDiscount.toFixed(2);
};

export const SimpleSubTotal = (price, discount, quantity) => {
  const discountedPricePerUnit = price * (1 - discount / 100);
  return discountedPricePerUnit * (quantity || 1);
};

import { notification } from "antd";
import { ForLead } from "./StaticColumnDisplay";

export const openNotification = (placement, api) => {
  api.info({
    message: `${placement}`,
    placement: "topRight",
    duration: 10,
  });
};

export function getKeyLabels(obj, parentKey = "") {
  let keysArray = [];

  for (let key in obj) {
    // Skip if it's an array
    if (Array.isArray(obj[key])) {
      continue;
    }

    // Construct the full path for nested keys
    const path = parentKey ? `${parentKey}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      // If the value is an object, recursively call the function
      keysArray = keysArray.concat(getKeyLabels(obj[key], path));
    } else {
      // Add the key in { label, value } format
      keysArray.push({
        label: key,
        value: path,
      });
    }
  }

  return keysArray;
}

export const leadObj = [
  {
    label: "name",
    value: "name",
  },
  {
    label: "email",
    value: "email",
  },
  {
    label: "mobile",
    value: "info.mobile",
  },
  {
    label: "address",
    value: "info.address",
  },
  {
    label: "city",
    value: "info.city",
  },
  {
    label: "state",
    value: "info.state",
  },
  {
    label: "country",
    value: "info.country",
  },
  {
    label: "source",
    value: "info.source",
  },
  {
    label: "createdAt",
    value: "createdAt",
  },
  {
    label: "Lead Status",
    value: "status._id",
  },
  {
    label: "firstName",
    value: "firstName",
  },
  {
    label: "lastName",
    value: "lastName",
  },
  {
    label: "reason",
    value: "reason",
  },
  {
    label: "leadValue",
    value: "leadValue",
  },
  {
    label: "leadWeight",
    value: "leadWeight",
  },
];
// export const leadObj= getKeyLabels({
//     name: "john",
//     email: "prateeksonar2002@gmail.com",
//     info: {
//       mobile: "8698440584",
//       address: "narhe",
//       city: "Pune",
//       state: "Maharashtra",
//       country: "country india",
//       source: "Whatsapp",
//     },
//     createdAt: "2024-06-11T10:00:00.000Z",
//     status: {
//       name: "IN NEGOTIATION",
//     },
//     firstName: "joha atkin",
//     lastName: "sdf",
//     reason: "test",
//     leadValue: 100,
//     leadWeight: "Warm",

//   })

export function convertToStars(score) {
  const stars = (score / 100) * 5;
  return Math.round(stars); // Round to nearest whole number
}

export const getLabel = (fieldName) => {
  // Split the field name by dot
  const parts = fieldName.split(".");

  // Process each part
  const formattedParts = parts.map((part) => {
    // Handle array indices
    const arrayIndexMatch = part.match(/(.*)\[(\d+)\]/);
    let formattedName = part;

    if (arrayIndexMatch) {
      const baseName = arrayIndexMatch[1];
      const index = parseInt(arrayIndexMatch[2], 10) + 1; // Convert to 1-based index
      formattedName = `${baseName} ${index}`;
    }

    // Add spaces between words and capitalize the first letter of each word
    return formattedName
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before capital letters
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  });

  // Join the formatted parts with a space
  return formattedParts.join(" ");
};

export const visibilityConfig = (columnSettings) => {
  const visibilityConfig = columnSettings?.reduce((config, column) => {
    config[column.name] = column.show; // Map name to its show property
    return config;
  }, {});
  // Sort the visibilityConfig based on the arrange value
  const sortedVisibilityConfig = Object.entries(visibilityConfig)
    .sort((a, b) => {
      const arrangeA =
        columnSettings.find((col) => col.name === a[0])?.arrange || Infinity;
      const arrangeB =
        columnSettings.find((col) => col.name === b[0])?.arrange || Infinity;
      return arrangeA - arrangeB;
    })
    .reduce((sortedConfig, [key, value]) => {
      sortedConfig[key] = value; // Preserve the original visibility
      return sortedConfig;
    }, {});

  return sortedVisibilityConfig;
};

export const visibilityConfigArrangement = (
  array,
  modelName,
  user,
  columns,
  allColumns,
  firstArray,
  lastArray
) => {
  console.log(ForLead(columns, user, modelName));
  const visibilityConfig2 = visibilityConfig(
    ForLead(columns, user, modelName)?.columns
  );
  const alwaysIncludedKeys = array;

  const filterCol = allColumns.filter(
    (col) =>
      // Include always-included keys
      alwaysIncludedKeys.includes(col.key) ||
      // Include keys based on visibilityConfig and exclude conditions
      visibilityConfig2[col.key] !== false
  );
  const visibleKeys = [
    ...array,
    ...Object.keys(visibilityConfig2).filter((key) => visibilityConfig2[key]),
  ];
  // Arrange the filterCol based on the order of visibleKeys
  const arrangedFilterCol = [
    // Always include _id and name first
    ...firstArray
      .filter((key) => visibleKeys.includes(key))
      .map((key) => filterCol.find((col) => col.key === key)),
    // Include other visible keys, excluding _id and name
    ...visibleKeys
      .filter((key) => !array.includes(key))
      .map((key) => filterCol.find((col) => col.key === key)),
    // Always include edit last
    ...lastArray
      .filter((key) => visibleKeys.includes(key))
      .map((key) => filterCol.find((col) => col.key === key)),
  ].filter((col) => col); // Filter out any undefined columns
  return arrangedFilterCol;
};
