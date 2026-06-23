import React from 'react'
import CreateDeal from './CreateDeal'
import { useGetDealQuery } from '../../../features/allApi';
import { useParams } from 'react-router-dom';
import LoadingHV from '../../../atoms/loading/LoadingHV';
import { skipToken } from '@reduxjs/toolkit/query';

const MainDeal = ({lead_id,getData,performCancel}) => {
  const {id}=useParams()
  
  // Only fetch if we have an ID to fetch (for edit mode)
  const dealId = getData || id;
  
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetDealQuery(dealId ? {_id: dealId} : skipToken, {
    skip: !dealId,
  });

  // If we have dealId, show loading while fetching
  if (dealId && fetch) {
    return <LoadingHV />;
  }

  return <CreateDeal lead_id={lead_id} formValue={data} performCancel={performCancel} />;
};


export default MainDeal
