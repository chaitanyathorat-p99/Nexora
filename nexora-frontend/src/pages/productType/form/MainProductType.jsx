import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductTypeQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';
import CreateProductType from './CreateProductType';

const MainProductType = ({ product_type_id, performCancel }) => {
  const { id } = useParams();
  const {
    data: data,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useGetProductTypeQuery({ _id: product_type_id?._id });
  return <div>{fetch ? <LoadingHV /> : <CreateProductType formValue={data} performCancel={performCancel} />}</div>;
};

export default MainProductType; 