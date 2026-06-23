import React from 'react'
import CreateLeadStatus from './CreateLeadStatus'
import { useGetLeadStatusQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';
import { useParams } from 'react-router-dom';

const MainLeadStatus = () => {
  const {id}=useParams()
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetLeadStatusQuery({_id:id});
  return <div>{fetch ? <LoadingHV /> : <CreateLeadStatus  formValue={data}/>}</div>;

}

export default MainLeadStatus
