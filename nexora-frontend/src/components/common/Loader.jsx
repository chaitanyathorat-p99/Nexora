import React from "react";
import { Circles } from "react-loader-spinner";
import styled from "styled-components";

function Loader(props) {
  return (
    <Style>
      <Circles
        strokeColor="white"
        strokeWidth="5"
        color="white"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </Style>
  );
}

const Style = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Loader;