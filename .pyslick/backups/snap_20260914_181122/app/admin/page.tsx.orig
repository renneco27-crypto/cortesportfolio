"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle, Key } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        setErrorMsg("Please select a valid PDF file.");
        setStatus("error");
        setFile(null);
        return;
      }
      setFile(selected);
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Please enter the admin password.");
      setStatus("error");
      return;
    }
    if (!file) {
      setErrorMsg("Please select a PDF file to upload.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("file", file);

      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data.success && data.url) {
        setUploadedUrl(data.url);
        setStatus("success");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0f",
        color: "#f8fafc",
        fontFamily: "var(--font-inter), sans-serif",
        padding: "1.5rem",
      }}
    >
      {/* Background Grid accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "linear-gradient(to bottom, rgba(124, 58, 237, 0.04) 1px, transparent 1px), linear-gradient(to right, rgba(124, 58, 237, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "480px",
          background: "rgba(18, 18, 24, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 50px rgba(124, 58, 237, 0.05)",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.85rem",
              color: "var(--zinc-400)",
              transition: "color 0.2s",
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              fontFamily: "var(--font-space)",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #fff 0%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.5rem",
            }}
          >
            Resume Portal
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--zinc-400)" }}>
            Upload your latest resume PDF to sync across your portfolio.
          </p>
        </div>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(52, 211, 153, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem auto",
                color: "#34d399",
                border: "1px solid rgba(52, 211, 153, 0.3)",
              }}
            >
              <CheckCircle size={32} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Upload Successful!
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--zinc-400)", marginBottom: "1.5rem" }}>
              Your new resume has been uploaded to Supabase Storage and updated in the database.
            </p>
            <div style={{ marginBottom: "1.5rem" }}>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  padding: "0.6rem 1.2rem",
                  background: "rgba(124, 58, 237, 0.15)",
                  color: "#c4b5fd",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                View Live PDF
              </a>
            </div>
            <button
              onClick={() => {
                setStatus("idle");
                setFile(null);
              }}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "transparent",
                color: "var(--zinc-400)",
                border: "1px solid var(--zinc-800)",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              Upload Another File
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Password input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--zinc-300)", fontWeight: 500 }}>
                Admin Password
              </label>
              <div style={{ position: "relative" }}>
                <Key
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--zinc-500)",
                  }}
                />
                <input
                  type="password"
                  placeholder="Enter secret key..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 1rem 0.65rem 2.25rem",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* File picker */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--zinc-300)", fontWeight: 500 }}>
                Select Resume (PDF)
              </label>
              <div
                style={{
                  position: "relative",
                  border: "2px dashed rgba(124, 58, 237, 0.3)",
                  borderRadius: "10px",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(124, 58, 237, 0.02)",
                  transition: "all 0.2s",
                }}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  {file ? (
                    <>
                      <FileText size={32} style={{ color: "#c4b5fd" }} />
                      <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "#e4e4e7" }}>
                        {file.name}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--zinc-500)" }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload size={32} style={{ color: "var(--zinc-500)" }} />
                      <span style={{ fontSize: "0.9rem", color: "var(--zinc-400)" }}>
                        Drag & drop or click to choose PDF
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--zinc-600)" }}>
                        Max file size: 5MB
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {status === "error" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1rem",
                  background: "rgba(248, 113, 113, 0.1)",
                  color: "#f87171",
                  border: "1px solid rgba(248, 113, 113, 0.2)",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                }}
              >
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: status === "loading" ? "var(--zinc-800)" : "var(--violet-600)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: status === "loading" ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                transition: "background 0.2s, transform 0.1s",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {status === "loading" ? "Uploading to Supabase..." : "Upload Resume"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
