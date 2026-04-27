import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Calendar, TrendingUp,
  AlertCircle, Trash2
} from "lucide-react";
import { apiFetch } from "../auth";

/* ─── API ─── */

// function getToken() {
//   return localStorage.getItem("token");
// }


async function fetchHistory() {
  const data = await apiFetch("http://localhost:8000/api/scan-history");
  return data?.scans || [];
}

async function fetchScanDetail(id) {
  return await apiFetch(`http://localhost:8000/api/scan/${id}`);
}

async function deleteScanAPI(id) {
  await apiFetch(`http://localhost:8000/api/scan/${id}`, {
    method: "DELETE"
  });
}

/* ─── COMPONENT ─── */
export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* LOAD HISTORY */
  useEffect(() => {
  async function load() {
    try {
      const data = await fetchHistory();
      setScans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  load();
}, []);

  /* SELECT SCAN */
  const handleSelect = async (id) => {
  try {
    const data = await fetchScanDetail(id);
    setSelectedScan(data);
  } catch (err) {
    setError(err.message);
  }
};

  /* DELETE */
  const handleDelete = async (id) => {
  try {
    await deleteScanAPI(id);

    setScans(prev => prev.filter(s => s.id !== id));

    if (selectedScan?.id === id) {
      setSelectedScan(null);
    }
  } catch (err) {
    setError(err.message);
  }
};
  return (
    <div className="min-h-screen bg-[#FDFCF8] px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold text-[#2E2218]">
          Resume Dashboard
        </h1>
        <p className="text-[#967A68] text-sm mt-1">
          Track, analyze and improve your resumes over time
        </p>
        
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">

        {/* LEFT: HISTORY */}
        <div className="space-y-4">

          {loading && <p>Loading...</p>}

          {error && (
            <div className="text-red-500 text-sm flex gap-2">
              <AlertCircle size={14}/> {error}
            </div>
          )}

          {scans.map((scan, i) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(scan.id)}
              className={`cursor-pointer p-5 rounded-xl border transition
                ${selectedScan?.id === scan.id
                  ? "border-[#C8A84B] bg-[#FDFCF8]"
                  : "border-[#DDD5BE] bg-white hover:shadow-md"}`}
            >
              <div className="flex justify-between">

                {/* LEFT INFO */}
                <div className="flex gap-3">
                  <FileText className="text-[#C8A84B]" size={20}/>

                  <div>
                    <p className="text-sm font-semibold text-[#2E2218]">
                      {scan.file_name}
                    </p>

                    <div className="flex gap-3 text-xs text-[#967A68] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={12}/>
                        {new Date(scan.created_at).toLocaleDateString()}
                      </span>

                      {scan.job_role && <span>• {scan.job_role}</span>}
                    </div>
                  </div>
                </div>

                {/* SCORE */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#C8A84B]">
                    <TrendingUp size={14}/>
                    <span className="font-bold text-lg">
                      {scan.overall_score}
                    </span>
                  </div>
                  <p className="text-xs text-[#967A68]">Score</p>
                </div>

              </div>
            </motion.div>
          ))}

          {!loading && scans.length === 0 && (
            <p className="text-[#967A68] text-sm">
              No scans yet.
            </p>
          )}
        </div>

        {/* RIGHT: DETAIL PANEL */}
{/* RIGHT: DETAIL PANEL */}
<div className="bg-white border border-[#DDD5BE] rounded-xl shadow-sm h-[600px] flex flex-col">

  <div className="flex-1 overflow-y-auto p-6">

    <AnimatePresence mode="wait">
      {!selectedScan ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[#967A68]"
        >
          Select a resume to view details
        </motion.div>
      ) : (
        <motion.div
          key="detail"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >

          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-[#2E2218]">
                {selectedScan.file_name}
              </h2>
              <p className="text-sm text-[#967A68]">
                Score: {selectedScan.overall_score}
              </p>
            </div>

            <button
              onClick={() => handleDelete(selectedScan.id)}
              className="flex items-center gap-1 text-red-500 text-sm"
            >
              <Trash2 size={14}/> Delete
            </button>
          </div>

          {/* STRENGTHS */}
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-[#2E2218]">
              Strengths
            </h3>
            <ul className="text-sm text-[#967A68] mt-1 space-y-1">
              {selectedScan.strengths?.map((s,i)=>(
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          {/* IMPROVEMENTS */}
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-[#2E2218]">
              Improvements
            </h3>
            <ul className="text-sm text-[#967A68] mt-1 space-y-1">
              {selectedScan.improvements?.map((s,i)=>(
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          {/* CATEGORY SCORES */}
          <div>
            <h3 className="font-semibold text-sm text-[#2E2218] mb-2">
              Section Scores
            </h3>

            {Object.entries(selectedScan.categories || {}).map(([key,val]) => (
              <div key={key} className="mb-2">
                <div className="flex justify-between text-xs">
                  <span className="capitalize text-[#2E2218]">
                    {key}
                  </span>
                  <span className="text-[#C8A84B] font-semibold">
                    {val.score}
                  </span>
                </div>

                <div className="h-2 bg-[#EDE7D9] rounded mt-1">
                  <div
                    className="h-full bg-[#C8A84B] rounded"
                    style={{ width: `${val.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      )}
    </AnimatePresence>

  </div>

</div>
            
      </div>
    </div>
  );
}