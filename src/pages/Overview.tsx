import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getActiveChallenges,
  getPendingChallenges,
} from "../api/challenges/challengeApi";
import Icon from "../components/Icon";
import { getAllQuests } from "../api/quest/questApi";
import { getAllActivities } from "../api/activities/activityApi";

type OverviewStats = {
  active: number;
  pending: number;
  bank: number;
  activities: number;
};

export default function Overview() {
  //   const toast = useToast();
  const [stats, setStats] = useState<OverviewStats>({
    active: 0,
    pending: 0,
    bank: 0,
    activities: 0,
  });
  const [weekly, setWeekly] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const active = await getActiveChallenges();
        const allActivities = await getAllActivities();
        const pending = await getPendingChallenges();
        const quests = await getAllQuests()

        // const [active, pending, quests, allActivities] = await Promise.all([
        //   getActiveChallenges(),
        //   getPendingChallenges(),
        //   getAllQuests(),
        //   getAllActivities(),
        // ]);
        // week is the weekly leaderboard
        setStats({
          active: active.length,
          pending: pending.length,
          bank: quests.length,
          activities: allActivities.length,
        });
        // setWeekly(week);
        setNotifications([]);
      } catch (err) {
        // toast.error(err.message || "Could not load the overview.");
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="page-head">
        <div className="titles">
          <span className="eyebrow">Toldo Lancer Centre</span>
          <div className="title-row">
            <span className="trident-rule">
              <span />
              <span />
              <span />
            </span>
            <h1 className="page-title">Overview</h1>
          </div>
        </div>
        <Link to="/app/challenges/new" className="btn btn-gold">
          <Icon name="plus" size={15} /> New challenge
        </Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <StatCard
          label="Active challenges"
          value={stats?.active}
          note="Live for students right now"
        />
        <StatCard
          label="Pending validations"
          value={stats?.pending}
          note="Waiting on staff review"
          link="/app/validations"
        />
        <StatCard
          label="Quests in bank"
          value={stats?.bank}
          note="3 rotate to students daily"
          link="/app/quests"
        />
        <StatCard
          label="Loggable activities"
          value={stats?.activities}
          note="Across all facility areas"
          link="/app/activities"
        />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Weekly XP leaders</h3>
            {/* <span className="eyebrow">Week of {weekly?.weekOf || ""}</span> */}
          </div>
          {!weekly ? (
            <LoadingRows />
          ) : (
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th style={{ textAlign: "right" }}>XP</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {weekly.entries.slice(0, 6).map((e) => (
                    <tr key={e.rank}>
                      <td className="num">{e.rank}</td>
                      <td><StudentIdentity student={e.student} size={32} showFaculty={false} /></td>
                      <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>{e.xp}</td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Recent broadcasts</h3>
            <Icon name="bell" style={{ color: "var(--slate)" }} />
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  note,
  link,
}: {
  label: string;
  value: number;
  note: string;
  link?: string;
}) {
  const body = (
    <div className="card stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value ?? (
          <span
            className="skeleton"
            style={{ width: 40, display: "inline-block" }}
          />
        )}
      </div>
      <div className="stat-note">{note}</div>
    </div>
  );
  return link ? (
    <Link to={link} style={{ textDecoration: "none", color: "inherit" }}>
      {body}
    </Link>
  ) : (
    body
  );
}

function LoadingRows() {
  return (
    <div style={{ padding: 24, display: "grid", gap: 14 }}>
      <div className="skeleton" />
      <div className="skeleton" style={{ width: "80%" }} />
      <div className="skeleton" style={{ width: "90%" }} />
    </div>
  );
}
