import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddComplaint from "./pages/AddComplaint";
import ComplaintList from "./pages/ComplaintList";
import UpdateStatus from "./pages/UpdateStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/add-complaint" element={<AddComplaint />} />

        <Route path="/complaints" element={<ComplaintList />} />

        <Route path="/update/:id" element={<UpdateStatus />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;