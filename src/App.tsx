// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import { ProtectedRoute } from "./components/ProtectedRoute";
// import Login from "./pages/Login";
// import Overview from "./pages/Overview";
// import SideBar from "./components/SideBar";
// import { useEffect, useState } from "react";
// import { getPendingChallenges } from "./api/challenges/challengeApi";
// import Challenges from "./pages/Challenges";
// import CreateChallenge from "./pages/CreateChallenge";
// import ChallengeDetail from "./pages/ChallengeDetail";
// import Quests from "./pages/Quests";

// function App() {
//   const [pendingCount, setpendingCount] = useState(0);

//   useEffect(() => {
//     getPendingChallenges().then((pendingChallenges) => {
//       setpendingCount(pendingChallenges.length);
//     });
//   }, []);

//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <div className="shell">
//           <SideBar
//             pendingCount={pendingCount}
//             onSignOut={() => console.log("sign out function")}
//           />
//           <main className="main">
//             <Routes>
//               <Route path="/login" element={<Login />} />
//               {/* <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} /> */}

//               {/* everything below requires auth */}
//               <Route element={<ProtectedRoute />}>
//                 <Route path="/app" element={<Overview />} />
//                 <Route path="/app/challenges" element={<Challenges />} />
//                 <Route
//                   path="/app/challenges/new"
//                   element={<CreateChallenge />}
//                 />
//                 <Route path="/app/challenge/:id" element={<ChallengeDetail />}/>
//                 <Route path="/app/quests" element={<Quests />} />
//               </Route>
//             </Routes>
//           </main>
//         </div>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import { getPendingApprovals } from "./api/challenges/challengeApi";
import Challenges from "./pages/Challenges";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeDetail from "./pages/ChallengeDetail";
import Validations from "./pages/Validations";
import Leaderboards from "./pages/Leaderboards";
import Quests from "./pages/Quests";
import { connectSocket, disconnectSocket, getSocket } from "./api/socket";

// The authenticated shell: sidebar + the socket connection + the pending-count
// badge. All of this only mounts once the user is logged in, so no API call
// fires before there's a token (the old code called the API on first paint,
// which 401'd against the login screen).
function AdminLayout() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  const refreshPending = () =>
    getPendingApprovals()
      .then((p) => setPendingCount(p.length))
      .catch(() => setPendingCount(0));

  useEffect(() => {
    if (!user) return;
    connectSocket();
    refreshPending();
    const socket = getSocket();
    const onChange = () => refreshPending();
    socket?.on("validation:submitted", onChange);
    socket?.on("validation:resolved", onChange);
    return () => {
      socket?.off("validation:submitted", onChange);
      socket?.off("validation:resolved", onChange);
    };
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleSignOut = async () => {
    await logout();
    disconnectSocket();
    navigate("/login");
  };

  return (
    <div className="shell">
      <SideBar pendingCount={pendingCount} onSignOut={handleSignOut} />
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Everything below requires auth and shares the sidebar shell. */}
          <Route element={<AdminLayout />}>
            <Route path="/app" element={<Overview />} />
            <Route path="/app/challenges" element={<Challenges />} />
            <Route path="/app/challenges/new" element={<CreateChallenge />} />
            <Route path="/app/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/app/validations" element={<Validations />} />
            <Route path="/app/leaderboards" element={<Leaderboards />} />
            <Route path="/app/quests" element={<Quests />} />
          </Route>

          <Route path="*" element={<Navigate to="/app" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;