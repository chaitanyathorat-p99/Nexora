export const getTodaysDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

export const MakeEditStructure=({saveTo,inputValue,initialData})=>{
    const keys = saveTo.split('.');

let structure = {};
let currentLevel = structure;

// Loop through the keys to dynamically create nested objects
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];

  if (i === keys.length - 1) {
    // Assign the inputValue to the last key
    currentLevel[key] = inputValue;
  } else {
    // Create an empty object for the current key if it doesn't exist
    currentLevel[key] = currentLevel[key] || {};
    currentLevel = currentLevel[key];
  }
}
return structure
}
export function mergeAndOverwrite(obj1, obj2) {
  // Clone the first object to avoid mutating the original
  let mergedObj = { ...obj1 };

  // Merge and overwrite properties from the second object
  for (let key in obj2) {
      if (obj2.hasOwnProperty(key)) {
          if (key === "info" && obj2[key] && typeof obj2[key] === "object") {
              mergedObj[key] = { ...mergedObj[key], ...obj2[key] };
          } else {
              mergedObj[key] = obj2[key];
          }
      }
  }

  return mergedObj;
}


const EMPLOYEE_DELETE_BLOCKED_MODULES = new Set([
  "Lead",
  "Call",
  "Task",
  "Product",
  "Deal",
  "TICKET",
]);

const EMPLOYEE_UPDATE_BLOCKED_MODULES = new Set([
  "Task",
]);

const isEmployeeUser = (user) => {
  const roleId = user?.role?._id || user?.role;
  const roleName = String(user?.role?.name || "").toLowerCase();
  return roleId === "role_employee" || roleName === "employee";
};

export const checkAccess=(user,name,access)=>{
  if (isEmployeeUser(user) && access === "delete" && EMPLOYEE_DELETE_BLOCKED_MODULES.has(name)) {
    return false;
  }
  if (isEmployeeUser(user) && access === "update" && EMPLOYEE_UPDATE_BLOCKED_MODULES.has(name)) {
    return false;
  }

  return user?.role?.permissions?.some(permission => permission.modelName === name &&permission[access]===true);
}
export function hasFeature(user, featureName) {
  // Allow all authenticated users to access features
  // Permissions for delete/update operations are controlled elsewhere
  const features = user?.plan?.featuresMasterIds || [];
  return features.some(f => f.name === featureName) || true; // Show feature to all users
}


export const appendQueryParams = (params, options) => {
  if (options.lead_id) params.append('lead', options.lead_id);
  
  if (options.currencyType) {
    options.currencyType.forEach(ct => params.append('currencyType', ct));
  }
  
  if (options.dealStages) {
    options.dealStages.forEach(ds => params.append('dealStages', ds));
  }
  
  if (options.dealType) {
    options.dealType.forEach(dt => params.append('dealType', dt));
  }
  
  if(options.dealValue){
    options.dealValue.forEach(dv=>params.append('dealValue',dv));
  }
  if (options.from) params.append('from', options.from);
  if (options.to) params.append('to', options.to);

};


export const filterDealsByAmount = (deals, amountFilter) => {
  const amountConditions = {
    "Less than 1000": (x) => x < 1000,
    "Less than 10000": (x) => x < 10000,
    "Less than 20000": (x) => x < 20000,
    "Less than 30000": (x) => x < 30000,
    "Above 50000": (x) => x > 50000,
    "Above 100000": (x) => x > 100000,
  };

  return deals.filter(deal =>
    amountFilter.some(filterKey =>
      amountConditions[filterKey] && amountConditions[filterKey](deal.dealValue)
    )
  );
};

export const yearOptions = [
  {label: 'Select Year', value: ''},
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: '2022', value: '2022' },
];

export const monthOptions = [
  {label: 'Select Month', value: ''},
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];



// Static Data
// const activityData = [
//     {
//         "_id": "66fb7de7d2d6d93a46c37c7c",
//         "module": "Lead",
//         "action": "updated",
//         "changes": [
//             {
//                 "field": "info.source",
//                 "From": "Referral",
//                 "To": "Whatsapp",
//             },
//             {
//                 "field": "status",
//                 "From": "666952f83497ff34ce0b2b9a",
//                 "To": "666952773497ff34ce0b2b88",
//                 "Time": "2024-10-01T04:43:19.343Z",
//             },
//             {
//                 "field": "assignedTo",
//                 "From": "666ffe54a74fdd325fbd22cc",
//                 "To": "6667d4946da8da5e3eed376e",
//                 "Time": "2024-10-01T04:43:19.343Z",
//             },
//             {
//                 "field": "lastName",
//                 "From": "sdf2",
//                 "To": "sdf2y6",
//                 "Time": "2024-10-01T04:43:19.343Z",
//             },
//             {
//                 "field": "leadValue",
//                 "From": 10000,
//                 "To": 1000,
//                 "Time": "2024-10-01T04:43:19.343Z",
//             },
//             {
//                 "field": "leadWeight",
//                 "From": "Warm",
//                 "To": "Hot",
//                 "Time": "2024-10-01T04:43:19.343Z",
//             },
//             {
//                 "field": 'product[0].price',
//                 "From": 1001,
//                 "To": 100
//             },
//             {
//                 "field": 'product[0].quantity',
//                 "From": 22,
//                 "To": 2
//             },
//             {
//                 "field": 'product[1].name',
//                 "From": 'product 1',
//                 "To": 'dkjhkaj'
//             },
//             {
//                 "field": 'product[1].priceType',
//                 "From": 'Subscription',
//                 "To": 'One Time'
//             },
//             {
//                 "field": 'product[1].subscriptionCycle',
//                 "From": '1',
//                 "To": ''
//             },
//             {
//                 "field": 'product[2].subscriptionCycle',
//                 "From": '1',
//                 "To": '200'
//             },

//         ],
//         "lead": "66684df009fefd860e4690f3",
//         "relatedId": null,
//         "createdBy": {
//             "_id": "6667d4946da8da5e3eed376e",
//             "username": "admin",
//             "email": "admin1@gmail.com",
//             "name": "Super USER",
//             "mobileNo": "123406789",
//             "password": "$2b$10$MvCvysVfQaMuASV2J5ro4OKUxoeGXP7g8JvlT/cb/AiARZDdwU1Dy",
//             "role": "666bb2444aba4fef89e4f0b9",
//             "isActive": true,
//             "userType": "System",
//             "createdAt": "2024-06-11T04:37:40.988Z",
//             "updatedAt": "2024-09-20T04:51:31.402Z",
//             "__v": 0,
//             "companyMaster": null,
//             "taskKanban": false
//         },
//         "createdAt": "2024-10-01T04:43:19.343Z",
//         "updatedAt": "2024-10-01T04:43:19.343Z",
//         "__v": 0
//     },
//     {
//         "_id": "66f6888ff80a4dae8578c382",
//         "module": "Call",
//         "action": "updated",
//         "lead": "66684df009fefd860e4690f3",
//         "relatedId": {
//             "_id": "66c046efdf31c3ffcd7b6da0",
//             "title": "sad",
//             "dueDate": "2024-08-16T18:30:00.000Z",
//             "desc": "gh",
//             "outcome": "hgfjghj",
//             "callDone": true,
//             "callNote": "",
//             "lead": "66684df009fefd860e4690f3",
//             "createdBy": "6667d4946da8da5e3eed376e",
//             "assignedTo": "6667d4946da8da5e3eed376e",
//             "companyMaster": null,
//             "createdAt": "2024-08-17T06:45:03.970Z",
//             "updatedAt": "2024-08-22T05:16:12.201Z",
//             "__v": 0
//         },
//         "createdBy": null,
//         "createdAt": "2024-09-27T10:27:27.468Z",
//         "updatedAt": "2024-09-27T10:27:27.468Z",
//         "__v": 0
//     },
//     {
//         "_id": "66f688c9f80a4dae8578c3b5",
//         "module": "Meeting",
//         "action": "updated",
//         "lead": "66684df009fefd860e4690f3",
//         "relatedId": {
//             "_id": "66c5c2d0eacea1e268b9ed83",
//             "title": "sad",
//             "dueDate": "2024-08-20T18:30:00.000Z",
//             "desc": "asd",
//             "outcome": "",
//             "platForm": "In Person",
//             "meetingType": "Offline",
//             "meetingLink": "",
//             "meetingDone": false,
//             "meetingNote": "",
//             "lead": "66684df009fefd860e4690f3",
//             "createdBy": "6667d4946da8da5e3eed376e",
//             "assignedTo": "6667d4946da8da5e3eed376e",
//             "companyMaster": null,
//             "createdAt": "2024-08-21T10:34:56.145Z",
//             "updatedAt": "2024-08-21T10:34:56.145Z",
//             "__v": 0
//         },
//         "createdBy": null,
//         "createdAt": "2024-09-27T10:28:25.907Z",
//         "updatedAt": "2024-09-27T10:28:25.907Z",
//         "__v": 0
//     },
//     {
//         "_id": "66f688c9f80a4dae8578c3b4",
//         "module": "Company",
//         "action": "updated",
//         "lead": "66684df009fefd860e4690f3",
//         "relatedId": {
//             "_id": "66c5c2d0eacea1e268b9ed83",
//             "companyName": "Tech Innovators Inc.",
//             "desc": "A leading company in tech innovations and solutions.",
//             "lead_id": {
//                 "_id": "66684df009fefd860e4690f3",
//                 "name": "john",
//                 "email": "prateeksonar2002@gmail.com",
//                 "info": {
//                     "mobile": "8698440598",
//                     "address": "narhe22",
//                     "city": "Pune",
//                     "state": "Maharashtra",
//                     "country": "India",
//                     "source": "Whatsapp",
//                     "_id": "66791bea9f95c5ebef9b16d9"
//                 },
//                 "createdBy": null,
//                 "createdAt": "2024-06-11T10:00:00.000Z",
//                 "user": "666ffe54a74fdd325fbd22cc",
//                 "__v": 0,
//                 "status": "666952773497ff34ce0b2b88",
//                 "updatedAt": "2024-10-01T04:43:19.207Z",
//                 "assignedTo": "6667d4946da8da5e3eed376e",
//                 "firstName": "joha atkin 33",
//                 "lastName": "sdf2y6",
//                 "reason": "",
//                 "tag": [],
//                 "companyMaster": null,
//                 "leadValue": 1000,
//                 "leadWeight": "Hot"
//             },
//             "createdBy": {
//                 "taskKanban": false,
//                 "_id": "666ffe54a74fdd325fbd22cc",
//                 "username": "chavanrutik7@gmail.com",
//                 "email": "chavanrutik7@gmail.com",
//                 "name": "John Doe",
//                 "mobileNo": "123-456-7890",
//                 "password": "144d9831bc7b74ab",
//                 "role": "666bae3b4854605dcdba18cf",
//                 "isActive": true,
//                 "userType": "System",
//                 "birthDate": null,
//                 "profilePic": "https://nexora-server-profile.s3.ap-south-1.amazonaws.com/835d5ccb-a1bb-4753-9508-8854f704a658-1687185935389.jpg",
//                 "createdAt": "2024-06-17T09:13:56.177Z",
//                 "updatedAt": "2024-08-08T10:32:59.857Z",
//                 "__v": 0,
//                 "companyMaster": null
//             },
//             "assignedTo": {
//                 "taskKanban": false,
//                 "_id": "666ffe54a74fdd325fbd22cc",
//                 "username": "chavanrutik7@gmail.com",
//                 "email": "chavanrutik7@gmail.com",
//                 "name": "John Doe",
//                 "mobileNo": "123-456-7890",
//                 "password": "144d9831bc7b74ab",
//                 "role": "666bae3b4854605dcdba18cf",
//                 "isActive": true,
//                 "userType": "System",
//                 "birthDate": null,
//                 "profilePic": "https://nexora-server-profile.s3.ap-south-1.amazonaws.com/835d5ccb-a1bb-4753-9508-8854f704a658-1687185935389.jpg",
//                 "createdAt": "2024-06-17T09:13:56.177Z",
//                 "updatedAt": "2024-08-08T10:32:59.857Z",
//                 "__v": 0,
//                 "companyMaster": null
//             },
//             "website": "https://www.techinnovators.com",
//             "linkedIn": "https://www.linkedin.com/company/tech-innovators-inc",
//             "facebook": "https://www.facebook.com/techinnovators",
//             "twitter": "https://www.twitter.com/techinnovators",
//             "instagram": "https://www.instagram.com/techinnovators",
//             "createdAt": "2024-06-20T10:28:20.933Z",
//             "updatedAt": "2024-06-20T10:28:20.933Z",
//             "__v": 0
//         },
//         "createdBy": null,
//         "createdAt": "2024-10-01T04:43:19.343Z",
//         "updatedAt": "2024-10-01T04:43:19.343Z",
//         "__v": 0
//     },
//     {
//         "_id": "66f688c9f80a4dae8578c3bz",
//         "module": "Deal",
//         "action": "updated",
//         "lead": "66684df009fefd860e4690f3",
//         "relatedId": {
//             "_id": "66add951113fbc1388fc3fa1",
//             "latestQuotationId": "66f671a6dbe3dc44f30dd97c",
//             // "_id": "66add951113fbc1388fc3fa1",
//             "dealType": "New",
//             "dealStages": "Qualification",
//             "currencyType": "JPY",
//             "dealValue": 21,
//             "product":
//                 "667cf5bb6566a47498943e5e",
//             "lead": {
//                 "_id": "66684df009fefd860e4690f3",
//                 "name": "john",
//                 "email": "prateeksonar2002@gmail.com",
//                 "info": {
//                     "mobile": "8698440598",
//                     "address": "narhe22",
//                     "city": "Pune",
//                     "state": "Maharashtra",
//                     "country": "India",
//                     "source": "Whatsapp",
//                     "_id": "66791bea9f95c5ebef9b16d9"
//                 },
//                 "createdBy": null,
//                 "createdAt": "2024-06-11T10:00:00.000Z",
//                 "user": "666ffe54a74fdd325fbd22cc",
//                 "__v": 0,
//                 "status": "666952773497ff34ce0b2b88",
//                 "updatedAt": "2024-10-01T04:43:19.207Z",
//                 "assignedTo": "6667d4946da8da5e3eed376e",
//                 "firstName": "joha atkin 33",
//                 "lastName": "sdf2y6",
//                 "reason": "",
//                 "tag": [],
//                 "companyMaster": null,
//                 "leadValue": 1000,
//                 "leadWeight": "Hot"
//             },
//             "totalWithDiscount": null,
//             "createdBy": "6667d4946da8da5e3eed376e",
//             "companyMaster": null,
//             "assignedTo": null,
//             "createdAt": "2024-08-03T07:16:33.624Z",
//             "updatedAt": "2024-08-03T07:16:33.624Z",
//             "__v": 0
//         },
//         "createdBy": null,
//         "createdAt": "2024-09-27T10:28:25.907Z",
//         "updatedAt": "2024-09-27T10:28:25.907Z",
//         "__v": 0
//     },
//     {
//         "_id": "66f688c9f80a4dae8578c3bz",
//         "module": "Task",
//         "action": "updated",
//         "lead": "66684df009fefd860e4690f3",
//         "relatedId": {
//             "_id": "66d6efdeaa2cdcdf2dee7719",
//             "title": "make call to lead",
//             "description": "82934dsgsdf",
//             "lead": {
//                 "leadValue": 0,
//                 "_id": "669f9ab4213d8b766d7d46a0",
//                 "firstName": "anil",
//                 "lastName": "shinde",
//                 "email": "anil@gmail.com",
//                 "status": "666952ce3497ff34ce0b2b94",
//                 "companyMaster": "669f9881213d8b766d7d4660",
//                 "tag": [],
//                 "info": {
//                     "mobile": "9898989898",
//                     "address": "pune",
//                     "city": "pune",
//                     "country": "India",
//                     "source": "Website",
//                     "_id": "669f9ab4213d8b766d7d46a1"
//                 },
//                 "createdBy": "666c60da2fc3be99161b8181",
//                 "assignedTo": "666c60da2fc3be99161b8181",
//                 "createdAt": "2024-07-23T11:57:40.392Z",
//                 "updatedAt": "2024-09-03T11:13:54.257Z",
//                 "__v": 0,
//                 "reason": "deal won"
//             },
//             "taskStatus": true,
//             "dueDate": "2024-09-02T18:30:00.000Z",
//             "outcome": "made call",
//             "taskStages": "Completed",
//             "assignedTo": [
//                 {
//                     "_id": "666c60da2fc3be99161b8181",
//                     "username": "ample",
//                     "email": "f_executive3@gmail.com",
//                     "name": "Finance USER"
//                 }
//             ],
//             "assignedBy": {
//                 "_id": "666c60da2fc3be99161b8181",
//                 "username": "ample",
//                 "email": "f_executive3@gmail.com",
//                 "name": "Finance USER",
//                 "mobileNo": "123406784",
//                 "role": "66b304ea23914a20c74f8f19",
//                 "isActive": true,
//                 "userType": "System",
//                 "createdAt": "2024-06-14T15:25:14.110Z",
//                 "updatedAt": "2024-09-03T11:06:02.813Z",
//                 "__v": 0,
//                 "companyMaster": "669f9881213d8b766d7d4660",
//                 "taskKanban": false
//             },
//             "createdBy": {
//                 "_id": "666c60da2fc3be99161b8181",
//                 "username": "ample",
//                 "email": "f_executive3@gmail.com",
//                 "name": "Finance USER",
//                 "mobileNo": "123406784",
//                 "role": "66b304ea23914a20c74f8f19",
//                 "isActive": true,
//                 "userType": "System",
//                 "createdAt": "2024-06-14T15:25:14.110Z",
//                 "updatedAt": "2024-09-03T11:06:02.813Z",
//                 "__v": 0,
//                 "companyMaster": "669f9881213d8b766d7d4660",
//                 "taskKanban": false
//             },
//             "companyMaster": "669f9881213d8b766d7d4660",
//             "createdAt": "2024-09-03T11:15:42.794Z",
//             "updatedAt": "2024-09-03T11:16:00.367Z",
//             "__v": 0
//         },
//         "createdBy": null,
//         "createdAt": "2024-09-27T10:28:25.907Z",
//         "updatedAt": "2024-09-27T10:28:25.907Z",
//         "__v": 0
//     },



// ];