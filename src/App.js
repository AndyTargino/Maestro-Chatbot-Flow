import React, { useState, useCallback, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatBotFlow from './ChatBotFlow';

const App = () => {
  return (
    <>
      <ChatBotFlow />
      <ToastContainer />
    </>
  );
}

export default App;