import React from "react";
import styled from "styled-components";
import { BaseProps } from "../../interfaces/common";

export interface BoxProps extends BaseProps {
  style?: object;
  padding?: string;
}

export const ContentBox = ({ children, style, className, padding }: BoxProps) => {
  return (
    <StyledBox style={style} className={className} padding={padding}>
      {children}
    </StyledBox>
  );
};

const StyledBox = styled.div<{ padding?: string }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  border-radius: 6px;
  border: 1px solid #4f5178;
  background: #2e304b;
  font-size: 12px;
  padding: ${(p) => p.padding ?? "20px 30px"};
`;
