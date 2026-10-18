import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import {
  CHALLENGE_TYPES,
} from "../api/challenges/challengeTypes";
import { createChallenge } from "../api/challenges/challengeApi";
import { CHALLENGE_IMAGE_BANK, imagesForType } from "../utils";

// Challenge creation. Every challenge carries an image. The admin picks from
// type-matched suggestions, pastes a URL, or uploads a file. The payload uses
// the field names the backend reads first (title/description/imageUrl/unit...),
// and now also sends category, goal, podium and the validation flag.

export default function CreateChallenge() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<keyof typeof CHALLENGE_IMAGE_BANK>("Gym");
  const [unit, setUnit] = useState("");
  const [pointsUnit, setPointsUnit] = useState(0);
  const [goal, setGoal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [challengeDesc, setChallengeDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [venue, setVenue] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [requiresValidation, setRequiresValidation] = useState(true);
  const [podiumFirst, setPodiumFirst] = useState(500);
  const [podiumSecond, setPodiumSecond] = useState(300);
  const [podiumThird, setPodiumThird] = useState(150);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const suggestions = imagesForType(category);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Give the challenge a title.");
    if (!unit.trim()) return setError("Set a unit (e.g. push-ups, laps, km).");
    if (!startDate || !endDate) return setError("Set a start and end date.");

    setBusy(true);
    try {
      await createChallenge({
        title,
        description: challengeDesc,
        imageUrl,
        unit,
        pointsPerUnit: pointsUnit,
        goal,
        category,
        type: category,
        startDate,
        endDate,
        status: "active",
        venue,
        instructorName,
        requiresValidation,
        podium: { first: podiumFirst, second: podiumSecond, third: podiumThird },
      });
      navigate("/app/challenges");
    } catch (err: any) {
      setError(
        (err?.response?.data?.message as string) ||
          (err?.message as string) ||
          "The challenge could not be created.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <div className="titles">
          <span className="eyebrow">Challenges</span>
          <div className="title-row">
            <span className="trident-rule">
              <span />
              <span />
              <span />
            </span>
            <h1 className="page-title">Create challenge</h1>
          </div>
        </div>
      </div>

      <form onSubmit={submit} noValidate>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)",
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <div className="card card-pad form-grid">
              {error && (
                <div className="field-error" role="alert">
                  {error}
                </div>
              )}

              <div className="field">
                <span>Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Push-up Gauntlet"
                />
              </div>

              <div className="grid ">
                <div className="field">
                  <span>Activity type</span>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as keyof typeof CHALLENGE_IMAGE_BANK)
                    }
                  >
                    {CHALLENGE_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid ">
                  <div className="field">
                    <span>Units</span>
                    <input
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="Enter Type of Unit"
                    />
                  </div>
                  <div className="field">
                    <span>Points Per Unit</span>
                    <input
                      type="number"
                      min="1"
                      value={pointsUnit}
                      onChange={(e) => setPointsUnit(+e.target.value)}
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="field">
                  <span>Goal (target units)</span>
                  <input
                    type="number"
                    min="0"
                    value={goal}
                    onChange={(e) => setGoal(+e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div className="field">
                  <span>&nbsp;</span>
                  <div style={{ fontSize: 12, color: "var(--slate)" }}>
                    e.g. 50 push-ups. Used for progress display.
                  </div>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="field">
                  <span>Start date</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="field">
                  <span>End date</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <span>Venue</span>
                <input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="TLC"
                />
              </div>

              <div className="field">
                <span>Instructor Name</span>
                <input
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  placeholder="Instructor Name"
                />
              </div>

              <div className="field">
                <span>Description</span>
                <textarea
                  rows={3}
                  value={challengeDesc}
                  onChange={(e) => setChallengeDesc(e.target.value)}
                  placeholder="What students do, where, and how it is measured."
                />
              </div>

              <div className="grid grid-3">
                <div className="field">
                  <span>Podium · 1st</span>
                  <input
                    type="number"
                    min="0"
                    value={podiumFirst}
                    onChange={(e) => setPodiumFirst(+e.target.value)}
                  />
                </div>
                <div className="field">
                  <span>Podium · 2nd</span>
                  <input
                    type="number"
                    min="0"
                    value={podiumSecond}
                    onChange={(e) => setPodiumSecond(+e.target.value)}
                  />
                </div>
                <div className="field">
                  <span>Podium · 3rd</span>
                  <input
                    type="number"
                    min="0"
                    value={podiumThird}
                    onChange={(e) => setPodiumThird(+e.target.value)}
                  />
                </div>
              </div>

              <label className="check-line">
                <input
                  type="checkbox"
                  checked={requiresValidation}
                  onChange={(e) => setRequiresValidation(e.target.checked)}
                />
                <span>
                  <b>Requires staff validation.</b>{" "}
                  <span style={{ color: "var(--slate)" }}>
                    Students perform the activity in front of TLC staff and log
                    their result. Nothing reaches the leaderboard until an admin
                    approves it in Validations.
                  </span>
                </span>
              </label>
            </div>

            <div className="card card-pad">
              <span className="eyebrow">Challenge image</span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--slate)",
                  margin: "8px 0 14px",
                }}
              >
                Pick a suggestion for {category}, paste a link, or upload your
                own. This image shows on the challenge list and in the app.
              </p>
              <div className="image-suggest-grid">
                {suggestions.map((src) => (
                  <button
                    type="button"
                    key={src}
                    className={`image-suggest${imageUrl === src ? " selected" : ""}`}
                    onClick={() => setImageUrl(src)}
                    aria-label="Use this image"
                  >
                    <img src={src} alt="" loading="lazy" />
                    {imageUrl === src && (
                      <span className="image-check">
                        <Icon name="check" size={14} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="image-tools">
                <div style={{ display: "flex", gap: 4, flex: 1, minWidth: 260 }}>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Paste an image URL"
                    style={{
                      flex: 1,
                      border: "1px solid var(--line-strong)",
                      borderRadius: 8,
                      padding: "9px 11px",
                      fontSize: 13,
                    }}
                  />
                </div>
                <label
                  className="btn btn-ghost btn-sm"
                  style={{ cursor: "pointer" }}
                >
                  Upload file
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => setImageUrl(String(reader.result));
                      reader.readAsDataURL(file);
                    }}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <div className="card preview-card">
              <div
                className="preview-image"
                style={{ backgroundImage: `url(${imageUrl})` }}
              >
                <div className="preview-overlay">
                  <span className="pill pill-navy">{category}</span>
                  <h4>{title || "Challenge title"}</h4>
                </div>
              </div>
              <div className="preview-body">
                <span className="eyebrow">Live preview</span>
                <p style={{ fontSize: 13, color: "var(--slate)", marginTop: 6 }}>
                  {unit && pointsUnit
                    ? `${pointsUnit} points per ${unit}`
                    : "Set a Unit and Points Per Unit"}
                </p>
              </div>
            </div>

            <div className="card card-pad broadcast-note">
              <Icon
                name="bell"
                style={{
                  color: "var(--gold-deep)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div style={{ fontSize: 13, color: "var(--slate)" }}>
                Publishing broadcasts the challenge to every LancerFit user in
                real time.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="submit"
                className="btn btn-gold"
                disabled={busy}
                style={{ flex: 1 }}
              >
                {busy ? "Publishing" : "Publish challenge"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate("/app/challenges")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}