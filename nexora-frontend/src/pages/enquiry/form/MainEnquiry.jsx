import React from 'react'
import CreateEnquiry from './CreateEnquiry'
import { useParams } from 'react-router-dom';
import { useGetEnquiryQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';

const MainEnquiry = () => {
    const {id} = useParams()
    const {
      data: data,
      isLoading: isLoading,
      isFetching: fetch,
      error: error,
    } = useGetEnquiryQuery({_id:id});
  
    return <div>{fetch ? <LoadingHV/> : <CreateEnquiry formValue={data}/> }</div>;
};
  
export default MainEnquiry 