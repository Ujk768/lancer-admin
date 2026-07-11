import KnightAvatar from "./KnightAvatar";
import { Flag, FacultyCrest, FACULTIES, type FacultyKey } from "./Glyphs";

// Renders a student's identity the way they appear in the app: knight avatar
// (helmet variant + faculty-tinted plume), name, country flag, and faculty
// crest. Used across the leaderboard and validation screens so the same
// person is instantly recognisable.
type Student = {
  name: string;
  avatar?: number;
  faculty: FacultyKey;
  flag?: string;
};


export default function StudentIdentity({ student, size = 40, showFaculty = true }: { student: Student; size?: number; showFaculty?: boolean }) {
  const faculty = FACULTIES[student.faculty] || FACULTIES.cs;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      <KnightAvatar variant={student.avatar ?? 0} plume={faculty.color} size={size} />
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <b style={{ color: "var(--navy-800)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {student.name}
          </b>
          {student.flag && <Flag code={student.flag} width={18} />}
        </div>
        {showFaculty && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <FacultyCrest id={faculty.crest} color={faculty.color} size={14} />
            <span style={{ fontSize: 12, color: "var(--slate)" }}>{faculty.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
