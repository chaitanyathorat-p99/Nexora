import React from 'react'
import CreateCall from './CreateCall'
import LoadingHV from '../../../atoms/loading/LoadingHV';
import { useGetCallQuery } from '../../../features/allApi';
import { useParams } from 'react-router-dom';

const MainCall= ({call_id,performCancel,lead_id}) => {
    const {id}=useParams()
    const {
      data: data,
      isLoading: isLoading,
      isFetching: fetch,
      error: error,
    } = useGetCallQuery({_id:call_id?._id?call_id?._id:id});
  
    return <div>{fetch ? <LoadingHV /> : <CreateCall lead_id={lead_id} formValue={data} performCancel={performCancel}/> }</div>;
  };

export default MainCall
