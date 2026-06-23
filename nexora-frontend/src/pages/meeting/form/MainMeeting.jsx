import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetMeetingQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';
import CreateMeeting from './CreateMeeting';

const MainMeeting = ({meeting_id,performCancel,lead_id}) => {
  const {id}=useParams()
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetMeetingQuery({_id:meeting_id?._id?meeting_id?._id:id});

  return <div>{fetch ? <LoadingHV /> : <CreateMeeting lead_id={lead_id} formValue={data} performCancel={performCancel}/> }</div>;
};


export default MainMeeting
