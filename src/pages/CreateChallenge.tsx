import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { createChallenge } from "../api/client";
// import { CHALLENGE_TYPES } from "../data/challenges";
// import { imagesForType } from "../data/challengeImages";
// import { APP_CONFIG } from "../data/config";
// import { seasonOf } from "../api/seasons";
// import { useToast } from "../components/Toast";
import Icon from "../components/Icon";
import {
  CHALLENGE_TYPES,
  type CreateChallengePayload,
} from "../api/challenges/challengeTypes";
import { createChallenge } from "../api/challenges/challengeApi";
import {
  CHALLENGE_IMAGE_BANK,
  imagesForType,
} from "../utils";

// Challenge creation. Every challenge carries an image. The admin picks from
// type-matched suggestions, pastes a URL, or uploads a file. Podium points are
// pre-filled and editable. Publishing broadcasts a push notification to all
// users, confirmed in the success toast.

export default function CreateChallenge() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateChallengePayload>();
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<keyof typeof CHALLENGE_IMAGE_BANK>("Gym");
  const [unit, setUnit] = useState("");
  const [pointsUnit, setPointsUnit] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [challengeDesc, setChallengeDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [venue,setVenue] = useState("")
  const [instructorName,setInstructorName] = useState("")
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const suggestions = imagesForType(category);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const create = await createChallenge({
        challengeName: title,
        challengeDescription: challengeDesc,
        challengeImage: imageUrl,
        challengeUnit: unit,
        pointsPerUnit: pointsUnit,
        startDate: startDate,
        endDate: endDate,
        status: "active",
        venue: venue,
        instructorName: instructorName
      });
      navigate("/app/challenges");
      //   toast.success(`${notification.message}. Push notification sent to all users.`, "Challenge published");
    } catch (err) {
      setError(
        (err.message as string) || "The challenge could not be created.",
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
                    onChange={(e) => setCategory(e.target.value)}
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

              {/* {season && (
                <div style={{ fontSize: 13, color: "var(--slate)" }}>
                  Filed under <span className="pill pill-gold">{season}</span> based on the start date.
                </div>
              )} */}

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

              {/* <label className="check-line">
                <input
                  type="checkbox"
                  checked={form.requiresValidation}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      requiresValidation: e.target.checked,
                    }))
                  }
                />
                <span>
                  <b>Requires staff validation.</b>{" "}
                  <span style={{ color: "var(--slate)" }}>
                    Students perform the activity in front of TLC staff and log
                    their result. Nothing reaches the leaderboard until an admin
                    approves it in Validations.
                  </span>
                </span>
              </label> */}
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
                <div
                  style={{ display: "flex", gap: 4, flex: 1, minWidth: 260 }}
                >
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
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      console.log("linked");
                    }}
                  >
                    Link
                  </button>
                </div>
                <label
                  className="btn btn-ghost btn-sm"
                  style={{ cursor: "pointer" }}
                >
                  Upload file
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => console.log("file upload")}
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
                <p
                  style={{ fontSize: 13, color: "var(--slate)", marginTop: 6 }}
                >
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
                Publishing sends a push notification to every LancerFit user.
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
