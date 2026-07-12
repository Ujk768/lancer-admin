// import KnightAvatar from "./KnightAvatar";
// import { Flag, FACULTIES, type FacultyKey } from "./Glyphs";

// // Shared leaderboard rendering used by the Leaderboards page and each
// // challenge detail. Combines a raised podium for the top three with a ranked
// // list below. Medal accents and faculty-tinted rank chips give it life beyond
// // a plain table.

// const MEDAL = {
//   1: { ring: "#E9C45A", chip: "linear-gradient(135deg, #F0CF6E, #CFA63B)", label: "1st" },
//   2: { ring: "#C4CCDA", chip: "linear-gradient(135deg, #D9DFE9, #B4BECE)", label: "2nd" },
//   3: { ring: "#D3A878", chip: "linear-gradient(135deg, #E0BB8C, #C08E5C)", label: "3rd" },
// };

// function facultyOf(student: FacultyKey) {
//   return FACULTIES[student] || FACULTIES.cs;
// }

// type Entries ={first: string, second: string, third:string}

// export function LeaderboardPodium( entries :Entries) {
//   return (
//     <div className="lb-podium">
//       <PodiumColumn entry={entries.second} place={2} />
//       <PodiumColumn entry={entries.first} place={1} />
//       <PodiumColumn entry={entries.third} place={3} />
//     </div>
//   );
// }

// function PodiumColumn({ entry, place }:) {
//   if (!entry) return <div className="lb-col empty" />;
//   const f = facultyOf(entry.student);
//   const medal = MEDAL[place];
//   return (
//     <div className={`lb-col p${place}`}>
//       <div className="lb-avatar-wrap" style={{ boxShadow: `0 0 0 3px ${medal.ring}` }}>
//         <KnightAvatar variant={entry.student.avatar ?? 0} plume={f.color} size={place === 1 ? 66 : 52} />
//         <span className="lb-medal" style={{ background: medal.chip }}>{place}</span>
//       </div>
//       <div className="lb-col-name">
//         {entry.student.name}
//         {entry.student.flag && <Flag code={entry.student.flag} width={16} />}
//       </div>
//       <div className="lb-col-result">{entry.result}</div>
//       {entry.xpAwarded > 0 && <div className="lb-col-xp mono">+{entry.xpAwarded} XP</div>}
//       <div className="lb-plinth" style={{ background: medal.chip }}>
//         <span>{medal.label}</span>
//       </div>
//     </div>
//   );
// }

// export function LeaderboardList({ entries, showXp = true }) {
//   return (
//     <div className="lb-list">
//       {entries.map((e) => {
//         const f = facultyOf(e.student);
//         const medal = MEDAL[e.rank];
//         return (
//           <div className={`lb-row${e.rank <= 3 ? " top" : ""}`} key={e.rank}>
//             <div className="lb-rank" style={medal ? { background: medal.chip, color: "#1a1205" } : undefined}>
//               {e.rank}
//             </div>
//             <div className="lb-id">
//               <KnightAvatar variant={e.student.avatar ?? 0} plume={f.color} size={38} />
//               <div>
//                 <div className="lb-id-name">
//                   {e.student.name}
//                   {e.student.flag && <Flag code={e.student.flag} width={16} />}
//                 </div>
//                 <div className="lb-id-fac" style={{ color: f.color }}>{f.label}</div>
//               </div>
//             </div>
//             <div className="lb-result mono">{e.result}</div>
//             {showXp && (
//               <div className="lb-xp mono">{e.xpAwarded > 0 ? `+${e.xpAwarded}` : "—"}</div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
