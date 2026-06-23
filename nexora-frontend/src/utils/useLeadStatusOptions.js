import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useFetchCommonApiQuery, useFetchLeadStatusQuery } from "../features/allApi";

const PRIVILEGED_ROLES = new Set(["SUPER_ADMIN", "ADMIN"]);

const normalizeRoleName = (roleName) => {
  if (!roleName) {
    return "";
  }

  return String(roleName).toUpperCase().replace(/\s+/g, "_");
};

const mergeUniqueStatuses = (primary = [], secondary = []) => {
  const merged = [];
  const seenIds = new Set();

  [...primary, ...secondary].forEach((item) => {
    const id = item?._id;
    if (!id || seenIds.has(id)) {
      return;
    }

    seenIds.add(id);
    merged.push(item);
  });

  return merged;
};

export default function useLeadStatusOptions() {
  const user = useSelector((state) => state?.user?.user);
  const normalizedRole = normalizeRoleName(user?.role?.name);
  const isPrivilegedRole = PRIVILEGED_ROLES.has(normalizedRole);

  const {
    data: leadStatusFromLeadStatusApi,
    isLoading: isLeadStatusLoading,
    isFetching: isLeadStatusFetching,
    error: leadStatusError,
  } = useFetchLeadStatusQuery({ filterString: "" });

  const {
    data: commonApiData,
    isLoading: isCommonApiLoading,
    isFetching: isCommonApiFetching,
    error: commonApiError,
  } = useFetchCommonApiQuery();

  const leadStatusFromCommonApi = commonApiData?.leadStatus || [];

  const leadStatusOptions = useMemo(() => {
    if (isPrivilegedRole) {
      return mergeUniqueStatuses(leadStatusFromLeadStatusApi, leadStatusFromCommonApi);
    }

    return mergeUniqueStatuses(leadStatusFromCommonApi, leadStatusFromLeadStatusApi);
  }, [isPrivilegedRole, leadStatusFromLeadStatusApi, leadStatusFromCommonApi]);

  return {
    leadStatusOptions,
    isLoading: isLeadStatusLoading || isCommonApiLoading,
    isFetching: isLeadStatusFetching || isCommonApiFetching,
    error: leadStatusError || commonApiError,
  };
}
