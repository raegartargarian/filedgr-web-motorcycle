// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { NAVData } from "@/shared/utils/zipHandler";
// import React from "react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// interface DataVisualizationProps {
//   data: NAVData[];
// }

// const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center p-8">
//         <p className="text-gray-600">No NAV data available</p>
//       </div>
//     );
//   }

//   // Prepare data for charts - take every 7th data point to avoid overcrowding
//   const chartData = data
//     .filter((_, index) => index % 7 === 0)
//     .slice(0, 20)
//     .map((item) => ({
//       date: new Date(item.date).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       }),
//       "Total Assets": item.totalAssets / 1000000, // Convert to millions
//       "Total Liabilities": item.totalLiabilities / 1000000,
//       "Net Assets": item.netAssets / 1000000,
//       "NAV per Share": item.navPerShare,
//       "Shares Outstanding": item.sharesOutstanding / 1000, // Convert to thousands
//     }));

//   // Calculate averages
//   const avgTotalAssets =
//     data.reduce((sum, item) => sum + item.totalAssets, 0) / data.length;
//   const avgNetAssets =
//     data.reduce((sum, item) => sum + item.netAssets, 0) / data.length;
//   const avgNAVPerShare =
//     data.reduce((sum, item) => sum + item.navPerShare, 0) / data.length;
//   const avgSharesOutstanding =
//     data.reduce((sum, item) => sum + item.sharesOutstanding, 0) / data.length;

//   // Calculate growth
//   const initialNAV = data[0]?.navPerShare || 0;
//   const finalNAV = data[data.length - 1]?.navPerShare || 0;
//   const navGrowth =
//     initialNAV > 0 ? ((finalNAV - initialNAV) / initialNAV) * 100 : 0;

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <Card className="bg-white border border-gray-200 shadow-sm">
//           <CardContent className="p-4">
//             <div className="text-sm text-gray-600 font-medium">
//               Avg Total Assets
//             </div>
//             <div className="text-2xl font-bold text-gray-800">
//               ${(avgTotalAssets / 1000000).toFixed(1)}M
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-white border border-gray-200 shadow-sm">
//           <CardContent className="p-4">
//             <div className="text-sm text-gray-600 font-medium">
//               Avg Net Assets
//             </div>
//             <div className="text-2xl font-bold text-blue-600">
//               ${(avgNetAssets / 1000000).toFixed(1)}M
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-white border border-gray-200 shadow-sm">
//           <CardContent className="p-4">
//             <div className="text-sm text-gray-600 font-medium">
//               Avg NAV per Share
//             </div>
//             <div className="text-2xl font-bold text-green-600">
//               ${avgNAVPerShare.toFixed(2)}
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="bg-white border border-gray-200 shadow-sm">
//           <CardContent className="p-4">
//             <div className="text-sm text-gray-600 font-medium">NAV Growth</div>
//             <div
//               className={`text-2xl font-bold ${navGrowth >= 0 ? "text-green-700" : "text-red-600"}`}
//             >
//               {navGrowth >= 0 ? "+" : ""}
//               {navGrowth.toFixed(1)}%
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Card className="bg-white border border-gray-200 shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-gray-900">NAV per Share Trend</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart
//               data={chartData}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis
//                 dataKey="date"
//                 tick={{ fill: "#374151", fontSize: 12 }}
//                 axisLine={{ stroke: "#9ca3af" }}
//               />
//               <YAxis
//                 label={{
//                   value: "NAV per Share ($)",
//                   angle: -90,
//                   position: "insideLeft",
//                   style: { textAnchor: "middle", fill: "#374151" },
//                 }}
//                 tick={{ fill: "#374151", fontSize: 12 }}
//                 axisLine={{ stroke: "#9ca3af" }}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "white",
//                   border: "1px solid #d1d5db",
//                   borderRadius: "6px",
//                   color: "#374151",
//                 }}
//               />
//               <Legend wrapperStyle={{ color: "#374151" }} />
//               <Line
//                 type="monotone"
//                 dataKey="NAV per Share"
//                 stroke="#10b981"
//                 strokeWidth={3}
//                 dot={{ r: 5, fill: "#10b981" }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       <Card className="bg-white border border-gray-200 shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-gray-900">
//             Assets and Liabilities (Millions $)
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//               data={chartData}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis
//                 dataKey="date"
//                 tick={{ fill: "#374151", fontSize: 12 }}
//                 axisLine={{ stroke: "#9ca3af" }}
//               />
//               <YAxis
//                 label={{
//                   value: "Amount (Millions $)",
//                   angle: -90,
//                   position: "insideLeft",
//                   style: { textAnchor: "middle", fill: "#374151" },
//                 }}
//                 tick={{ fill: "#374151", fontSize: 12 }}
//                 axisLine={{ stroke: "#9ca3af" }}
//               />
//               <Tooltip
//                 contentStyle={{
//                   backgroundColor: "white",
//                   border: "1px solid #d1d5db",
//                   borderRadius: "6px",
//                   color: "#374151",
//                 }}
//               />
//               <Legend wrapperStyle={{ color: "#374151" }} />
//               <Bar dataKey="Total Assets" fill="#3b82f6" name="Total Assets" />
//               <Bar
//                 dataKey="Total Liabilities"
//                 fill="#ef4444"
//                 name="Total Liabilities"
//               />
//               <Bar dataKey="Net Assets" fill="#10b981" name="Net Assets" />
//             </BarChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>

//       <Card className="bg-white border border-gray-200 shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-gray-900">
//             Fund Performance Summary
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-3">
//               <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
//               <div className="space-y-2">
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-gray-700">Total data points:</span>
//                   <span className="font-medium text-gray-900">
//                     {data.length} days
//                   </span>
//                 </div>
//                 <div className="flex justify-between py-2 border-b border-gray-100">
//                   <span className="text-gray-700">
//                     Average shares outstanding:
//                   </span>
//                   <span className="font-medium text-blue-600">
//                     {(avgSharesOutstanding / 1000).toFixed(0)}K
//                   </span>
//                 </div>
//                 <div className="flex justify-between py-2">
//                   <span className="text-gray-700">Highest NAV per share:</span>
//                   <span className="font-medium text-green-700">
//                     ${Math.max(...data.map((d) => d.navPerShare)).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-3">
//               <h4 className="font-semibold text-gray-900 mb-3">
//                 Fund Overview
//               </h4>
//               <p className="text-gray-700 leading-relaxed">
//                 This NAV analysis demonstrates consistent fund performance with
//                 transparent asset valuation and liability management. The data
//                 shows daily fund calculations supporting investor confidence and
//                 regulatory compliance.
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default DataVisualization;
