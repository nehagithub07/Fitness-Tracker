import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { useState } from "react";

const Card = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 24px;
  border: 1px solid ${({ theme }) => `rgba(${theme.text_primary}, 0.2)`};
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => `rgba(${theme.primary}, 0.15)`};
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const AddWorkout = ({ workout, setWorkout, addNewWorkout, buttonLoading }) => {
  // The "Remove Workout" button in this component is meant to clear the input field,
  // not to remove an existing workout from the database.
  // If you want to keep this functionality, leave it as is.
  
  // If you want to select and remove a workout from the database,
  // you would need to add state for workout selection and call the API.
  
  const clearWorkoutInput = () => {
    setWorkout("");
  };

  return (
    <Card>
      <Title>Manage Workout</Title>
      <TextInput
        label="Workout"
        textArea
        rows={10}
        placeholder={`Enter in this format:

#Category
-Workout Name
-Sets
-Reps
-Weight
-Duration`}
        value={workout}
        handleChange={(e) => setWorkout(e.target.value)}
      />
      <div style={{ display: "flex", gap: "8px" }}>
        <Button
          text="Add Workout"
          small
          onClick={addNewWorkout}
          isLoading={buttonLoading}
          isDisabled={buttonLoading}
        />
        <Button
          text="Clear Input"
          small
          onClick={clearWorkoutInput}
          isDisabled={buttonLoading}
        />
      </div>
    </Card>
  );
};

export default AddWorkout;