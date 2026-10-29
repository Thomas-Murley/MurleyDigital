"use client";

import { useEffect, useState } from "react";

export function CookieNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(window.localStorage.getItem("murley-cookie") !== "1");
  }, []);
  if (!show) return null;
  return (
    <div className="cookie" role="dialog" aria-label="Cookie notice">
      <p>
        One essential cookie keeps you signed in. No advertising trackers. <a href="/privacy">Privacy</a>
      </p>
      <button
        className="btn btn-small"
        type="button"
        onClick={() => {
          window.localStorage.setItem("murley-cookie", "1");
          setShow(false);
        }}
      >
        Okay
      </button>
    </div>
  );
}
