import React from 'react'
import CreateRating from './CreateRating'
import { useParams } from 'react-router-dom';
import { useGetRatingQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';


const MainRating = ({Rating_id,performCancel,lead_id}) => {
  const {id}=useParams()
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetRatingQuery({_id:Rating_id?._id?Rating_id?._id:id});

  return <div>{fetch ? <LoadingHV /> : <CreateRating lead_id={lead_id} formValue={data} performCancel={performCancel}/> }</div>;
};


export default MainRating
