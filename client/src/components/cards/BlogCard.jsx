import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background-color: ${({ theme }) => theme.bg_secondary};
  color: ${({ theme }) => theme.text_primary};
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin: 0;
`;

const ReadMore = styled.a`
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-weight: 500;
  align-self: flex-start;

  &:hover {
    text-decoration: underline;
  }
`;

const BlogCard = ({ blog }) => {
  return (
    <Card>
      <Title>{blog.title}</Title>
      <Description>{blog.description}</Description>
      <ReadMore href={blog.link} target="_blank" rel="noopener noreferrer">
        Read More →
      </ReadMore>
    </Card>
  );
};

export default BlogCard;
