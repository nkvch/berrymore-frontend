import styled from "@emotion/styled";
import PhoneInput from "react-phone-input-2";

export const VerticalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

export const PhoneField = styled(PhoneInput)`
  input.form-control  {
    width: 100%;
  }
`;
