import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createMockBaseQuery } from "../mock/mockBaseQuery";
import { appendQueryParams } from "../atoms/static";
import { notification } from "antd";
import { openSubscriptionModal } from '../features/ui/uiSlice';
import { url as apiBaseUrl } from "../components/common/api";

const rawBaseQuery = createMockBaseQuery({ delayMs: 350, errorRate: 0 });
const networkBaseQuery = fetchBaseQuery({
	baseUrl: apiBaseUrl || "",
});

const shouldUseNetworkForRequest = () => Boolean(apiBaseUrl);

const allApi = createApi({
	reducerPath: "allapis",
	baseQuery: async (args, api, extraOptions) => {
		const useNetwork = shouldUseNetworkForRequest(args);
		const baseQueryToUse = useNetwork ? networkBaseQuery : rawBaseQuery;
		const result = await baseQueryToUse(args, api, extraOptions);

		// Preserve existing UX for error states (notifications + subscription modal)
		if (result?.error?.status === 429) {
			notification.error({
				message: "API Limit Reached",
				description: "Please upgrade your plan to continue using our services.",
				placement: "topRight",
				duration: 5,
			});
		} else if (result?.error?.status === 402) {
			api.dispatch(
				openSubscriptionModal(
					result?.error?.data?.message ||
						"Your subscription has expired. Please renew your subscription to continue using our services."
				)
			);
		}

		return result;
	},
	refetchOnMountOrArgChange: true,
	tagTypes: [
		"Columns",
		"Lead",
		"LeadStatus",
		"User",
		"Task",
		"Note",
		"Company",
		"User-Role",
		"Product",
		"ProductType",
		"Deal",
		"Company-Master",
		"Quotation",
		"Meeting",
		"Call",
		"Rating",
		"Dashboard",
		"Activity",
		"Industry-Type",
		"TypeOfBuyer",
		"Report",
		"Common-Api",
		"Ticket",
		"Plan",
		"Subscription",
		"Features-Master",
		"Limit",
		"Enquiry",
		"Dynamic-Fields",
	],
	endpoints(build) {
		return {
			fetchLead: build.query({
				query: ({ filterString, filterObj, page }) => {
					return {
						url: `/leads/?${filterString}${filterObj}${page}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => {
					const items = Array.isArray(response?.data) ? response.data : [];
					return {
						content: items,
						totalElements: items.length,
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [...result?.content?.map(({ _id }) => ({ type: "Lead", _id })), "Lead"]
						: ["Lead"],
			}),
			fetchNote: build.query({
				query: ({ lead }) => {
					return {
						url: `/api/notes/?lead=${lead}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Note", _id })), "Note"]
						: ["Note"],
			}),
			fetchRating: build.query({
				query: () => {
					return {
						url: `/api/rating/`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Rating", _id })), "Rating"]
						: ["Rating"],
			}),
			fetchActivity: build.query({
				query: ({ lead, filterObj }) => {
					return {
						url: `/api/activity/?lead=${lead}${filterObj ? filterObj : ""}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Activity", _id })), "Activity"]
						: ["Activity"],
			}),
			fetchCompany: build.query({
				query: ({ lead }) => {
					return {
						url: `/api/companies/?lead_id=${lead}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Company", _id })), "Company"]
						: ["Company"],
			}),

			getCompany: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/api/companies/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),

			fetchUser: build.query({
				query: ({ type }) => {
					return {
						url: `/users/?${type ? type : ""}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.data?.length
						? [...result?.data?.map(({ _id }) => ({ type: "User", _id })), "User"]
						: ["User"],
			}),
			getLead: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/leads/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				transformResponse: (response) => response?.data || null,
			}),
			getUser: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/users/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			getLeadDetails: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/leads/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				transformResponse: (response) => response?.data || null,
				providesTags: (result, error, arg) =>
					result ? [{ type: "Lead", id: result._id }, "Lead"] : ["Lead"],
			}),
			getDealDetails: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/deals/detail/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				providesTags: (result, error, arg) =>
					result ? [{ type: "Deal", id: result._id }, "Deal"] : ["Deal"],
			}),
			getLeadStatus: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/general-settings/lead-status/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			getRating: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/api/rating/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			fetchLeadStatus: build.query({
				query: ({ filterString }) => {
					return {
						url: `/general-settings/lead-status?limit=1000&${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => response?.data?.items || [],
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "LeadStatus", _id })), "LeadStatus"]
						: ["LeadStatus"],
			}),
			fetchTask: build.query({
				query: ({ lead, filterString, filterObj, page }) => {
					return {
						url: `/tasks/?${lead ? lead : ""}${page}${filterObj}${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result, error, arg) => {
					const items = Array.isArray(result)
						? result
						: Array.isArray(result?.content)
							? result.content
							: [];
					return items.length
						? [...items.map(({ _id }) => ({ type: "Task", _id })), "Task"]
						: ["Task"];
				},
			}),
			fetchUserRole: build.query({
				query: ({ filterString }) => {
					return {
						url: `/api/user-roles/?${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result, error, arg) => {
					const items = Array.isArray(result)
						? result
						: Array.isArray(result?.data)
							? result.data
							: [];
					return items.length
						? [...items.map(({ _id }) => ({ type: "User-Role", _id })), "User-Role"]
						: ["User-Role"];
				},
			}),
			fetchProduct: build.query({
				query: ({ filterString, filterObj }) => {
					return {
						url: `/products/?${filterObj}${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => response?.data || [],
				providesTags: (result = [], error, arg) =>
					Array.isArray(result) && result.length
						? [...result.map(({ _id }) => ({ type: "Product", _id })), "Product"]
						: ["Product"],
			}),
			fetchCompanyMaster: build.query({
				query: ({ filterString, filterObj }) => {
					return {
						url: `/api/company-master/?${filterObj}${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [
								...result?.map(({ _id }) => ({ type: "Company-Master", _id })),
								"Company-Master",
						  ]
						: ["Company-Master"],
			}),
			fetchQuotation: build.query({
				query: ({ filterString, filterObj, lead }) => {
					return {
						url: `/api/quotation/?${filterObj}${filterString}${lead ? lead : ""}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Quotation", _id })), "Quotation"]
						: ["Quotation"],
			}),
			fetchDeal: build.query({
				query: ({ lead_id, filterString, filterObj, page }) => {
					const url = `/deals/?${lead_id}${filterObj}${filterString}${page}`;

					return {
						url,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => {
					const items = Array.isArray(response?.data) ? response.data : [];
					return {
						content: items,
						totalElements: items.length,
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [...result?.content?.map(({ _id }) => ({ type: "Deal", _id })), "Deal"]
						: ["Deal"],
			}),
			fetchMeeting: build.query({
				query: ({ filterString, filterObj, page, lead_id }) => {
					const url = `/meetings/?${lead_id}${filterObj}${filterString}${page}`;

					return {
						url,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => {
					return response?.data || { content: [], totalElements: 0, pages: 0, currentPage: 0 };
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [
								...result?.content?.map(({ _id }) => ({ type: "Meeting", _id })),
								"Meeting",
						  ]
						: ["Meeting"],
			}),
			fetchCall: build.query({
				query: ({ filterString, filterObj, page, lead_id }) => {
					const url = `/calls/?${lead_id}${filterObj}${filterString}${page}`;

					return {
						url,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => {
					return response?.data || { content: [], totalElements: 0, pages: 0, currentPage: 0 };
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [...result?.content?.map(({ _id }) => ({ type: "Call", _id })), "Call"]
						: ["Call"],
			}),
			getTask: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/tasks/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			getMeeting: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/meetings/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				transformResponse: (response) => {
					return response?.data || null;
				},
			}),
			getCall: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/calls/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				transformResponse: (response) => response?.data || null,
			}),
			getDeal: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/deals/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			getQuotation: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/api/quotation/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			getQuotationDetail: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/api/quotation/detail/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			getCompanyMaster: build.query({
				query: ({ _id }) => {
					return {
						url: `/api/company-master/${_id}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
			}),
			getUserRole: build.query({
				query: ({ _id }) => {
					return {
						url: `/api/user-roles/${_id}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
			}),
			createLead: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/leads`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Lead", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			createQuotation: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/api/quotation/`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Quotation", _id: arg._id },
					{ type: "Deal", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			createDeal: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/deals/`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: [
					{ type: "Deal" },
					{ type: "Activity" },
				],
			}),
			updateDeal: build.mutation({
				query: (data) => {
					return {
						url: `/deals/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Deal" },
					{ type: "Activity" },
				],
			}),
			updateMeeting: build.mutation({
				query: (data) => {
					return {
						url: `/meetings/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => {
					return response?.data || null;
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Meeting", _id: arg._id },
					{ type: "Activity", _id: arg?._id },
				],
			}),
			deleteMeeting: build.mutation({
				query: (data) => {
					return {
						url: `/meetings/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => {
					return response?.data || null;
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Meeting", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			createMeeting: build.mutation({
				query: (data) => {
					return {
						url: `/meetings/`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => {
					return response?.data || null;
				},
				invalidatesTags: (result, error, arg) => [
					"Meeting",
					{ type: "Activity", _id: arg?.lead },
				],
			}),
			updateCall: build.mutation({
				query: (data) => {
					return {
						url: `/calls/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Call", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			deleteCall: build.mutation({
				query: (data) => {
					return {
						url: `/calls/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Call", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			createCall: build.mutation({
				query: (data) => {
					return {
						url: `/calls/`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					"Call",
					{ type: "Activity", _id: arg?.lead },
				],
			}),
			createColumns: build.mutation({
				query: (data) => {
					return {
						url: `/api/columns/`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Columns", _id: arg._id }],
			}),
			updateQuotation: build.mutation({
				query: (data) => {
					return {
						url: `/api/quotation/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Quotation", _id: arg._id },
					{ type: "Deal", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			updateLead: build.mutation({
				query: (data) => {
					return {
						url: `/leads/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Lead", _id: arg._id },
					"Lead",
					{ type: "Activity", _id: arg._id },
				],
			}),
			createNote: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/api/notes/`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Note", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			updateNote: build.mutation({
				query: (data) => {
					return {
						url: `/api/note/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Note", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			createCompany: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/api/companies/`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Company", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			createUserRole: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/api/user-roles/`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "User-Role", _id: arg?._id }, "User-Role"],
			}),
			updateCompany: build.mutation({
				query: (data) => {
					return {
						url: `/api/companies/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Company", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			updateUserRole: build.mutation({
				query: (data) => {
					return {
						url: `/api/user-roles/${data?._id}`,
						method: "PATCH",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "User-Role", _id: arg?._id }, "User-Role"],
			}),
			deleteUserRole: build.mutation({
				query: (data) => {
					return {
						url: `/api/user-roles/${data?._id}`,
						method: "DELETE",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "User-Role", _id: arg?._id }, "User-Role"],
			}),
			deleteDeals: build.mutation({
				query: (data) => {
					return {
						url: `/deals/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Deal", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			deleteQuotation: build.mutation({
				query: (data) => {
					return {
						url: `/api/quotation/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Quotation", _id: arg._id },
					{ type: "Deal", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			deleteLead: build.mutation({
				query: (data) => {
					return {
						url: `/leads/${data?._id}`,
						method: "DELETE",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Lead", _id: arg._id }],
			}),
			createTask: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/tasks/`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => ["Task", "Activity"],
			}),
			updateTask: build.mutation({
				query: (data) => {
					return {
						url: `/tasks/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Task", _id: arg._id },
					"Task",
					{ type: "Activity", _id: arg._id },
					"Activity",
				],
			}),
			deleteTask: build.mutation({
				query: (data) => {
					return {
						url: `/tasks/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Task", _id: arg._id },
					"Task",
					{ type: "Activity", _id: arg._id },
					"Activity",
				],
			}),
			deleteCompanyMaster: build.mutation({
				query: (data) => {
					return {
						url: `/api/company-master/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Company-Master", _id: arg._id }],
			}),
			updateLeadStatus: build.mutation({
				query: (data) => {
					return {
						url: `/general-settings/lead-status/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "LeadStatus", _id: arg._id }],
			}),
			deleteUser: build.mutation({
				query: (data) => {
					return {
						url: `/users/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "User", _id: arg?._id }, "User"],
			}),
			updateUser: build.mutation({
				query: (data) => {
					return {
						url: `/users/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "User", _id: arg?._id }, "User"],
			}),
			updateProduct: build.mutation({
				query: (data) => {
					return {
						url: `/products/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => ["Product"],
			}),
			updateRating: build.mutation({
				query: (data) => {
					return {
						url: `/api/rating/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Rating", _id: arg._id }],
			}),
			updateCompanyMaster: build.mutation({
				query: (data) => {
					return {
						url: `/api/company-master/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Company-Master", _id: arg._id }],
			}),
			deleteLeadStatus: build.mutation({
				query: (data) => {
					return {
						url: `/general-settings/lead-status/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "LeadStatus", _id: arg._id }],
			}),
			deleteRating: build.mutation({
				query: (data) => {
					return {
						url: `/api/rating/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Rating", _id: arg._id }],
			}),
			deleteProduct: build.mutation({
				query: (data) => {
					return {
						url: `/products/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: () => ["Product"],
			}),
			createLeadStatus: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/general-settings/lead-status`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "LeadStatus", _id: arg._id }],
			}),
			createRating: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/api/rating/`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Rating", _id: arg._id }],
			}),
			createUser: build.mutation({
				query: (createJobcardData) => {
					const headers = {
						Accept: "application/json",
						"Content-Type": "application/json",
					};
					const token = localStorage.getItem("userToken");
					if (token) {
						headers.Authorization = `Bearer ${token}`;
					}
					return {
						url: `/auth/register`,
						method: "POST",
						body: createJobcardData,
						headers,
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "User", _id: arg?._id }, "User"],
			}),
			createCompanyMaster: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/api/company-master`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Company-Master", _id: arg._id }],
			}),
			createProducts: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/products/`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: () => ["Product"],
			}),
			fetchStatsCountCreatedAt: build.query({
				query: ({ filterString, filterObj }) => {
					return {
						url: `/api/dashboard/count-by-created-date/?${filterObj}${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Dashboard", _id })), "Dashboard"]
						: ["Dashboard"],
			}),
			fetchStatsCountByDayCreatedAt: build.query({
				query: ({ filterString, filterObj }) => {
					return {
						url: `/api/dashboard/count-day-by-created-date/?${filterObj}${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Dashboard", _id })), "Dashboard"]
						: ["Dashboard"],
			}),
			fetchStatsCountProducts: build.query({
				query: ({ filterString, filterObj }) => {
					return {
						url: `/api/dashboard/count-products/?${filterObj}${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Dashboard", _id })), "Dashboard"]
						: ["Dashboard"],
			}),
			fetchYearOptions: build.query({
				query: () => {
					return {
						url: `/api/dashboard/year-options`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Dashboard", _id })), "Dashboard"]
						: ["Dashboard"],
			}),
			fetchIndustryType: build.query({
				query: () => {
					return {
						url: `/general-settings/industry-type?limit=1000`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [
								...result?.map(({ _id }) => ({ type: "Industry-Type", _id })),
								"Industry-Type",
						  ]
						: ["Industry-Type"],
			}),
			createIndustryType: build.mutation({
				query: (data) => {
					return {
						url: `/general-settings/industry-type`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result = [], error, arg) =>
					result?.length
						? [
								...result?.map(({ _id }) => ({ type: "Industry-Type", _id })),
								"Industry-Type",
						  ]
						: ["Industry-Type"],
			}),
			getIndustryType: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/general-settings/industry-type/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			updateIndustryType: build.mutation({
				query: (data) => {
					return {
						url: `/general-settings/industry-type/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Industry-Type", _id: arg._id }],
			}),
			deleteIndustryType: build.mutation({
				query: (data) => {
					return {
						url: `/general-settings/industry-type/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Industry-Type", _id: arg._id }],
			}),
			fetchTypeOfBuyer: build.query({
				query: () => {
					return {
						url: `/general-settings/type-of-buyer?limit=1000`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [
								...result?.map(({ _id }) => ({ type: "TypeOfBuyer", _id })),
								"TypeOfBuyer",
						  ]
						: ["TypeOfBuyer"],
			}),
			createTypeOfBuyer: build.mutation({
				query: (data) => {
					return {
						url: `/general-settings/type-of-buyer`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},

				invalidatesTags: (result = [], error, arg) =>
					result?.length
						? [
								...result?.map(({ _id }) => ({ type: "TypeOfBuyer", _id })),
								"TypeOfBuyer",
						  ]
						: ["TypeOfBuyer"],
			}),
			getTypeOfBuyer: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/general-settings/type-of-buyer/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			updateTypeOfBuyer: build.mutation({
				query: (data) => {
					return {
						url: `/general-settings/type-of-buyer/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "TypeOfBuyer", _id: arg._id }],
			}),
			deleteTypeOfBuyer: build.mutation({
				query: (data) => {
					return {
						url: `/general-settings/type-of-buyer/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "TypeOfBuyer", _id: arg._id }],
			}),
			fetchIndustryTypeLeadCount: build.query({
				query: ({ filterObj }) => {
					return {
						url: `/api/report/leads-by-segment/?${filterObj ? filterObj : ""}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [
								...result?.content?.map(({ _id }) => ({ type: "Report", _id })),
								"Report",
						  ]
						: ["Report"],
			}),
			fetchLeadReportRatio: build.query({
				query: ({ filterObj }) => {
					return {
						url: `/api/report/lead-ratio-buyer-wise/?${filterObj ? filterObj : ""}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [
								...result?.content?.map(({ _id }) => ({ type: "Report", _id })),
								"Report",
						  ]
						: ["Report"],
			}),
			fetchQuotationReportRatio: build.query({
				query: ({ filterObj }) => {
					return {
						url: `/api/report/quotation-total/?${filterObj ? filterObj : ""}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [
								...result?.content?.map(({ _id }) => ({ type: "Report", _id })),
								"Report",
						  ]
						: ["Report"],
			}),
			fetchCommonApi: build.query({
				query: () => {
					return {
						url: `/general-settings?limit=1000`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => {
					const items = response?.data?.items || [];
					const keyMap = {
						lead_status: "leadStatus",
						product_type: "productType",
						industry_type: "segment",
						type_of_buyer: "typeOfBuyer",
					};

					return items.reduce((accumulator, item) => {
						const mappedKey = keyMap[item?.category];
						if (!mappedKey) {
							return accumulator;
						}

						if (!accumulator[mappedKey]) {
							accumulator[mappedKey] = [];
						}

						accumulator[mappedKey].push(item);
						return accumulator;
					}, {});
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [
								...result?.content?.map(({ _id }) => ({ type: "Common-Api", _id })),
								"Common-Api",
						  ]
						: ["Common-Api"],
			}),
			fetchLeadExport: build.query({
				query: ({ filterString, filterObj }) => {
					return {
						url: `/leads/export/?${filterObj}${filterString}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [...result?.content?.map(({ _id }) => ({ type: "Lead", _id })), "Lead"]
						: ["Lead"],
			}),
			importLead: build.mutation({
				query: (createJobcardData) => {
					return {
						url: `/leads/import-csv`,
						method: "POST",
						body: createJobcardData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							// "Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [
					{ type: "Lead", _id: arg._id },
					{ type: "Activity", _id: arg._id },
				],
			}),
			fetchTickets: build.query({
				query: ({ filterObj, filterString, page }) => {
					return {
						url: `/tickets/?${filterString}${filterObj}&${page}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result, error, arg) => {
					const items =
						result?.data?.tickets ||
						result?.tickets ||
						result?.data?.data?.tickets ||
						[];
					return Array.isArray(items) && items.length
						? [...items.map(({ _id }) => ({ type: "Ticket", _id })), "Ticket"]
						: ["Ticket"];
				},
			}),
			getTicket: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/tickets/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				providesTags: (result, error, arg) => {
					const ticket = result?.data ?? result;
					return ticket?._id ? [{ type: "Ticket", _id: ticket._id }, "Ticket"] : ["Ticket"];
				},
			}),
			createTicket: build.mutation({
				query: (ticketData) => {
					return {
						url: `/tickets/`,
						method: "POST",
						body: ticketData,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Ticket" }],
			}),
			updateTicket: build.mutation({
				query: (data) => {
					return {
						url: `/tickets/${data?._id}`,
						method: "PATCH",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Ticket", _id: arg._id }],
			}),
			deleteTicket: build.mutation({
				query: (data) => {
					return {
						url: `/tickets/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Ticket", _id: arg._id }],
			}),


			uploadSingleFiles: build.mutation({
				query: (formData) => ({
				  url: `/upload/files`,
				  method: "POST",
				  body: formData, // Send the FormData object
				  headers: {
					Accept: "application/json",
					Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Keep token for authentication
				  },
				}),
				invalidatesTags: (result, error, arg) => [
				  { type: "File", _id: arg._id }, // Invalidate tags for caching
				],
			  }),

			// Plans Endpoints
			fetchPlans: build.query({
				query: ({ filterString, filterObj, page }) => {
					// Convert filterObj to URL parameters
					let filterParams = '';
					if (filterObj && Object.keys(filterObj).length > 0) {
						for (const key in filterObj) {
							if (filterObj[key]) {
								filterParams += `&${key}=${filterObj[key]}`;
							}
						}
					}
					
					return {
						url: `/api/plans/?${filterString}${filterParams}${page}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [...result?.content?.map(({ _id }) => ({ type: "Plan", _id })), "Plan"]
						: ["Plan"],
			}),
			getPlan: build.query({
				query: (_id) => {
					if (_id) {
						return {
							url: `/api/plans/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			createPlan: build.mutation({
				query: (body) => {
					return {
						url: `/api/plans/`,
						method: "POST",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
						body: body,
					};
				},
				invalidatesTags: ["Plan"],
			}),
			updatePlan: build.mutation({
				query: ({ _id, ...body }) => {
					return {
						url: `/api/plans/${_id}`,
						method: "PUT",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
						body: body,
					};
				},
				invalidatesTags: ["Plan"],
			}),
			deletePlan: build.mutation({
				query: ({ _id }) => {
					console.log(_id);
					return {
						url: `/api/plans/${_id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: ["Plan"],
			}),

			// Subscriptions Endpoints
			fetchSubscriptions: build.query({
				query: ({ filterString, filterObj, page }) => {
					// Convert filterObj to URL parameters
					let filterParams = '';
					if (filterObj && Object.keys(filterObj).length > 0) {
						for (const key in filterObj) {
							if (filterObj[key]) {
								filterParams += `&${key}=${filterObj[key]}`;
							}
						}
					}
					
					return {
						url: `/api/subscriptions/?${filterString}${filterParams}${page}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [...result?.content?.map(({ _id }) => ({ type: "Subscription", _id })), "Subscription"]
						: ["Subscription"],
			}),
			getUserSubscriptions: build.query({
				query: (userId) => {
					return {
						url: `/api/subscriptions/user/${userId}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result, error, arg) => {
					const items = Array.isArray(result)
						? result
						: Array.isArray(result?.data)
							? result.data
							: [];
					return items.length
						? [...items.map(({ _id }) => ({ type: "Subscription", _id })), "Subscription"]
						: ["Subscription"];
				},
			}),
			getSubscription: build.query({
				query: (_id) => {
					if (_id) {
						return {
							url: `/api/subscriptions/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
			}),
			createSubscription: build.mutation({
				query: (body) => {
					return {
						url: `/api/subscriptions/`,
						method: "POST",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
						body: body,
					};
				},
				invalidatesTags: ["Subscription"],
			}),
			updateSubscription: build.mutation({
				query: ({ _id, ...body }) => {
					return {
						url: `/api/subscriptions/${_id}`,
						method: "PUT",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
						body: body,
					};
				},
				invalidatesTags: ["Subscription"],
			}),
			deleteSubscription: build.mutation({
				query: ({ _id }) => {
					return {
						url: `/api/subscriptions/${_id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: ["Subscription"],
			}),
			fetchFeaturesMaster: build.query({
				query: ({ filterString, filterObj }) => {
					// Convert filterObj to URL parameters
					let filterParams = '';
					if (filterObj && Object.keys(filterObj).length > 0) {
						for (const key in filterObj) {
							if (filterObj[key]) {
								filterParams += `&${key}=${filterObj[key]}`;
							}
						}
					}
					
					return {
						url: `/features-master?${filterString}${filterParams}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Features-Master", _id })), "Features-Master"]
						: ["Features-Master"],
			}),
			getFeatureMaster: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/features-master/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				providesTags: (result, error, arg) =>
					result ? [{ type: "Features-Master", id: result._id }, "Features-Master"] : ["Features-Master"],
			}),
			createFeatureMaster: build.mutation({
				query: (data) => ({
					url: "/features-master",
					method: "POST",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${localStorage.getItem("userToken")}`,
						"Content-Type": "application/json",
					},
					body: data,
				}),
				invalidatesTags: ["Features-Master"],
			}),
			updateFeatureMaster: build.mutation({
				query: ({ _id, ...data }) => ({
					url: `/features-master/${_id}`,
					method: "PATCH",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${localStorage.getItem("userToken")}`,
						"Content-Type": "application/json",
					},
					body: data,
				}),
				invalidatesTags: (result, error, { _id }) => [{ type: "Features-Master", _id }],
			}),
			deleteFeatureMaster: build.mutation({
				query: (_id) => ({
					url: `/features-master/${_id}`,
					method: "DELETE",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${localStorage.getItem("userToken")}`,
						"Content-Type": "application/json",
					},
				}),
				invalidatesTags: (result, error, _id) => [{ type: "Features-Master", _id }],
			}),
			fetchLimits: build.query({
				query: (params = {}) => ({
					url: '/limit',
					method: 'GET',
					params,
				}),
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [...result?.content?.map(({ _id }) => ({ type: "Limit", _id })), "Limit"]
						: ["Limit"],
			}),
			getLimit: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/limit/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				providesTags: (result, error, arg) =>
					result ? [{ type: "Limit", id: result._id }, "Limit"] : ["Limit"],
			}),
			createLimit: build.mutation({
				query: (data) => ({
					url: "/limit",
					method: "POST",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${localStorage.getItem("userToken")}`,
						"Content-Type": "application/json",
					},
					body: data,
				}),
				invalidatesTags: ["Limit"],
			}),
			updateLimit: build.mutation({
				query: ({ _id, ...data }) => ({
					url: `/limit/${_id}`,
					method: "PATCH",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${localStorage.getItem("userToken")}`,
						"Content-Type": "application/json",
					},
					body: data,
				}),
				invalidatesTags: (result, error, { _id }) => [{ type: "Limit", _id }],
			}),
			deleteLimit: build.mutation({
				query: (_id) => ({
					url: `/limit/${_id}`,
					method: "DELETE",
					headers: {
						Accept: "application/json",
						Authorization: `Bearer ${localStorage.getItem("userToken")}`,
						"Content-Type": "application/json",
					},
				}),
				invalidatesTags: (result, error, _id) => [{ type: "Limit", _id }],
			}),
			fetchEnquiries: build.query({
				query: ({ filterString, filterObj, page }) => {
					return {
						url: `/api/enquiry/?${filterString}${filterObj}${page}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.content?.length
						? [...result?.content?.map(({ _id }) => ({ type: "Enquiry", _id })), "Enquiry"]
						: ["Enquiry"],
			}),
			getEnquiry: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/api/enquiry/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				providesTags: (result, error, arg) =>
					result ? [{ type: "Enquiry", id: result._id }, "Enquiry"] : ["Enquiry"],
			}),
			createEnquiry: build.mutation({
				query: (data) => {
					return {
						url: `/api/enquiry/`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: ["Enquiry"],
			}),
			updateEnquiry: build.mutation({
				query: (data) => {
					return {
						url: `/api/enquiry/${data?._id}`,
						method: "PATCH",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Enquiry", _id: arg._id }],
			}),
			deleteEnquiry: build.mutation({
				query: (data) => {
					return {
						url: `/api/enquiry/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Enquiry", _id: arg._id }],
			}),
			fetchDynamicFields: build.query({
				query: ({ filterString, filterObj, page }) => {
					return {
						url: `/api/dynamic-fields/?${filterString}${filterObj}${page}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Dynamic-Fields", _id })), "Dynamic-Fields"]
						: ["Dynamic-Fields"],
			}),
			fetchDynamicFieldsByModule: build.query({
				query: ({ moduleType }) => {
					return {
						url: `/api/dynamic-fields/module/${moduleType}`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				providesTags: (result = [], error, arg) =>
					result?.length
						? [...result?.map(({ _id }) => ({ type: "Dynamic-Fields", _id })), "Dynamic-Fields"]
						: ["Dynamic-Fields"],
			}),
			getDynamicField: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/api/dynamic-fields/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				providesTags: (result, error, arg) =>
					result ? [{ type: "Dynamic-Fields", id: result._id }, "Dynamic-Fields"] : ["Dynamic-Fields"],
			}),
			createDynamicField: build.mutation({
				query: (data) => {
					return {
						url: `/api/dynamic-fields/`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: ["Dynamic-Fields"],
			}),
			updateDynamicField: build.mutation({
				query: (data) => {
					return {
						url: `/api/dynamic-fields/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Dynamic-Fields", _id: arg._id }],
			}),
			deleteDynamicField: build.mutation({
				query: (data) => {
					return {
						url: `/api/dynamic-fields/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Dynamic-Fields", _id: arg._id }],
			}),
			toggleDynamicField: build.mutation({
				query: (data) => {
					return {
						url: `/api/dynamic-fields/${data?._id}/toggle`,
						method: "PATCH",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "Dynamic-Fields", _id: arg._id }],
			}),
			reorderDynamicFields: build.mutation({
				query: (data) => {
					return {
						url: `/api/dynamic-fields/reorder`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: ["Dynamic-Fields"],
			}),
			createLeadMutation: build.mutation({
				query: (newLead) => ({
					url: `/leads`,
					method: "POST",
					body: newLead,
				}),
				invalidateTags: ["Lead"],
			}),
			// Email Template endpoints
			getEmailTemplates: build.query({
				query: (params = {}) => ({
					url: '/api/email-templates',
					method: 'GET',
					params,
				}),
				providesTags: (result = [], error, arg) =>
					result?.data?.length
						? [...result?.data?.map(({ _id }) => ({ type: 'EmailTemplate', _id })), 'EmailTemplate']
						: ['EmailTemplate'],
			}),

			getEmailTemplate: build.query({
				query: (_id) => {
					return {
						url: `/api/email-templates/${_id}`,
						method: 'GET',
					};
				},
				providesTags: (result, error, arg) => [{ type: 'EmailTemplate', id: arg._id }],
			}),

			createEmailTemplate: build.mutation({
				query: (data) => ({
					url: '/api/email-templates',
					method: 'POST',
					body: data,
				}),
				invalidatesTags: ['EmailTemplate'],
			}),

			updateEmailTemplate: build.mutation({
				query: ({ id, ...data }) => ({
					url: `/api/email-templates/${id}`,
					method: 'PATCH',
					body: data,
				}),
				invalidatesTags: (result, error, arg) => [{ type: 'EmailTemplate', id: arg.id }],
			}),

			deleteEmailTemplate: build.mutation({
				query: (id) => ({
					url: `/api/email-templates/${id}`,
					method: 'DELETE',
				}),
				invalidatesTags: ['EmailTemplate'],
			}),
			getUserWiseCallStats: build.query({
				query: () => ({
					url: '/api/report/user-wise-call-stats',
					method: 'GET',
				}),
				providesTags: ['Report'],
			}),
			getUserWiseMeetingStats: build.query({
				query: () => ({
					url: '/api/report/user-wise-meeting-stats',
					method: 'GET',
				}),
				providesTags: ['Report'],
			}),
			getUserWiseStatusWiseLeadCount: build.query({
				query: () => ({
					url: '/api/report/user-wise-status-wise-lead-count',
					method: 'GET',
				}),
				providesTags: ['Report'],
			}),
			fetchProductType: build.query({
				query: () => {
					return {
						url: `/product-type/`,
						method: "GET",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				transformResponse: (response) => response?.data || [],
				providesTags: (result = [], error, arg) =>
					Array.isArray(result) && result.length
						? [
							...result.map(({ _id }) => ({ type: "ProductType", _id })),
							"ProductType",
						]
						: ["ProductType"],
			}),
			createProductType: build.mutation({
				query: (data) => {
					return {
						url: `/product-type`,
						method: "POST",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: ["ProductType"],
			}),
			getProductType: build.query({
				query: ({ _id }) => {
					if (_id) {
						return {
							url: `/product-type/${_id}`,
							method: "GET",
							headers: {
								Accept: "application/json",
								Authorization: `Bearer ${localStorage.getItem("userToken")}`,
								"Content-Type": "application/json",
							},
						};
					}
				},
				transformResponse: (response) => response?.data || null,
			}),
			updateProductType: build.mutation({
				query: (data) => {
					return {
						url: `/product-type/${data?._id}`,
						method: "PUT",
						body: data,
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "ProductType", _id: arg._id }],
			}),
			deleteProductType: build.mutation({
				query: (data) => {
					return {
						url: `/product-type/${data?._id}`,
						method: "DELETE",
						headers: {
							Accept: "application/json",
							Authorization: `Bearer ${localStorage.getItem("userToken")}`,
							"Content-Type": "application/json",
						},
					};
				},
				invalidatesTags: (result, error, arg) => [{ type: "ProductType", _id: arg._id }],
			}),

			importCsv: build.mutation({
				query: ({ file, module }) => {
					const formData = new FormData();
					formData.append('file', file);
					return {
						url: `/api/common-api/import-csv?module=${module}`,
						method: 'POST',
						body: formData,
						headers: {
							Authorization: `Bearer ${localStorage.getItem('userToken')}`,
						},
					};
				},
				invalidatesTags: ["Lead",
					"LeadStatus",
					"User",
					"Task",
					"User-Role",
					"Product",
					"Deal",
					"Quotation",
					"Meeting",
					"Call",
					"Industry-Type",
					"TypeOfBuyer",
					"Ticket",
					"ProductType"],
			}),


		};
	},
});

export const {
	useImportCsvMutation,

	useFetchProductTypeQuery,
	useCreateProductTypeMutation,
	useGetProductTypeQuery,
	useUpdateProductTypeMutation,
	useDeleteProductTypeMutation,

	useGetUserWiseMeetingStatsQuery,
	useGetUserWiseCallStatsQuery,
	useGetUserWiseStatusWiseLeadCountQuery,

	useUploadSingleFilesMutation,

	useFetchLeadQuery,
	useCreateLeadMutation,
	useGetLeadQuery,
	useUpdateLeadMutation,
	useGetLeadDetailsQuery,
	useDeleteLeadMutation,

	useFetchLeadStatusQuery,
	useCreateLeadStatusMutation,
	useGetLeadStatusQuery,
	useUpdateLeadStatusMutation,
	useDeleteLeadStatusMutation,

	useFetchUserQuery,
	useGetUserQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,

	useCreateTaskMutation,
	useUpdateTaskMutation,
	useFetchTaskQuery,
	useGetTaskQuery,
	useDeleteTaskMutation,

	useFetchNoteQuery,
	useCreateNoteMutation,
	useUpdateNoteMutation,

	useFetchCompanyQuery,
	useCreateCompanyMutation,
	useGetCompanyQuery,
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
	useCreateRatingMutation,
	useUpdateRatingMutation,
	useDeleteRatingMutation,
	useGetRatingQuery,

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

	useCreateColumnsMutation,

	useFetchTicketsQuery,
	useGetTicketQuery,
	useCreateTicketMutation,
	useUpdateTicketMutation,
	useDeleteTicketMutation,

	useFetchPlansQuery,
	useGetPlanQuery,
	useCreatePlanMutation,
	useUpdatePlanMutation,
	useDeletePlanMutation,

	useFetchSubscriptionsQuery,
	useGetUserSubscriptionsQuery,
	useGetSubscriptionQuery,
	useCreateSubscriptionMutation,
	useUpdateSubscriptionMutation,
	useDeleteSubscriptionMutation,

	useFetchFeaturesMasterQuery,
	useGetFeatureMasterQuery,
	useCreateFeatureMasterMutation,
	useUpdateFeatureMasterMutation,
	useDeleteFeatureMasterMutation,

	useFetchLimitsQuery,
	useGetLimitQuery,
	useCreateLimitMutation,
	useUpdateLimitMutation,
	useDeleteLimitMutation,

	useFetchEnquiriesQuery,
	useGetEnquiryQuery,
	useCreateEnquiryMutation,
	useUpdateEnquiryMutation,
	useDeleteEnquiryMutation,

	useGetEmailTemplatesQuery,
	useGetEmailTemplateQuery,
	useCreateEmailTemplateMutation,
	useUpdateEmailTemplateMutation,
	useDeleteEmailTemplateMutation,

	useFetchDynamicFieldsQuery,
	useFetchDynamicFieldsByModuleQuery,
	useGetDynamicFieldQuery,
	useCreateDynamicFieldMutation,
	useUpdateDynamicFieldMutation,
	useDeleteDynamicFieldMutation,
	useToggleDynamicFieldMutation,
	useReorderDynamicFieldsMutation,
} = allApi;
export { allApi };
export const roleSelector = (state) => state?.user?.user?.role || null;
