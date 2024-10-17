// LoginLayout.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const Layout = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #3f0a40, #440065, #6b21a8);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const FloatingShape = styled.div`
  position: absolute;
  background-color: ${({ color }) => color};
  width: ${({ size }) => size.split(' ')[0]};
  height: ${({ size }) => size.split(' ')[1]};
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  border-radius: 50%;
  animation: ${floatAnimation} 5s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

const LoginLayout = ({ children }) => {
  return (
    <Layout>
      {children}
      <FloatingShape color="#3f0a40" size="16rem 16rem" top="-5%" left="10%" delay={0} />
      <FloatingShape color="#440065" size="12rem 12rem" top="70%" left="80%" delay={5} />
      <FloatingShape color="#6b21a8" size="8rem 8rem" top="40%" left="-10%" delay={2} />
    </Layout>
  );
};

export default LoginLayout;
