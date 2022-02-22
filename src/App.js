import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import React from "react";
import {
  BrowserRouter as Router,
  useRoutes,
} from "react-router-dom";

import ForkChainMulti from './pages/ForkChainMulti';
import ForkChainSingle from './pages/ForkChain'
import Block from './pages/Block';

const Routes = () => {
  let routes = useRoutes([
    { path: "/", element: <ForkChainMulti /> },
    { path: "/:apiKey", element: <ForkChainMulti /> },
    { path: "/:offset/:apiKey", element: <ForkChainMulti /> },
    { path: "block/:blockHash/:apiKey", element: <Block /> },
    { path: "node/:nodeid/:apiKey", element: <ForkChainSingle /> },
    { path: "node/:nodeid/:offset/:apiKey", element: <ForkChainSingle /> },
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
