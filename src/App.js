import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";

import ForkChain from './pages/ForkChainMulti';
import Block from './pages/Block';

const Routes = () => {
  let routes = useRoutes([
    { path: "/", element: <ForkChain /> },
    { path: "block/:blockHash", element: <Block /> },
    { path: "*", element: <>Page Not Found</> }
  ]);
  return routes;
};

function App() {
  return (
      <Router>
        <Routes/>
      </Router>
  );
}

export default App;
