import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts, deleteWorkout } from "../api";
import { CircularProgress } from "@mui/material";

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
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
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

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState("#Legs\n-Back Squat\n-5 setsX15 reps\n-30 kg\n-10 min");

  const dashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const res = await getDashboardDetails(token);
      setData(res?.data || {});
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
    setLoading(false);
  };

  const getTodaysWorkout = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      const res = await getWorkouts(token, "");
      setTodaysWorkouts(res?.data?.todaysWorkouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
    setLoading(false);
  };

  const addNewWorkout = async () => {
    setButtonLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    try {
      await addWorkout(token, { workoutString: workout });
      await dashboardData();
      await getTodaysWorkout();
    } catch (err) {
      alert("Error adding workout:", err);
    }
    setButtonLoading(false);
  };

  
  const removeWorkout = async (workoutId) => {
    const token = localStorage.getItem("fittrack-app-token") || "";
    if (!token) {
      console.error("No token found!");
      return;
    }
    
    try {
      await deleteWorkout(token, workoutId);
      await getTodaysWorkout(); // Fetch the latest workouts from the API
      await dashboardData();    // Refresh the dashboard data
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };
  

  useEffect(() => {
    dashboardData();
    getTodaysWorkout();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <FlexWrap>
              {counts.map((item, index) => (
                <CountsCard key={index} item={item} data={data} />
              ))}
            </FlexWrap>

            <FlexWrap>
              <WeeklyStatCard data={data} />
              <CategoryChart data={data} />
              <AddWorkout
                workout={workout}
                setWorkout={setWorkout}
                addNewWorkout={addNewWorkout}
                buttonLoading={buttonLoading}
              />
            </FlexWrap>

            <Section>
  <Title>Today's Workouts</Title>
  <CardWrapper>
    {todaysWorkouts.map((workout, index) => (
      <WorkoutCard 
      key={index} 
      workout={workout} 
      onRemove={() => removeWorkout(workout._id)} 
    />
    ))}
  </CardWrapper>
</Section>
  
          </>
        )}
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
