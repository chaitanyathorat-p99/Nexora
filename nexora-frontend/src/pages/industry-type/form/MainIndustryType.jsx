import React from 'react'
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetIndustryTypeQuery, useGetMeetingQuery, useGetTypeOfBuyerQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';
import CreateSegment from './CreateIndustryType';

const MainSegment = ({buyer_id,performCancel,lead_id}) => {
  const {id}=useParams()
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetIndustryTypeQuery(buyer_id?._id ? {_id: buyer_id._id} : skipToken);
  const formValue = data?.data ? { ...data.data, desc: data.data.description ?? data.data.desc ?? "" } : undefined;
  console.log("Id", buyer_id);
  return <div>{fetch ? <LoadingHV /> : <CreateSegment formValue={formValue} performCancel={performCancel}/> }</div>;
};


export default MainSegment;