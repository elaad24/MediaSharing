import { Route, Routes } from "react-router";
import Container from "./components/common/Container";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/SignUp";
import RequireAuth from "./RequireAuth";
import Songs from "./pages/songs/Songs";

function App() {
  return (
    <Routes>
      <Route element={<RequireAuth />}>
        <Route
          path="/songsClose"
          element={<Container ChildComponent={Songs} />}
        ></Route>
      </Route>
      <Route path="songs" element={<Songs />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
    </Routes>
  );
}
{
  /*  */
}

export default App;
