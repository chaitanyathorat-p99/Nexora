import React from 'react'
import CreateFeatureMaster from './CreateFeatureMaster'
import { useParams } from 'react-router-dom';
import { useGetFeatureMasterQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';

const MainFeatureMaster = () => {
    const {id} = useParams()
    const {
      data: data,
      isLoading: isLoading,
      isFetching: fetch,
      error: error,
    } = useGetFeatureMasterQuery({_id:id});
  
    return <div>{fetch ? <LoadingHV/> : <CreateFeatureMaster formValue={data}/> }</div>;
};
  

export default MainFeatureMaster
