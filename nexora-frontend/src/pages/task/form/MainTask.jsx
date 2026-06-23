import React from 'react'
import CreateTask from './CreateTask'
import { useGetTaskQuery } from '../../../features/allApi';
import { useParams } from 'react-router-dom';
import LoadingHV from '../../../atoms/loading/LoadingHV';

const MainTask = ({task_id,performCancel,goTo}) => {
  const {id}=useParams()
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetTaskQuery({_id:task_id?task_id:id});

  return <div>{fetch ? <LoadingHV /> : <CreateTask  formValue={data} performCancel={performCancel} goTo={goTo}/> }</div>;
};

export default MainTask
