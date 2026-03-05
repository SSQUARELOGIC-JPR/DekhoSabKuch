import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Users from "../pages/Users/Users";
import Providers from "../pages/Providers/Providers";
import Categories from "../pages/Categories/Categories";
import Cities from "../pages/Cities/Cities";
import Complaints from "../pages/Complaints/Complaints";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/complaints" element={<Complaints />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;