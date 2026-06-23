import React from 'react'
import CreateLimit from './CreateLimit'
import { useParams } from 'react-router-dom';
import { useGetLimitQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';

const MainLimit = () => {
    const {id} = useParams()
    const {
      data: data,
      isLoading: isLoading,
      isFetching: fetch,
      error: error,
    } = useGetLimitQuery({_id:id});
  
    return <div>{fetch ? <LoadingHV/> : <CreateLimit formValue={data}/> }</div>;
};
  
export default MainLimit 