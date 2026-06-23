import React from 'react'
import CreateQuotation from './CreateQuotation'
import { useGetQuotationQuery } from '../../../features/allApi';
import LoadingHV from '../../../atoms/loading/LoadingHV';

    const MainQuotation = ({deal_id,getData,performCancel,lead}) => {
        const {
          data: data,
          isLoading: isLoading,
          isFetching: fetch,
          error: error,
        } = useGetQuotationQuery({_id:getData});

        console.log("MainQuotation data", data, getData, deal_id);
      
        return <div>{fetch ? <LoadingHV /> : <CreateQuotation  deal_id={deal_id} lead={lead} formValue={data} performCancel={performCancel}/> }</div>;
      };
      

export default MainQuotation
