import React from 'react'
import CreateUserRole from './CreateUserRole'
import LoadingHV from '../../../atoms/loading/LoadingHV';
import { useGetUserRoleQuery } from '../../../features/allApi';
import { useParams } from 'react-router-dom';

const MainUserRole = () => {
    const {id}=useParams()
    const {
      data: data,
      isLoading: isLoading,
      isFetching: fetch,
      error: error,
    } = useGetUserRoleQuery({_id:id});
  
    return <div>{fetch ? <LoadingHV /> : <CreateUserRole  formValue={data?.data}/>}</div>;
  };

export default MainUserRole
