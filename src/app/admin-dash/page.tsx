'use client';
import React, { useMemo, useState } from "react";
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import Particles from "@/components/Particles";

type Hackathon = {
  id: string;
  name: string;
  startDate: string; // ISO-ish date
  endDate: string;
  status: "upcoming" | "running" | "ended";
  testHack: boolean;
  tags?: string[];
};

type Submission = {
  id: string;
  hackathonId: string;
  projectName: string;
  repoUrl: string;
  submitter: string;
  score: number | null;
  status: "pending" | "scored" | "approved" | "rejected";
  flags: string[];
  minted?: boolean;
  createdAt: string; // ISO
};

const MOCK_HACKATHONS: Hackathon[] = [
  {
    id: "h1",
    name: "Hackonomics 2026",
    startDate: "2026-02-10",
    endDate: "2026-02-14",
    status: "upcoming",
    testHack: false,
    tags: ["web3", "finance"],
  },
  {
    id: "h2",
    name: "Deverify Internal Test",
    startDate: "2025-10-01",
    endDate: "2025-10-02",
    status: "ended",
    testHack: true,
    tags: ["test"],
  },
  {
    id: "h3",
    name: "NFT Jam (Alfajores)",
    startDate: "2025-11-05",
    endDate: "2025-11-07",
    status: "running",
    testHack: false,
    tags: ["nft"],
  },
  {
    id: "h4",
    name: "Quick Test Hack",
    startDate: "2025-09-25",
    endDate: "2025-09-26",
    status: "ended",
    testHack: true,
  },
  {
    id: "h5",
    name: "Campus Hack 2026",
    startDate: "2026-03-20",
    endDate: "2026-03-22",
    status: "upcoming",
    testHack: false,
  },
];

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "s1",
    hackathonId: "h1",
    projectName: "Phoenix",
    repoUrl: "https://github.com/owner/phoenix",
    submitter: "alice@example.com",
    score: 8.7,
    status: "scored",
    flags: [],
    minted: false,
    createdAt: "2025-10-20T10:00:00Z",
  },
  {
    id: "s2",
    hackathonId: "h1",
    projectName: "Deverify UI",
    repoUrl: "https://github.com/owner/deverify-ui",
    submitter: "bob@example.com",
    score: 6.1,
    status: "scored",
    flags: ["thin-readme"],
    minted: false,
    createdAt: "2025-10-21T11:00:00Z",
  },
  {
    id: "s3",
    hackathonId: "h2",
    projectName: "Test Project A",
    repoUrl: "https://github.com/test/a",
    submitter: "qa@example.com",
    score: 9.0,
    status: "approved",
    flags: [],
    minted: true,
    createdAt: "2025-09-30T12:00:00Z",
  },
  {
    id: "s4",
    hackathonId: "h3",
    projectName: "NFTify",
    repoUrl: "https://github.com/owner/nftify",
    submitter: "carol@example.com",
    score: null,
    status: "pending",
    flags: [],
    minted: false,
    createdAt: "2025-10-22T09:00:00Z",
  },
  {
    id: "s5",
    hackathonId: "h4",
    projectName: "Quick Demo",
    repoUrl: "https://github.com/test/quick",
    submitter: "dev@example.com",
    score: 3.2,
    status: "scored",
    flags: ["secrets-detected"],
    minted: false,
    createdAt: "2025-09-25T08:00:00Z",
  },
];

export default function AdminDashboardPage() {
  const navMenuRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.85]);
  
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBlack, setCursorBlack] = useState(false);
  const [cursorExpand, setCursorExpand] = useState(true);

  useEffect(() => {
    let animationFrameId: number;
    let mouseX = cursor.x;
    let mouseY = cursor.y;

    const updateCursor = () => {
      setCursor({ x: mouseX, y: mouseY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          updateCursor();
          animationFrameId = 0;
        });
      }
    };

    const handleMouseDown = () => setCursorExpand(false);
    const handleMouseUp = () => setCursorExpand(true);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    document.body.style.cursor = 'none';
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = '';
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
    
  }, []);

  const [hackathons] = useState<Hackathon[]>(MOCK_HACKATHONS);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [hackSearch, setHackSearch] = useState("");
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | "all">("all");
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const filteredHacks = useMemo(
    () =>
      hackathons.filter((h) => {
        if (!hackSearch) return true;
        const q = hackSearch.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          (h.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      }),
    [hackathons, hackSearch]
  );

  const filteredSubmissions = useMemo(
    () =>
      submissions.filter((s) => {
        if (selectedHackathonId !== "all" && s.hackathonId !== selectedHackathonId) return false;
        if (!submissionSearch) return true;
        const q = submissionSearch.toLowerCase();
        return (
          s.projectName.toLowerCase().includes(q) ||
          s.repoUrl.toLowerCase().includes(q) ||
          s.submitter.toLowerCase().includes(q)
        );
      }),
    [submissions, selectedHackathonId, submissionSearch]
  );

  // Actions (mock)
  function approveSubmission(id: string) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)));
  }
  function rejectSubmission(id: string) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s)));
  }
  function reverifySubmission(id: string) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "pending" } : s)));
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "scored", score: Math.round(((s.score ?? 5) + Math.random() * 3) / 0.1) * 0.1 } : s
        )
      );
    }, 1200);
  }

  return (
    <>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          background: 'black',
          zIndex: 0,
          
        }}
      >
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className="text-white">  
     
        <header className="bg-transparent border-b border-white/30 shadow-lg backdrop-blur-lg">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500 shadow-[0_0_15px_#6366f1] flex items-center justify-center text-black font-bold hover:scale-110 transition">
                DV
              </div>
              <div>
                <h1 className="text-lg font-semibold">Deverify Admin</h1>
                <p className="text-sm text-gray-400">Manage hackathons & submissions</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-3 py-2 rounded-md bg-indigo-500 text-black text-sm shadow-[0_0_10px_#6366f1] hover:shadow-[0_0_20px_#818cf8] transition-all">
                New Hackathon
              </button>
              <button className="px-3 py-2 rounded-md border border-white/30 text-sm hover:shadow-[0_0_10px_#9ca3af] transition-all">
                Settings
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hackathon list */}
            <section className="col-span-1 border border-white/40 rounded-lg p-4 bg-white/5 backdrop-blur-md transition">
              <style>
                {`
                  .hackathons-scroll::-webkit-scrollbar {
                    width: 8px;
                    background: transparent;
                  }
                  .hackathons-scroll::-webkit-scrollbar-thumb {
                    background: #fff;
                    border-radius: 6px;
                  }
                  .hackathons-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #fff transparent;
                  }
                  .hackathon-list-item {
                    cursor: pointer !important;
                  }
                `}
              </style>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">Hackathons</h2>
                <div className="text-xs text-gray-400">{filteredHacks.length} shown</div>
              </div>
              <input
                value={hackSearch}
                onChange={(e) => setHackSearch(e.target.value)}
                placeholder="Search hackathons"
                className="w-full px-3 py-2 border border-white/40 rounded-md text-sm bg-transparent text-white placeholder-gray-400 focus:border-indigo-400 focus:shadow-[0_0_10px_#6366f1]"
              />
              <div className="mt-3 space-y-2 max-h-80 overflow-auto hackathons-scroll cursor-none">
                {filteredHacks.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHackathonId(h.id)}
                    className={`hackathon-list-item p-3 rounded-md border border-white/40 hover:bg-white/10 transition cursor-none ${
                      selectedHackathonId === h.id ? "ring-2 ring-indigo-400" : ""
                    }`}
                    style={{ cursor: "none" }}
                  >
                    <div className="text-sm font-medium cursor-none">
                      {h.name} {h.testHack && <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-800 text-yellow-200 rounded">TEST</span>}
                    </div>
                    <div className="text-xs text-gray-400">
                      {h.startDate} → {h.endDate} • {h.status}
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => setSelectedHackathonId("all")}
                  className={`hackathon-list-item p-2 mt-2 text-center text-xs text-gray-400 border border-dashed rounded-md hover:bg-white/10 cursor-none ${
                    selectedHackathonId === "all" ? "ring-2 ring-indigo-400" : ""
                  }`}
                  style={{ cursor: "none" }}
                >
                  Show all hackathons
                </div>
              </div>
            </section>

            {/* Submissions list */}
            <section className="col-span-2 border border-white/40 rounded-lg p-4 bg-white/5 backdrop-blur-md transition">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  Submissions{" "}
                  {selectedHackathonId !== "all" && (
                    <span className="text-xs text-gray-400">• {hackathons.find((h) => h.id === selectedHackathonId)?.name}</span>
                  )}
                </h2>

                <div className="flex items-center space-x-2">
                  <input
                    value={submissionSearch}
                    onChange={(e) => setSubmissionSearch(e.target.value)}
                    placeholder="Search submissions (project, repo, submitter)"
                    className="px-3 py-2 border border-white/40 rounded-md text-sm bg-transparent text-white placeholder-gray-400 focus:border-indigo-400 focus:shadow-[0_0_10px_#6366f1]"
                  />
                  <button
                    onClick={() => {
                      setSubmissionSearch("");
                      setSelectedHackathonId("all");
                    }}
                    className="px-3 py-2 border border-white/40 rounded-md text-sm text-white hover:shadow-[0_0_10px_#9ca3af] transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-3 overflow-auto">
                <table className="min-w-full divide-y divide-white/20">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-gray-400 border-b border-white/30">Project</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-400 border-b border-white/30">Submitter</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-400 border-b border-white/30">Repository</th>
                      <th className="px-4 py-2 text-right text-xs text-gray-400 border-b border-white/30">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/20">
                    {filteredSubmissions.map((s) => (
                      <tr key={s.id} className="hover:bg-white/10 transition">
                        <td className="px-4 py-2">{s.projectName}</td>
                        <td className="px-4 py-2 text-gray-300">{s.submitter}</td>
                        <td className="px-4 py-2 text-indigo-300">
                          <a href={s.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">
                            {s.repoUrl}
                          </a>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => setSelectedSubmission(s)} className="text-indigo-400 hover:shadow-[0_0_10px_#818cf8] transition">
                              View
                            </button>
                            <button onClick={() => approveSubmission(s.id)} className="text-green-400 hover:shadow-[0_0_10px_#22c55e] transition">
                              Approve
                            </button>
                            <button onClick={() => rejectSubmission(s.id)} className="text-red-400 hover:shadow-[0_0_10px_#ef4444] transition">
                              Reject
                            </button>
                            <button onClick={() => reverifySubmission(s.id)} className="text-gray-400 hover:shadow-[0_0_10px_#9ca3af] transition">
                              Reverify
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredSubmissions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">
                          No submissions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>

        {/* Modal / drawer for submission detail */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedSubmission(null)} />
            <div className="relative border border-white/40 bg-white/10 backdrop-blur-xl p-6 rounded-lg shadow-xl max-w-2xl w-full text-white">
              <h3 className="text-lg font-semibold mb-2">{selectedSubmission.projectName}</h3>
              <p className="text-sm text-gray-300">Submitter: {selectedSubmission.submitter}</p>
              <p className="text-sm text-gray-300 mb-2">
                Repo:{" "}
                <a href={selectedSubmission.repoUrl} className="text-indigo-300 hover:underline" target="_blank" rel="noreferrer">
                  {selectedSubmission.repoUrl}
                </a>
              </p>
              <p className="text-xs text-gray-400">Submitted: {new Date(selectedSubmission.createdAt).toLocaleString()}</p>

              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => {
                    approveSubmission(selectedSubmission.id);
                    setSelectedSubmission(null);
                  }}
                  className="px-3 py-1 bg-green-600 text-black rounded text-sm shadow-[0_0_10px_#22c55e]"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    rejectSubmission(selectedSubmission.id);
                    setSelectedSubmission(null);
                  }}
                  className="px-3 py-1 bg-red-600 text-black rounded text-sm shadow-[0_0_10px_#ef4444]"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    reverifySubmission(selectedSubmission.id);
                    setSelectedSubmission(null);
                  }}
                  className="px-3 py-1 border border-white/30 rounded text-sm"
                >
                  Reverify
                </button>
                <button onClick={() => setSelectedSubmission(null)} className="px-3 py-1 border border-white/30 rounded text-sm hover:bg-white/10">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="max-w-7xl mx-auto p-4 text-xs text-gray-500 text-center">Deverify Admin • Frosted Glass Theme • Next.js + Tailwind</footer>
      </div>
      <div className="default-cursor"
        style={{
          position: 'fixed',
          left: cursor.x - 10,
          top: cursor.y - 10,
          width: 20,
          height: 20,
          zIndex: 9999,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'none',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <line x1="10" y1="9" x2="10" y2="5" stroke={cursorBlack ? 'black' : 'white'} strokeWidth="2" style={{ transform: cursorExpand ? 'translateY(-4px)' : 'translateY(0)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          <line x1="10" y1="11" x2="10" y2="15" stroke={cursorBlack ? 'black' : 'white'} strokeWidth="2" style={{ transform: cursorExpand ? 'translateY(4px)' : 'translateY(0)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          <line x1="9" y1="10" x2="5" y2="10" stroke={cursorBlack ? 'black' : 'white'} strokeWidth="2" style={{ transform: cursorExpand ? 'translateX(-4px)' : 'translateX(0)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
          <line x1="11" y1="10" x2="15" y2="10" stroke={cursorBlack ? 'black' : 'white'} strokeWidth="2" style={{ transform: cursorExpand ? 'translateX(4px)' : 'translateX(0)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        </svg>
      </div>
    </>
  );
}
