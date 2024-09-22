import { Route, createRoutesFromElements } from "react-router-dom";
import Layout from "./Layout";

// Pages imports
import Home from "./pages/Home";
import ChatBot from "./pages/ChatBot";

const Routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>

    {/* Routes for different pages */}
    <Route
      path=""
      element={
       <Home />
      }
    />
    <Route
      path="/chat/:fileId"
      element={
        <ChatBot />
      }
    />
    

    {/* Add other pages below */}

  </Route>
);

export default Routes;
