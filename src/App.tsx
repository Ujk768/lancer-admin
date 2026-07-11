import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import { getPendingChallenges } from "./api/challenges/challengeApi";
import Challenges from "./pages/Challenges";
import CreateChallenge from "./pages/CreateChallenge";

function App() {
  const [pendingCount, setpendingCount] = useState(0);

  useEffect(() => {
    getPendingChallenges().then((pendingChallenges) => {
      setpendingCount(pendingChallenges.length);
    });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="shell">
          <SideBar
            pendingCount={pendingCount}
            onSignOut={() => console.log("sign out function")}
          />
          <main className="main">
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> */}

              {/* everything below requires auth */}
              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<Overview />} />
                <Route path="/app/challenges" element={<Challenges />} />
                <Route
                  path="/app/challenges/new"
                  element={<CreateChallenge />}
                />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
