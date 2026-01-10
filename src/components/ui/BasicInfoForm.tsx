import React from "react";
import { Button } from "./button";

type BasicInfoProps = {
  setCurrentStep: any;
};

const BasicInfoForm = ({ setCurrentStep }: BasicInfoProps) => {
  return (
    <div>
      <Button
        onClick={() => {
          setCurrentStep((prevCurrent: number) => prevCurrent + 1);
        }}
      >
        Next section
      </Button>
    </div>
  );
};

export default BasicInfoForm;
