import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '@/app/app.css'
import { AppProps } from 'next/app'; // Import AppProps from Next.js
import LeftNavBar from '../components/LeftNavBar'
import 'react-datepicker/dist/react-datepicker.css';

import { config } from 'dotenv';
config();

// Define the App component with TypeScript
const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
    <LeftNavBar/>
      <Component {...pageProps} />
    </>
  );
};

export default App;
