import { configureStore } from "@reduxjs/toolkit";
import { allApi } from "../allApi"; 
import userReducer from "../userSlice";
import remainingReducer from "../remainingSlice";
import uiReducer from '../ui/uiSlice';
import aiAgentReducer from '../ai-agent/aiAgentSlice';

const store = configureStore({
    reducer: {
      user: userReducer,
      remaining: remainingReducer,
      ui: uiReducer,
      aiAgent: aiAgentReducer,
      [allApi.reducerPath]: allApi.reducer,
    },
    
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(allApi.middleware);
    },
  });
  
  export default store;

export {
   //All Api
   useFetchLeadQuery,
   useCreateLeadMutation,
   useGetLeadQuery,
   useUpdateLeadMutation,
   useGetLeadDetailsQuery,
   
   // Enquiry endpoints
   useFetchEnquiriesQuery,
   useGetEnquiryQuery,
   useCreateEnquiryMutation,
   useUpdateEnquiryMutation,
   useDeleteEnquiryMutation,
   
   useFetchLeadStatusQuery,
   useCreateLeadStatusMutation,
   useGetLeadStatusQuery,
   useUpdateLeadStatusMutation,

  useFetchUserQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,



  
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useFetchTaskQuery,
  useGetTaskQuery,

  useDeleteLeadMutation,
  useDeleteLeadStatusMutation,
  useDeleteTaskMutation,



  useFetchNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,


  
  useFetchCompanyQuery,
  useGetCompanyQuery,

  useCreateCompanyMutation,
  useUpdateCompanyMutation,


  useFetchUserRoleQuery,
  useGetUserRoleQuery,
  useCreateUserRoleMutation,
  useUpdateUserRoleMutation,
  useDeleteUserRoleMutation,


  
  useFetchProductQuery,
  useCreateProductsMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,


  
  useFetchDealQuery,
  useCreateDealMutation,
  useUpdateDealMutation,
  useDeleteDealsMutation,
  useGetDealDetailsQuery,

  useGetDealQuery,

  useFetchCompanyMasterQuery,
  useCreateCompanyMasterMutation,
  useUpdateCompanyMasterMutation,
  useDeleteCompanyMasterMutation,
  useGetCompanyMasterQuery,

  
  useFetchQuotationQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
  useGetQuotationQuery,
  useGetQuotationDetailQuery,

  
  useFetchMeetingQuery,
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
  useGetMeetingQuery,

  
  useFetchCallQuery,
  useCreateCallMutation,
  useUpdateCallMutation,
  useDeleteCallMutation,
  useGetCallQuery,

  
  useFetchRatingQuery,
  useFetchStatsCountCreatedAtQuery,
  useFetchStatsCountByDayCreatedAtQuery,
  useFetchStatsCountProductsQuery,
  useFetchYearOptionsQuery,

  useFetchActivityQuery,

  useFetchIndustryTypeQuery,
  useFetchTypeOfBuyerQuery,
  useCreateTypeOfBuyerMutation,
  useCreateIndustryTypeMutation,
  useGetTypeOfBuyerQuery,
  useGetIndustryTypeQuery,
  useUpdateIndustryTypeMutation,
  useDeleteIndustryTypeMutation,
  useDeleteTypeOfBuyerMutation,
  useUpdateTypeOfBuyerMutation,

  useFetchIndustryTypeLeadCountQuery,
  useFetchLeadReportRatioQuery,
  useFetchQuotationReportRatioQuery,

  useFetchCommonApiQuery,
  useFetchLeadExportQuery,
  useImportLeadMutation,

  useCreateColumnsMutation
} from "../allApi";