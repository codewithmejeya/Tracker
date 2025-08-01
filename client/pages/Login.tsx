import { useState } from "react";
import { Eye, EyeOff, Shield, Zap, Users, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, Link } from "react-router-dom";
import { getApiUrl } from "@/lib/api-config";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(getApiUrl("auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const TrackerLogo = () => (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-tracker-blue to-tracker-light-blue rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" fill="white" />
              <path
                d="M8 12l2 2 4-4"
                stroke="hsl(var(--tracker-blue))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
        Tracker
      </h1>
      <p className="text-xl text-blue-100 font-light">Management System</p>
    </div>
  );

  const FeatureCard = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: any;
    title: string;
    description: string;
  }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-105 transition-all duration-300 hover:bg-white/20">
      <Icon className="w-8 h-8 text-white mx-auto mb-2" />
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-blue-100 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center">
        <TrackerLogo />

        <div className="grid grid-cols-2 gap-6 mb-8">
          <FeatureCard
            icon={Shield}
            title="Secure"
            description="Bank-level security for your data"
          />
          <FeatureCard
            icon={Zap}
            title="Fast"
            description="Lightning-fast performance"
          />
          <FeatureCard
            icon={Users}
            title="Collaborative"
            description="Team-based workflow management"
          />
          <FeatureCard
            icon={BarChart}
            title="Analytics"
            description="Real-time insights & reports"
          />
        </div>

        <div className="text-white/80 text-lg">
          <p className="mb-3">🚀 Streamline your business operations</p>
          <p className="mb-3">📊 Track expenses & approvals in real-time</p>
          <p className="mb-3">🏢 Manage branches & employees efficiently</p>
          <p>💡 Make data-driven decisions</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <TrackerLogo />
          </div>

          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to your Tracker account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tracker-blue focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tracker-blue focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-pulse">
                  <p className="text-red-700 text-sm text-center">{error}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="border-tracker-blue data-[state=checked]:bg-tracker-blue"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <a
                  href="#"
                  className="text-sm text-tracker-blue hover:text-tracker-blue/80 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-tracker-blue to-tracker-light-blue hover:from-tracker-blue/90 hover:to-tracker-light-blue/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-tracker-blue hover:text-tracker-blue/80 font-medium transition-colors"
                >
                  Create one here
                </Link>
              </div>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
            <p className="text-white text-sm mb-2">Demo Credentials:</p>
            <p className="text-blue-100 text-xs">
              Username: <span className="font-mono">barath</span> | Password:{" "}
              <span className="font-mono">123456</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
