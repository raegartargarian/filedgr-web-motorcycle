import Car1 from "@/assets/images/car360_01.png";
import Car2 from "@/assets/images/car360_02.png";
import Car3 from "@/assets/images/car360_03.png";
import Car4 from "@/assets/images/car360_04.png";
import Car5 from "@/assets/images/car360_05.png";
import Car6 from "@/assets/images/car360_06.png";
import Car7 from "@/assets/images/car360_07.png";
import Car8 from "@/assets/images/car360_08.png";
import Car9 from "@/assets/images/car360_09.png";
import Car10 from "@/assets/images/car360-10.png";
import Car11 from "@/assets/images/car360_11.png";
import Car12 from "@/assets/images/car360_12.png";
import Car13 from "@/assets/images/car360_13.png";

import { appRoutes } from "@/shared/constants/routes";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Car,
  CheckCircle,
  FileText,
  Shield,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const car360Images = [
  Car1, Car2, Car3, Car4, Car5, Car6, Car7, Car8, Car9, Car10, Car11, Car12,
  Car13,
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const Dashboard = () => {
  const [current360Image, setCurrent360Image] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent360Image((prev) => (prev + 1) % car360Images.length);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  Blockchain Verified Records
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Motorcycle
                <br />
                <span className="text-blue-600">Service History</span>
              </h1>
              <p className="text-lg text-gray-500 mt-5 max-w-lg leading-relaxed">
                Complete, verified documentation of every repair and service
                performed on your motorcycle. Before and after photos, invoices,
                and parts — all stored on the blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                  to={appRoutes.vaults.path}
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-base font-semibold transition-colors shadow-sm"
                >
                  View Your Motorcycles
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right: 360 Motorcycle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-gray-100/50 rounded-3xl blur-2xl" />
                <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/60 p-6 shadow-lg">
                  <img
                    src={car360Images[current360Image]}
                    alt="Motorcycle 360 view"
                    className="w-full h-auto object-contain"
                    style={{ minHeight: "240px" }}
                  />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] text-gray-400 bg-white/80 px-2 py-0.5 rounded-full border border-gray-100">
                      360° View
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              A transparent, verifiable record of your motorcycle's service history
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Car,
                title: "Motorcycle Registered",
                description:
                  "Your motorcycle is registered as a digital asset with a unique blockchain identity.",
                color: "blue",
              },
              {
                icon: Wrench,
                title: "Service Documented",
                description:
                  "Every repair is documented with before/after photos, invoices, and parts records.",
                color: "green",
              },
              {
                icon: Shield,
                title: "Records Verified",
                description:
                  "All records are cryptographically verified and permanently stored on the blockchain.",
                color: "blue",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center hover:shadow-sm transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                    item.color === "green"
                      ? "bg-green-50 border border-green-100"
                      : "bg-blue-50 border border-blue-100"
                  }`}
                >
                  <item.icon
                    className={`w-6 h-6 ${
                      item.color === "green"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              What Every Service Record Includes
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Camera,
                title: "Before & After Photos",
                description: "Visual proof of every repair performed",
              },
              {
                icon: FileText,
                title: "Invoices & Documents",
                description: "Complete financial documentation",
              },
              {
                icon: Wrench,
                title: "Parts & Labor",
                description: "Detailed breakdown of work performed",
              },
              {
                icon: CheckCircle,
                title: "Blockchain Proof",
                description: "Immutable verification of service",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...stagger}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <item.icon className="w-5 h-5 text-blue-600 mb-3" />
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Ready to view your motorcycle's history?
            </h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Access your complete, blockchain-verified service records in
              seconds.
            </p>
            <Link
              to={appRoutes.vaults.path}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors shadow-sm"
            >
              View Your Motorcycles
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
