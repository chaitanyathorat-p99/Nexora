import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "./userSlice";
import {
  CallFilterObj,
  ClientUserFilterObj,
  DealFilterObj,
  FeaturesMasterFilterObj,
  LeadFilterObj,
  LeadStatusFilterObj,
  LimitFilterObj,
  MeetingFilterObj,
  PlanFilterObj,
  ProductFilterObj,
  QuotationFilterObj,
  SubscriptionFilterObj,
  SystemUserFilterObj,
  TaskFilterObj,
  UserRoleFilterObj,
  StatsFilterObj,
  ActivityFilterObj,
  ReportFilterObj,
} from "../atoms/StaticFilter";
import { Expand } from "./authfunctions/userLogin";

// Constants
const trending_page = "trending_page";
const lead_filter = "lead_filter";
const activity_filter = "activity_filter";
const lead_status_filter = "lead_status_filter";
const system_user_filter = "system_user_filter";
const client_user_filter = "client_user_filter";
const user_role_filter = "user_role_filter";
const task_filter = "task_filter";
const product_filter = "product_filter";
const deal_filter = "deal_filter";
const meeting_filter = "meeting_filter";
const quotation_filter = "quotation_filter";
const call_filter = "call_filter";
const refetch_model = "refetch_model";
const stats_filter = "stats_filter";
const report_filter = "report_filter";
const ticket_filter = "ticket_filter";
const plan_filter = "plan_filter";
const subscription_filter = "subscription_filter";
const features_master_filter = "features_master_filter";
const limit_filter = "limit_filter";
const enquiry_filter = "enquiry_filter";
const email_template_filter = "email_template_filter";

// Dynamic Fields Constants
const dynamic_fields_filter = "dynamic_fields_filter";
const dynamic_fields_string = "dynamic_fields_string";
const dynamic_fields_page = "dynamic_fields_page";

// String Constants
const lead_string = "lead_string";
const lead_status_string = "lead_status_string";
const system_user_string = "system_user_string";
const client_user_string = "client_user_string";
const user_role_string = "user_role_string";
const task_string = "task_string";
const product_string = "product_string";
const deal_string = "deal_string";
const meeting_string = "meeting_string";
const quotation_string = "quotation_string";
const call_string = "call_string";
const stats_string = "stats_string";
const ticket_string = "ticket_string";
const plan_string = "plan_string";
const subscription_string = "subscription_string";
const features_master_string = "features_master_string";
const limit_string = "limit_string";
const enquiry_string = "enquiry_string";
const email_template_string = "email_template_string";

// Page Constants
const deal_page = "deal_page";
const task_page = "task_page";
const lead_page = "lead_page";
const meeting_page = "meeting_page";
const call_page = "call_page";
const quotation_page = "quotation_page";
const ticket_page = "ticket_page";
const plan_page = "plan_page";
const subscription_page = "subscription_page";
const limit_page = "limit_page";
const enquiry_page = "enquiry_page";
const email_template_page = "email_template_page";

// Action Creators
export const Refetch_Model = (newPage) => {
  console.log("refetch", newPage);
  return {
    type: refetch_model,
    payload: newPage,
  };
};

export const ReportFilter = (newPage) => {
  console.log("report_filter", newPage);
  return {
    type: report_filter,
    payload: newPage,
  };
};

export const Trending_page = (newPage) => {
  return {
    type: trending_page,
    payload: newPage,
  };
};

export const LeadFilter = (newPage) => {
  return {
    type: lead_filter,
    payload: newPage,
  };
};

export const ActivityFilter = (newPage) => {
  return {
    type: activity_filter,
    payload: newPage,
  };
};

export const CallFilter = (newPage) => {
  return {
    type: call_filter,
    payload: newPage,
  };
};

export const QuotationFilter = (newPage) => {
  return {
    type: quotation_filter,
    payload: newPage,
  };
};

export const MeetingFilter = (newPage) => {
  return {
    type: meeting_filter,
    payload: newPage,
  };
};

export const LeadStatusFilter = (newPage) => {
  return {
    type: lead_status_filter,
    payload: newPage,
  };
};

export const SystemUserFilter = (newPage) => {
  return {
    type: system_user_filter,
    payload: newPage,
  };
};

export const ClientUserFilter = (newPage) => {
  return {
    type: client_user_filter,
    payload: newPage,
  };
};

export const UserRoleFilter = (newPage) => {
  return {
    type: user_role_filter,
    payload: newPage,
  };
};

export const TaskFilter = (newPage) => {
  return {
    type: task_filter,
    payload: newPage,
  };
};

export const ProductFilter = (newPage) => {
  return {
    type: product_filter,
    payload: newPage,
  };
};

export const DealFilter = (newPage) => {
  return {
    type: deal_filter,
    payload: newPage,
  };
};

export const StatsFilter = (newPage) => {
  return {
    type: stats_filter,
    payload: newPage,
  };
};

export const TicketFilter = (newPage) => {
  return {
    type: ticket_filter,
    payload: newPage,
  };
};

export const PlanFilter = (newPage) => {
  return {
    type: plan_filter,
    payload: newPage,
  };
};

export const SubscriptionFilter = (newPage) => {
  return {
    type: subscription_filter,
    payload: newPage,
  };
};

export const FeaturesMasterFilter = (newPage) => {
  return {
    type: features_master_filter,
    payload: newPage,
  };
};

export const LimitFilter = (newPage) => {
  return {
    type: limit_filter,
    payload: newPage,
  };
};

export const EmailTemplateFilter = (newPage) => {
  return {
    type: email_template_filter,
    payload: newPage,
  };
};

// Dynamic Fields Action Creators
export const DynamicFieldsFilter = (newPage) => {
  return {
    type: dynamic_fields_filter,
    payload: newPage,
  };
};
export const DynamicFieldsString = (newPage) => {
  return {
    type: dynamic_fields_string,
    payload: newPage,
  };
};
export const DynamicFieldsPage = (newPage) => {
  return {
    type: dynamic_fields_page,
    payload: newPage,
  };
};

// String Action Creators
export const QuotationString = (newPage) => {
  return {
    type: quotation_string,
    payload: newPage,
  };
};

export const LeadString = (newPage) => {
  return {
    type: lead_string,
    payload: newPage,
  };
};

export const MeetingString = (newPage) => {
  return {
    type: meeting_string,
    payload: newPage,
  };
};

export const CallString = (newPage) => {
  return {
    type: call_string,
    payload: newPage,
  };
};

export const LeadStatusString = (newPage) => {
  return {
    type: lead_status_string,
    payload: newPage,
  };
};

export const SystemUserString = (newPage) => {
  return {
    type: system_user_string,
    payload: newPage,
  };
};

export const ClientUserString = (newPage) => {
  return {
    type: client_user_string,
    payload: newPage,
  };
};

export const UserRoleString = (newPage) => {
  return {
    type: user_role_string,
    payload: newPage,
  };
};

export const TaskString = (newPage) => {
  return {
    type: task_string,
    payload: newPage,
  };
};

export const ProductString = (newPage) => {
  return {
    type: product_string,
    payload: newPage,
  };
};

export const DealString = (newPage) => {
  return {
    type: deal_string,
    payload: newPage,
  };
};

export const StatsString = (newPage) => {
  return {
    type: stats_string,
    payload: newPage,
  };
};

export const TicketString = (newPage) => {
  return {
    type: ticket_string,
    payload: newPage,
  };
};

export const PlanString = (newPage) => {
  return {
    type: plan_string,
    payload: newPage,
  };
};

export const SubscriptionString = (newPage) => {
  return {
    type: subscription_string,
    payload: newPage,
  };
};

export const FeaturesMasterString = (newPage) => {
  return {
    type: features_master_string,
    payload: newPage,
  };
};

export const LimitString = (newPage) => {
  return {
    type: limit_string,
    payload: newPage,
  };
};

export const EmailTemplateString = (newPage) => {
  return {
    type: email_template_string,
    payload: newPage,
  };
};

// Page Action Creators
export const MeetingPage = (newPage) => {
  return {
    type: meeting_page,
    payload: newPage,
  };
};

export const CallPage = (newPage) => {
  return {
    type: call_page,
    payload: newPage,
  };
};

export const QuotationPage = (newPage) => {
  return {
    type: quotation_page,
    payload: newPage,
  };
};

export const DealPage = (newPage) => {
  return {
    type: deal_page,
    payload: newPage,
  };
};

export const TaskPage = (newPage) => {
  return {
    type: task_page,
    payload: newPage,
  };
};

export const LeadPage = (newPage) => {
  return {
    type: lead_page,
    payload: newPage,
  };
};

export const TicketPage = (newPage) => {
  return {
    type: ticket_page,
    payload: newPage,
  };
};

export const PlanPage = (newPage) => {
  return {
    type: plan_page,
    payload: newPage,
  };
};

export const SubscriptionPage = (newPage) => {
  return {
    type: subscription_page,
    payload: newPage,
  };
};

export const LimitPage = (newPage) => {
  return {
    type: limit_page,
    payload: newPage,
  };
};

export const EmailTemplatePage = (newPage) => {
  return {
    type: email_template_page,
    payload: newPage,
  };
};

// Updated Initial State
const initialState = {
  trending_page: 1,
  deal_page: 1,
  lead_page: 1,
  task_page: 1,
  meeting_page: 1,
  quotation_page: 1,
  call_page: 1,
  ticket_page: 1,
  enquiry_page: 1,

  lead_filter: LeadFilterObj,
  activity_filter: ActivityFilterObj,
  quotation_filter: QuotationFilterObj,
  lead_status_filter: LeadStatusFilterObj,
  system_user_filter: SystemUserFilterObj,
  client_user_filter: ClientUserFilterObj,
  user_role_filter: UserRoleFilterObj,
  task_filter: TaskFilterObj,
  meeting_filter: MeetingFilterObj,
  product_filter: ProductFilterObj,
  deal_filter: DealFilterObj,
  call_filter: CallFilterObj,
  stats_filter: StatsFilterObj,
  report_filter: ReportFilterObj,
  ticket_filter: {},
  enquiry_filter: { },

  lead_string: "",
  refetch_model: "",
  call_string: "",
  meeting_string: "",
  quotation_string: "",
  lead_status_string: "",
  system_user_string: "",
  client_user_string: "",
  user_role_string: "",
  task_string: "",
  product_string: "",
  deal_string: "",
  stats_string: "",
  ticket_string: "",
  enquiry_string: "",

  expand: true,

  report_page: 1,
  report_filter: {},
  report_string: "",
  
  plan_page: 1,
  plan_filter: PlanFilterObj,
  plan_string: "",
  
  subscription_page: 1,
  subscription_filter: SubscriptionFilterObj,
  subscription_string: "",

  features_master_string: "",
  features_master_filter: FeaturesMasterFilterObj,
  limit_string: "",
  limit_filter: LimitFilterObj,
  limit_page: 1,
  email_template_string: "",
  email_template_filter: {},
  email_template_page: 1,

  dynamic_fields_page: 1,
  dynamic_fields_filter: {},
  dynamic_fields_string: "",
};

// Updated Slice
const remainingSlice = createSlice({
  name: "remaning",
  initialState,
  reducers: {
    logout(state, action) {
      return {
        ...state,

        trending_page: 1,
        deal_page: 1,
        lead_page: 1,
        meeting_page: 1,
        task_page: 1,
        quotation_page: 1,
        call_page: 1,
        ticket_page: 1,
        enquiry_page: 1,

        lead_filter: LeadFilterObj,
        quotation_filter: QuotationFilterObj,
        activity_filter: ActivityFilterObj,
        lead_status_filter: LeadStatusFilterObj,
        system_user_filter: SystemUserFilterObj,
        client_user_filter: ClientUserFilterObj,
        user_role_filter: UserRoleFilterObj,
        task_filter: TaskFilterObj,
        product_filter: ProductFilterObj,
        deal_filter: DealFilterObj,
        meeting_filter: MeetingFilterObj,
        call_filter: CallFilterObj,
        stats_filter: StatsFilterObj,
        report_filter: ReportFilterObj,
        ticket_filter: {},
        enquiry_filter: { },

        refetch_model: "",

        lead_string: "",
        quotation_string: "",
        meeting_string: "",
        call_string: "",
        lead_status_string: "",
        system_user_string: "",
        client_user_string: "",
        user_role_string: "",
        task_string: "",
        product_string: "",
        deal_string: "",
        stats_string: "",
        ticket_string: "",
        enquiry_string: "",

        expand: true,

        report_page: 1,
        report_filter: {},
        report_string: "",
        
        plan_page: 1,
        plan_filter: PlanFilterObj,
        plan_string: "",
        
        subscription_page: 1,
        subscription_filter: SubscriptionFilterObj,
        subscription_string: "",

        features_master_string: "",
        features_master_filter: FeaturesMasterFilterObj,
        limit_string: "",
        limit_filter: LimitFilterObj,
        limit_page: 1,
        email_template_string: "",
        email_template_filter: {},
        email_template_page: 1,

        dynamic_fields_page: 1,
        dynamic_fields_filter: {},
        dynamic_fields_string: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state, action) => {
        return initialState;
      })
      .addCase(trending_page, (state, action) => {
        state.trending_page = action.payload;
      })
      .addCase(refetch_model, (state, action) => {
        state.refetch_model = action.payload;
      })
      .addCase(quotation_page, (state, action) => {
        state.quotation_page = action.payload;
      })
      .addCase(deal_page, (state, action) => {
        state.deal_page = action.payload;
      })
      .addCase(lead_page, (state, action) => {
        state.lead_page = action.payload;
      })
      .addCase(call_page, (state, action) => {
        state.call_page = action.payload;
      })
      .addCase(meeting_page, (state, action) => {
        state.meeting_page = action.payload;
      })
      .addCase(task_page, (state, action) => {
        state.task_page = action.payload;
      })
      .addCase(report_filter, (state, action) => {
        state.report_filter = action.payload;
      })
      .addCase(ticket_page, (state, action) => {
        state.ticket_page = action.payload;
      })
      .addCase(lead_filter, (state, action) => {
        state.lead_filter = action.payload;
        state.lead_page = 1;
      })
      .addCase(activity_filter, (state, action) => {
        state.activity_filter = action.payload;
      })
      .addCase(call_filter, (state, action) => {
        state.call_filter = action.payload;
        state.call_page = 1;
      })
      .addCase(quotation_filter, (state, action) => {
        state.quotation_filter = action.payload;
        state.quotation_page = 1;
      })
      .addCase(lead_status_filter, (state, action) => {
        state.lead_status_filter = action.payload;
      })
      .addCase(system_user_filter, (state, action) => {
        state.system_user_filter = action.payload;
      })
      .addCase(stats_filter, (state, action) => {
        state.stats_filter = action.payload;
      })
      .addCase(client_user_filter, (state, action) => {
        state.client_user_filter = action.payload;
      })
      .addCase(user_role_filter, (state, action) => {
        state.user_role_filter = action.payload;
      })
      .addCase(task_filter, (state, action) => {
        state.task_filter = action.payload;
        state.task_page = 1;
      })
      .addCase(meeting_filter, (state, action) => {
        state.meeting_filter = action.payload;
        state.meeting_page = 1;
      })
      .addCase(product_filter, (state, action) => {
        state.product_filter = action.payload;
      })
      .addCase(deal_filter, (state, action) => {
        state.deal_filter = action.payload;
        state.deal_page = 1;
      })
      .addCase(ticket_filter, (state, action) => {
        state.ticket_filter = action.payload;
        state.ticket_page = 1;
      })
      .addCase(lead_string, (state, action) => {
        state.lead_string = action.payload;
        state.lead_page = 1;
      })
      .addCase(call_string, (state, action) => {
        state.call_string = action.payload;
        state.call_page = 1;
      })
      .addCase(quotation_string, (state, action) => {
        state.quotation_string = action.payload;
        state.quotation_page = 1;
      })
      .addCase(meeting_string, (state, action) => {
        state.meeting_string = action.payload;
        state.meeting_page = 1;
      })
      .addCase(lead_status_string, (state, action) => {
        state.lead_status_string = action.payload;
      })
      .addCase(system_user_string, (state, action) => {
        state.system_user_string = action.payload;
      })
      .addCase(client_user_string, (state, action) => {
        state.client_user_string = action.payload;
      })
      .addCase(stats_string, (state, action) => {
        state.stats_string = action.payload;
      })
      .addCase(user_role_string, (state, action) => {
        state.user_role_string = action.payload;
      })
      .addCase(task_string, (state, action) => {
        state.task_string = action.payload;
        state.task_page = 1;
      })
      .addCase(product_string, (state, action) => {
        state.product_string = action.payload;
      })
      .addCase(deal_string, (state, action) => {
        state.deal_string = action.payload;
        state.deal_page = 1;
      })
      .addCase(ticket_string, (state, action) => {
        state.ticket_string = action.payload;
        state.ticket_page = 1;  
      })
      .addCase(Expand.fulfilled, (state, action) => {
        state.expand = action.payload;
      })
      .addCase(plan_page, (state, action) => {
        state.plan_page = action.payload;
      })
      .addCase(plan_filter, (state, action) => {
        state.plan_filter = action.payload;
      })
      .addCase(plan_string, (state, action) => {
        state.plan_string = action.payload;
      })
      .addCase(subscription_page, (state, action) => {
        state.subscription_page = action.payload;
      })
      .addCase(subscription_filter, (state, action) => {
        state.subscription_filter = action.payload;
      })
      .addCase(subscription_string, (state, action) => {
        state.subscription_string = action.payload;
      })
      .addCase(features_master_string, (state, action) => {
        state.features_master_string = action.payload;
      })
      .addCase(limit_string, (state, action) => {
        state.limit_string = action.payload;
        state.limit_page = 1;
      })
      .addCase(features_master_filter, (state, action) => {
        state.features_master_filter = action.payload;
      })
      .addCase(limit_filter, (state, action) => {
        state.limit_filter = action.payload;
        state.limit_page = 1;
      })
      .addCase(limit_page, (state, action) => {
        state.limit_page = action.payload;
      })
      .addCase(enquiry_filter, (state, action) => {
        state.enquiry_filter = action.payload;
        state.enquiry_page = 1;
      })
      .addCase(enquiry_string, (state, action) => {
        state.enquiry_string = action.payload;
        state.enquiry_page = 1;
      })
      .addCase(enquiry_page, (state, action) => {
        state.enquiry_page = action.payload;
      })
      .addCase(email_template_filter, (state, action) => {
        state.email_template_filter = action.payload;
        state.email_template_page = 1;
      })
      .addCase(email_template_string, (state, action) => {
        state.email_template_string = action.payload;
        state.email_template_page = 1;
      })
      .addCase(email_template_page, (state, action) => {
        state.email_template_page = action.payload;
      })
      .addCase(dynamic_fields_page, (state, action) => {
        state.dynamic_fields_page = action.payload;
      })
      .addCase(dynamic_fields_filter, (state, action) => {
        state.dynamic_fields_filter = action.payload;
        state.dynamic_fields_page = 1;
      })
      .addCase(dynamic_fields_string, (state, action) => {
        state.dynamic_fields_string = action.payload;
        state.dynamic_fields_page = 1;
      });
  },
});

export const EnquiryFilter = (newPage) => {
  return {
    type: enquiry_filter,
    payload: newPage,
  };
};

export const EnquiryString = (newPage) => {
  return {
    type: enquiry_string,
    payload: newPage,
  };
};

export const EnquiryPage = (newPage) => {
  return {
    type: enquiry_page,
    payload: newPage,
  };
};

export default remainingSlice.reducer;