import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../services/api";

const demoAccounts = [
  { label: "Admin", email: "admin@taskforce.dev", password: "Admin@12345" },
  { label: "Manager", email: "manager@taskforce.dev", password: "Manager@12345" },
  { label: "Employee", email: "employee@taskforce.dev", password: "Employee@12345" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState(demoAccounts[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/tasks" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login({ email: form.email, password: form.password });
      navigate("/tasks");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1.1fr_0.9fr]">
      <section className="flex min-h-[45vh] flex-col justify-between bg-[linear-gradient(135deg,#020617,#173f3b_55%,#f2c14e)] p-8 lg:min-h-screen lg:p-12">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded bg-white text-slate-950">
            <ShieldCheck size={24} />
          </span>
          <div>
            <p className="text-lg font-bold">TaskForce Pro</p>
            <p className="text-sm text-white/70">Workforce task operations</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/70">
            MERN portfolio project
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Plan work, assign teams, and measure execution from one command center.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75">
            Role-based access, real MongoDB data models, operational analytics,
            employee workload visibility, and protected REST APIs.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-white/75 sm:grid-cols-3">
          <span>JWT authentication</span>
          <span>RBAC workflows</span>
          <span>Analytics dashboard</span>
        </div>
      </section>

      <section className="flex items-center justify-center bg-white px-5 py-10 text-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <span className="mb-4 grid h-12 w-12 place-items-center rounded bg-slate-950 text-white">
              <LockKeyhole size={22} />
            </span>
            <h2 className="text-3xl font-bold">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">
              Use one of the seeded demo accounts after running the backend seed.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-3 gap-2">
            {demoAccounts.map((account) => (
              <button
                key={account.label}
                type="button"
                onClick={() => setForm(account)}
                className={`rounded border px-3 py-2 text-sm font-semibold ${
                  form.label === account.label
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {account.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Email</span>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded border border-slate-300 px-4 py-3 outline-none focus:border-slate-950"
              />
            </label>

            {error && (
              <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded bg-slate-950 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Signing in..." : "Open command center"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
