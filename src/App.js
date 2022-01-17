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
    { path: "/:offset", element: <ForkChainMulti /> },
    { path: "block/:blockHash", element: <Block /> },
    { path: "node/:nodeid", element: <ForkChainSingle /> },
    { path: "node/:nodeid/:offset", element: <ForkChainSingle /> },
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
