import * as DealService from "./deal.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const handleCreateDeal = async (req, res, next) => {
  try {
    const deal = await DealService.createDeal(req.body, req.user);
    res.status(201).json(new ApiResponse(201, deal, "Deal added successfully"));
  } catch (error) {
    next(error);
  }
};

export const handleGetDeals = async (req, res, next) => {
  try {
    const deals = await DealService.listDeals(req.user, req.query);
    res.status(200).json(new ApiResponse(200, deals, "Deals retrieved"));
  } catch (error) {
    next(error);
  }
};

export const handleGetDealByid = async (req, res, next) => {
  try {
    const deal = await DealService.getDealDetails(req.params.id, req.user);
    res.status(200).json(new ApiResponse(200, deal, "Deal details retrieved"));
  } catch (error) {
    next(error);
  }
};

export const handleUpdateDeal = async (req, res, next) => {
  try {
    const deal = await DealService.updateDealInfo(req.params.id, req.body, req.user);
    res.status(200).json(new ApiResponse(200, deal, "Deal updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const handleDeleteDeal = async (req, res, next) => {
  try {
    const deal = await DealService.removeDeal(req.params.id);
    res.status(200).json(new ApiResponse(200, deal, "Deal deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const handleUpdateDealStage = async (req, res, next) => {
  try {
    const { dealStage } = req.body;
    const deal = await DealService.updateDealStage(req.params.id, dealStage, req.user);
    res.status(200).json(new ApiResponse(200, deal, `Deal moved to ${dealStage}`));
  } catch (error) {
    next(error);
  }
};
