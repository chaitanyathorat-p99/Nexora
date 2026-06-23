import * as LeadService from "./lead.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const handleCreateLead = async (req, res, next) => {
  try {
    const lead = await LeadService.createLead(req.body, req.user);
    res.status(201).json(new ApiResponse(201, lead, "Lead created Sucessfully"));
  } catch (error) {
    next(error);
  }
};

export const handleGetLeads = async (req, res, next) => {
  try {
    const result = await LeadService.listLeads(req.query, req.user);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result.leads,
          "Leads retrived",
          result.totalCount,
          result.page,
          result.pageSize
        )
      );
  } catch (error) {
    next(error);
  }
};

export const handleGetLeadById = async (req, res, next) => {
  try {
    const lead = await LeadService.getLeadDetails(req.params.id, req.user);
    res.status(200).json(new ApiResponse(200, lead, "Lead datails retrived"));
  } catch (error) {
    next(error);
  }
};

export const handleUpdateLead = async (req, res, next) => {
  try {
    const lead = await LeadService.updateleadInfo(req.params.id, req.body, req.user);
    res.status(200).json(new ApiResponse(200, lead, "Lead updated sucessfully"));
  } catch (error) {
    next(error);
  }
};

export const handleDeleteLead = async (req, res, next) => {
  try {
    const lead = await LeadService.removeLead(req.params.id);
    res.status(200).json(new ApiResponse(200, lead, "Lead deleted Sucessfully"));
  } catch (error) {
    next(error);
  }
};
