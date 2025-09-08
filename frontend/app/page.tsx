"use client";
import Link from "next/link";
import { ArrowRight, BarChart, Shield, Upload, Zap } from "lucide-react";

const Icon = ({
  name,
  className,
}: {
  name: "upload" | "shield" | "bar-chart" | "zap";
  className?: string;
}) => {
  const components = {
    upload: Upload,
    shield: Shield,
    "bar-chart": BarChart,
    zap: Zap,
  };
  const IconComponent = components[name];
  return <IconComponent className={className} />;
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-6 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold">Resilience CoPilot</div>
          <nav>
            <Link
              href="/dashboard"
              className="text-lg font-semibold hover:text-blue-400 transition-colors"
            >
              Dashboard
            </Link>
          </nav>
        </header>

        <section className="text-center mb-24">
          <h1 className="text-6xl font-extrabold mb-4 animate-slideInUp">
            Build an Unbreakable Business
          </h1>
          <p className="text-xl text-gray-300 mb-8 animate-slideInUp animation-delay-200">
            AI-powered insights to identify risks, simulate impacts, and create
            resilience strategies.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 text-white px-8 py-4 font-bold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 animate-pulse"
          >
            Get Started for Free
            <ArrowRight className="inline-block ml-2" />
          </Link>
        </section>

        <section className="mb-24">
          <h2 className="text-4xl font-bold text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <Icon name="upload" className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Upload Data</h3>
              <p className="text-gray-400">
                Securely upload your business data in CSV format.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <Icon name="shield" className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Detect Risks</h3>
              <p className="text-gray-400">
                Our AI analyzes your data to identify potential vulnerabilities.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <Icon
                name="bar-chart"
                className="w-12 h-12 text-yellow-400 mb-4"
              />
              <h3 className="text-2xl font-bold mb-2">Simulate Scenarios</h3>
              <p className="text-gray-400">
                Run what-if simulations to understand the impact of disruptions.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <Icon name="zap" className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Actionable Insights</h3>
              <p className="text-gray-400">
                Get concrete recommendations to improve your business resilience.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to build resilience?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start now and turn risks into opportunities.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-green-500 text-white px-8 py-4 font-bold rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
          >
            Go to Dashboard
          </Link>
        </section>
      </main>
    </div>
  );
}
