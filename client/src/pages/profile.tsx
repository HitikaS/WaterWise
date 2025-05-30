import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Profile() {
  // Sample John Doe data
  const user = {
    username: "John Doe",
    email: "john@example.com",
    waterSaved: 950,
    actionsCount: 6,
    location: "New York, USA",
    phone: "+1 555-1234"
  };

  // State for dashboard, weather, leaderboard, tips, reports
  const [dashboard, setDashboard] = useState<any>(null);
  const [weather, setWeather] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [reportForm, setReportForm] = useState({ issueType: '', severity: '', location: '', description: '' });
  const [reportMsg, setReportMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/metrics").then(r => r.json()).then(setDashboard);
    fetch("/api/weather").then(r => r.json()).then(setWeather);
    fetch("/api/leaderboard").then(r => r.json()).then(setLeaderboard);
    fetch("/api/tips").then(r => r.json()).then(setTips);
    fetch("/api/predictions").then(r => r.json()).then(setPredictions);
    fetch("/api/reports").then(r => r.json()).then(setReports);
  }, []);

  const handleReportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReportForm({ ...reportForm, [e.target.name]: e.target.value });
  };
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportMsg(null);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportForm)
    });
    if (res.ok) {
      setReportMsg("Report submitted!");
      setReportForm({ issueType: '', severity: '', location: '', description: '' });
      fetch("/api/reports").then(r => r.json()).then(setReports);
    } else {
      setReportMsg("Failed to submit report.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Profile: {user.username}</h2>
          <div className="mb-4"><b>Email:</b> {user.email}</div>
          <div className="mb-4"><b>Location:</b> {user.location}</div>
          <div className="mb-4"><b>Phone:</b> {user.phone}</div>
          <div className="mb-4"><b>Water Saved:</b> {user.waterSaved} liters</div>
          <div className="mb-4"><b>Actions Count:</b> {user.actionsCount}</div>
          <div className="flex justify-center mt-8">
            <Button onClick={() => window.location.href = "/"} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">Back to Home</Button>
          </div>
        </div>

        {/* Dashboard: Predictions */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Water Scarcity Predictions (Next 2–4 Weeks)</h3>
          {predictions.length > 0 ? (
            <ul>
              {predictions.map((p: any) => (
                <li key={p.week} className="mb-2">Week {p.week}: <b>Risk Level:</b> {p.riskLevel} | <b>Expected Rainfall:</b> {p.expectedRainfall}mm | <b>Temp:</b> {p.temperature}°C</li>
              ))}
            </ul>
          ) : <div>Loading predictions...</div>}
        </div>

        {/* Weather */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Weather Forecast</h3>
          {weather.length > 0 ? (
            <ul className="grid grid-cols-2 gap-2">
              {weather.map((w: any, i: number) => (
                <li key={i} className="mb-2">{w.date}: <b>{w.temperature}°C</b>, {w.description}, Rain: {w.rainfall}mm</li>
              ))}
            </ul>
          ) : <div>Loading weather...</div>}
        </div>

        {/* Leaderboard */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
          {leaderboard.length > 0 ? (
            <ol>
              {leaderboard.map((u: any, i: number) => (
                <li key={u.id} className="mb-1">{i + 1}. {u.username} — {u.waterSaved} liters saved</li>
              ))}
            </ol>
          ) : <div>Loading leaderboard...</div>}
        </div>

        {/* Water-saving Tips / Alerts */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Water-Saving Tips & Alerts</h3>
          {tips.length > 0 ? (
            <ul>
              {tips.map((tip: any, i: number) => (
                <li key={i} className="mb-2"><b>{tip.title}:</b> {tip.description}</li>
              ))}
            </ul>
          ) : <div>Loading tips...</div>}
        </div>

        {/* Report Form */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Report a Water Issue</h3>
          <form onSubmit={handleReportSubmit} className="space-y-3">
            <input name="issueType" value={reportForm.issueType} onChange={handleReportChange} placeholder="Issue Type (e.g., Low Pressure)" className="w-full border rounded px-3 py-2" required />
            <input name="severity" value={reportForm.severity} onChange={handleReportChange} placeholder="Severity (e.g., High)" className="w-full border rounded px-3 py-2" required />
            <input name="location" value={reportForm.location} onChange={handleReportChange} placeholder="Location" className="w-full border rounded px-3 py-2" required />
            <textarea name="description" value={reportForm.description} onChange={handleReportChange} placeholder="Description" className="w-full border rounded px-3 py-2" required />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Submit Report</Button>
          </form>
          {reportMsg && <div className="mt-2 text-center text-green-600">{reportMsg}</div>}
        </div>

        {/* User Reports */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">Recent Water Issue Reports</h3>
          {reports.length > 0 ? (
            <ul>
              {reports.map((r: any, i: number) => (
                <li key={i} className="mb-2"><b>{r.issueType}</b> ({r.severity}) at {r.location}: {r.description}</li>
              ))}
            </ul>
          ) : <div>No reports yet.</div>}
        </div>
      </div>
    </div>
  );
} 