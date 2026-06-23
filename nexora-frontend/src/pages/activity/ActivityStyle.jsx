// ActivityStyle.js
import styled from 'styled-components';

export const ActivityContainer = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 20px;
    /* margin-left: 20px; */
`;

export const ActivityItem = styled.div`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 2rem;
`;

export const ActivityContent = styled.div`
    /* background: #f9f9f9;
    padding: 10px 15px;
    border-radius: 5px;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1); */
`;

export const ActivityHeader = styled.div`
    font-size: 16px;
    margin-bottom: 5px;
`;

export const ChangesList = styled.ul`
    list-style-type: none;
    padding-left: 0;
`;

export const ChangeItem = styled.li`
    margin-bottom: 3px;
    font-size: 14px;
`;

export const RelatedInfo = styled.div`
    /* margin-top: 5px;
    font-size: 14px;
    color: #555; */
`;

export const UserInfo = styled.div`
    /* font-size: 14px;
    color: #777;
    margin-bottom: 5px; */
`;
