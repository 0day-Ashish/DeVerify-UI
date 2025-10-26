"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Particles from "@/components/Particles";
import { ethers } from "ethers";

// Admin dashboard with MetaMask admin-wallet integration.
// - Set NEXT_PUBLIC_ADMIN_ADDRESS in your .env (lowercase checksum optional)
// - npm install ethers

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

// (mock data omitted here for brevity in the doc — replace with your data source)
const MOCK_HACKATHONS: Hackathon[] = [ /* ... same as original ... */ ];
const MOCK_SUBMISSIONS: Submission[] = [ /* ... same as original ... */ ];

// CELO Sepolia constants
const CELO_SEPOLIA_CHAIN_ID = "0xaa044c"; // hex for 11142220
const CELO_SEPOLIA_RPC = "https://rpc.ankr.com/celo_sepolia";
const CELO_SEPOLIA_EXPLORER = "https://celo-sepolia.blockscout.com";

export default function AdminDashboardPage() {
  const navMenuRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.85]);

  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [cursorBlack, setCursorBlack] = useState(false);
  const [cursorExpand, setCursorExpand] = useState(true);

  // Wallet / admin state
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Provide admin address via env: NEXT_PUBLIC_ADMIN_ADDRESS
  const ADMIN_ADDRESS = (process.env.NEXT_PUBLIC_ADMIN_ADDRESS || "").toLowerCase();
  const isAdminAddress = connectedAccount ? connectedAccount.toLowerCase() === ADMIN_ADDRESS : false;
  // Admin is only valid if account matches and chain is Celo Sepolia
  const isOnCeloSepolia = chainId === CELO_SEPOLIA_CHAIN_ID;
  const isAdmin = isAdminAddress && isOnCeloSepolia;

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

  // Filter logic unchanged
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

  // --- Wallet helpers ---
  useEffect(() => {
    // Setup provider if window.ethereum exists, but do NOT auto-connect or auto-handle accounts
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const p = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(p);

      // Listen for account/chain changes
      (window as any).ethereum.on && (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        // Update state only if UI had wallet connected or accounts changed to empty
        if (accounts && accounts.length === 0) {
          // user disconnected via wallet UI
          setConnectedAccount(null);
          setSigner(null);
          setChainId(null);
        } else if (connectedAccount) {
          handleAccountsChanged(accounts);
        }
      });
      (window as any).ethereum.on && (window as any).ethereum.on('chainChanged', (newChainId: string) => {
        handleChainChanged(newChainId);
      });

      return () => {
        (window as any).ethereum.removeListener && (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener && (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedAccount]);

  async function handleAccountsChanged(accounts: string[]) {
    if (!accounts || accounts.length === 0) {
      setConnectedAccount(null);
      setSigner(null);
      return;
    }
    const acc = ethers.getAddress(accounts[0]);
    setConnectedAccount(acc);
    try {
      if (provider) {
        const s = await provider.getSigner();
        setSigner(s as any);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleChainChanged(_chainId: string) {
    // chainChanged returns a hex string; update state and clear any chain-specific errors
    setChainId(_chainId);
    if (_chainId === CELO_SEPOLIA_CHAIN_ID) {
      setWalletError(null);
    }
  }

  async function connectWallet() {
    setWalletError(null);
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setWalletError('No Ethereum provider found. Install MetaMask.');
      return;
    }

    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      await handleAccountsChanged(accounts);
      // Set chainId after connection
      const id = await (window as any).ethereum.request({ method: 'eth_chainId' });
      setChainId(id);
      if (id !== CELO_SEPOLIA_CHAIN_ID) {
        setWalletError('Please switch your wallet to the Celo Sepolia Testnet.');
      }
    } catch (err: any) {
      setWalletError(err?.message || String(err));
    }
  }

  function disconnectWallet() {
    // MetaMask doesn't provide programmatic disconnect. Clear local UI state.
    setConnectedAccount(null);
    setSigner(null);
    setChainId(null);
    setWalletError(null);
  }

  async function signAdminMessage() {
    if (!signer) return setWalletError('No signer available');
    try {
      const msg = `Deverify admin auth ${new Date().toISOString()}`;
      const sig = await signer.signMessage(msg);
      alert('Signature:\n' + sig);
    } catch (err: any) {
      setWalletError(err?.message || String(err));
    }
  }

  // attempt to switch to Celo Sepolia, and add network if required
  async function switchToCeloSepolia() {
    setWalletError(null);
    if (typeof window === "undefined" || !(window as any).ethereum) {
      setWalletError("MetaMask not found");
      return;
    }

    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CELO_SEPOLIA_CHAIN_ID }],
      });
      setChainId(CELO_SEPOLIA_CHAIN_ID);
      setWalletError(null);
    } catch (switchError: any) {
      // 4902 -> chain not added to MetaMask
      if (switchError && (switchError.code === 4902 || switchError.code === -32603)) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: CELO_SEPOLIA_CHAIN_ID,
                chainName: "Celo Sepolia Testnet",
                nativeCurrency: {
                  name: "Celo",
                  symbol: "CELO",
                  decimals: 18,
                },
                rpcUrls: [CELO_SEPOLIA_RPC],
                blockExplorerUrls: [CELO_SEPOLIA_EXPLORER],
              },
            ],
          });
          // After adding, try to switch again
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: CELO_SEPOLIA_CHAIN_ID }],
          });
          setChainId(CELO_SEPOLIA_CHAIN_ID);
          setWalletError(null);
        } catch (addErr: any) {
          setWalletError(addErr?.message || String(addErr));
        }
      } else {
        setWalletError(switchError?.message || String(switchError));
      }
    }
  }

  // Actions (mock) — protect with admin check
  function approveSubmission(id: string) {
    if (!isAdmin) return setWalletError('Only admin wallet on Celo Sepolia can approve submissions');
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s)));
  }
  function rejectSubmission(id: string) {
    if (!isAdmin) return setWalletError('Only admin wallet on Celo Sepolia can reject submissions');
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s)));
  }
  function reverifySubmission(id: string) {
    if (!isAdmin) return setWalletError('Only admin wallet on Celo Sepolia can reverify submissions');
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status: "pending" } : s)));
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: "scored", score: Math.round(((s.score ?? 5) + Math.random() * 3) / 0.1) * 0.1 } : s
        )
      );
    }, 1200);
  }

  // UI helpers
  const shortAddr = (addr: string | null) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—");

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
              {connectedAccount ? (
                <div className="flex items-center space-x-2">
                  <div className={`px-3 py-2 rounded-md text-sm ${isAdmin ? 'bg-green-400 text-black' : 'bg-yellow-600 text-black'}`}>
                    {isAdmin ? 'Admin' : isOnCeloSepolia ? 'Connected' : 'Wrong Network'} • {shortAddr(connectedAccount)}
                  </div>

                  {/* Show switch button only when connected but not on Celo Sepolia */}
                  {connectedAccount && !isOnCeloSepolia && (
                    <button onClick={switchToCeloSepolia} className="px-3 py-2 rounded-md bg-yellow-500 text-black text-sm shadow-[0_0_10px_#facc15]">
                      Switch to Celo Sepolia
                    </button>
                  )}

                  <button onClick={disconnectWallet} className="px-3 py-2 rounded-md border border-white/30 text-sm">
                    Disconnect
                  </button>
                  <button onClick={signAdminMessage} className="px-3 py-2 rounded-md bg-indigo-500 text-black text-sm shadow-[0_0_10px_#6366f1]">Sign Msg</button>
                </div>
              ) : (
                <button onClick={connectWallet} className="px-3 py-2 rounded-md bg-indigo-500 text-black text-sm shadow-[0_0_10px_#6366f1]">
                  Connect Wallet
                </button>
              )}

              <button className="px-3 py-2 rounded-md border border-white/30 text-sm hover:shadow-[0_0_10px_#9ca3af] transition-all">
                Settings
              </button>
            </div>
          </div>
        </header>

        {/* show any wallet error / chain info */}
        {walletError && (
          <div className="max-w-7xl mx-auto mt-3 px-4">
            <div className="p-3 rounded bg-yellow-900 text-yellow-100 text-sm">{walletError}</div>
          </div>
        )}

        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hackathon list */}
            <section className="col-span-1 border border-white/40 rounded-lg p-4 bg-white/5 backdrop-blur-md transition">
              {/* ... same UI as original (omitted for brevity in this file) ... */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">Hackathons</h2>
                <div className="text-xs text-gray-400">{filteredHacks.length} shown</div>
              </div>
              {/* (rest of left column UI) */}
            </section>

            {/* Submissions list */}
            <section className="col-span-2 border border-white/40 rounded-lg p-4 bg-white/5 backdrop-blur-md transition">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">
                  Submissions {selectedHackathonId !== 'all' && <span className="text-xs text-gray-400">• {hackathons.find((h) => h.id === selectedHackathonId)?.name}</span>}
                </h2>

                <div className="flex items-center space-x-2">
                  <input value={submissionSearch} onChange={(e) => setSubmissionSearch(e.target.value)} placeholder="Search submissions (project, repo, submitter)" className="px-3 py-2 border border-white/40 rounded-md text-sm bg-transparent text-white placeholder-gray-400 focus:border-indigo-400 focus:shadow-[0_0_10px_#6366f1]" />
                  <button onClick={() => { setSubmissionSearch(''); setSelectedHackathonId('all'); }} className="px-3 py-2 border border-white/40 rounded-md text-sm text-white hover:shadow-[0_0_10px_#9ca3af] transition-all">Reset</button>
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
                        <td className="px-4 py-2 text-indigo-300"><a href={s.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">{s.repoUrl}</a></td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => setSelectedSubmission(s)} className="text-indigo-400 hover:shadow-[0_0_10px_#818cf8] transition">View</button>
                            <button onClick={() => approveSubmission(s.id)} disabled={!isAdmin} className={`text-green-400 hover:shadow-[0_0_10px_#22c55e] transition ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}>Approve</button>
                            <button onClick={() => rejectSubmission(s.id)} disabled={!isAdmin} className={`text-red-400 hover:shadow-[0_0_10px_#ef4444] transition ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}>Reject</button>
                            <button onClick={() => reverifySubmission(s.id)} disabled={!isAdmin} className={`text-gray-400 hover:shadow-[0_0_10px_#9ca3af] transition ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}>Reverify</button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredSubmissions.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">No submissions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>

        {/* Modal / drawer for submission detail (unchanged) */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedSubmission(null)} />
            <div className="relative border border-white/40 bg-white/10 backdrop-blur-xl p-6 rounded-lg shadow-xl max-w-2xl w-full text-white">
              <h3 className="text-lg font-semibold mb-2">{selectedSubmission.projectName}</h3>
              <p className="text-sm text-gray-300">Submitter: {selectedSubmission.submitter}</p>
              <p className="text-sm text-gray-300 mb-2">Repo: <a href={selectedSubmission.repoUrl} className="text-indigo-300 hover:underline" target="_blank" rel="noreferrer">{selectedSubmission.repoUrl}</a></p>
              <p className="text-xs text-gray-400">Submitted: {new Date(selectedSubmission.createdAt).toLocaleString()}</p>

              <div className="mt-4 flex items-center space-x-2">
                <button onClick={() => { approveSubmission(selectedSubmission.id); setSelectedSubmission(null); }} className="px-3 py-1 bg-green-600 text-black rounded text-sm shadow-[0_0_10px_#22c55e]" disabled={!isAdmin}>Approve</button>
                <button onClick={() => { rejectSubmission(selectedSubmission.id); setSelectedSubmission(null); }} className="px-3 py-1 bg-red-600 text-black rounded text-sm shadow-[0_0_10px_#ef4444]" disabled={!isAdmin}>Reject</button>
                <button onClick={() => { reverifySubmission(selectedSubmission.id); setSelectedSubmission(null); }} className="px-3 py-1 border border-white/30 rounded text-sm" disabled={!isAdmin}>Reverify</button>
                <button onClick={() => setSelectedSubmission(null)} className="px-3 py-1 border border-white/30 rounded text-sm hover:bg-white/10">Close</button>
              </div>

              {!isAdmin && (
                <p className="mt-3 text-xs text-yellow-300">Admin actions are disabled — connect the admin wallet ({ADMIN_ADDRESS || 'not configured'}) and ensure you're on Celo Sepolia ({CELO_SEPOLIA_CHAIN_ID}) to perform actions.</p>
              )}
            </div>
          </div>
        )}

        <footer className="max-w-7xl mx-auto p-4 text-xs text-gray-500 text-center">Deverify Admin • Frosted Glass Theme • Next.js + Tailwind</footer>
      </div>

      <div className="default-cursor" style={{ position: 'fixed', left: cursor.x - 10, top: cursor.y - 10, width: 20, height: 20, zIndex: 9999, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'none' }}>
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
