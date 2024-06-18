import { Route, Routes } from "react-router";
import Container from "./components/common/Container";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/SignUp";
import RequireAuth from "./RequireAuth";

function App() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Container ChildComponent={Login} />}></Route>
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
}
{
  /*  */
}

export default App;
