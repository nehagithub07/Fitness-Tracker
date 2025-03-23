import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { getWorkouts, deleteWorkout } from "../api";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1600px;
  display: flex;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 0.2;
  height: fit-content;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme?.text_primary + "20" || "#ccc"}; 
  border-radius: 14px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme?.primary + "15" || "#ddd"};
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme?.primary || "#000"};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Right = styled.div`
  flex: 1;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 100px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const SecTitle = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme?.text_primary || "#333"};
  font-weight: 500;
`;

const Workouts = () => {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(dayjs().format("MM/DD/YYYY"));

  const getTodaysWorkout = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token") || "";
    if (!token) {
      console.error("No token found!");
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    try {
      const res = await getWorkouts(token, date ? `?date=${date}` : "", {
        signal: abortController.signal,
      });
      setTodaysWorkouts(res?.data?.todaysWorkouts || []);
      console.log(res.data);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching workouts:", error);
      }
    } finally {
      setLoading(false);
    }

    return () => abortController.abort();
  }, [date]);

  useEffect(() => {
    getTodaysWorkout();
  }, [getTodaysWorkout]);

 
  const removeWorkout = async (workoutId) => {
    const token = localStorage.getItem("fittrack-app-token") || "";
    if (!token) {
      console.error("No token found!");
      return;
    }
    
    try {
      console.log("Attempting to delete workout:", workoutId);
      const response = await deleteWorkout(token, workoutId);
      console.log("Delete response:", response);
      
      setTodaysWorkouts((prevWorkouts) => 
        prevWorkouts.filter((workout) => workout._id !== workoutId)
      );
    } catch (error) {
      console.error("Error deleting workout:", error.response?.data || error.message || error);
    }
  };
  return (
    <Container>
      <Wrapper>
        <Left>
          <Title>Select Date</Title>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={date ? dayjs(date) : null}
              onChange={(newDate) =>
                newDate && setDate(dayjs(newDate).format("MM/DD/YYYY"))
              }
            />
          </LocalizationProvider>
        </Left>
        <Right>
          <Section>
            <SecTitle>Today's Workout</SecTitle>
            {loading ? (
              <CircularProgress />
            ) : (
              <CardWrapper>
                {todaysWorkouts.length > 0 ? (
                  todaysWorkouts.map((workout, index) => (
                    <WorkoutCard 
  key={index} 
  workout={workout} 
  onRemove={() => {
    console.log("Removing workout:", workout);
    removeWorkout(workout._id);
  }} 
/>
                  ))
                ) : (
                  <p>No workouts found for this date.</p>
                )}
              </CardWrapper>
            )}
          </Section>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Workouts;