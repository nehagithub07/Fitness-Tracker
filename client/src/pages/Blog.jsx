import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getBlogs } from "../api";
import BlogCard from "../components/cards/BlogCard";
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

const Blog = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await getBlogs();
        setBlogs(response.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
      setLoading(false);
    };

    fetchBlogs("https://www.glofox.com/blog/fitness-blogs/");
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>Latest Blogs</Title>
        {loading ? (
          <CircularProgress />
        ) : (
          <CardWrapper>
            {blogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </CardWrapper>
        )}
      </Wrapper>
    </Container>
  );
};

export default Blog;
