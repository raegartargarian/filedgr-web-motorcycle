// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { CertificateData } from "@/shared/utils/zipHandler";
// import { Link1Icon } from "@radix-ui/react-icons";
// import {
//   Building,
//   Building2Icon,
//   Calendar,
//   MapPin,
//   ShieldCheckIcon,
// } from "lucide-react";

// const GeoCoordinatesView = ({ data }: { data: CertificateData }) => {
//   if (!data.latitude || !data.longitude) return null;

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-2">
//         <MapPin className="w-5 h-5 text-blue-600" />
//         <span className="font-medium text-gray-900">Fund Location</span>
//       </div>
//       <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <span className="font-medium">Latitude:</span> {data.latitude}
//           </div>
//           <div>
//             <span className="font-medium">Longitude:</span> {data.longitude}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const PlaceView = ({ data }: { data: CertificateData }) => (
//   <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
//     <div className="flex items-center gap-2">
//       <Building className="w-5 h-5 text-blue-600" />
//       <span className="font-medium text-gray-900">{data.name}</span>
//     </div>
//     {data.address && (
//       <div className="text-sm text-gray-700 ml-7">
//         <div className="space-y-1">
//           <div>
//             <span className="font-medium">City:</span>{" "}
//             {data.address.addressLocality}
//           </div>
//           <div>
//             <span className="font-medium">Region:</span>{" "}
//             {data.address.addressRegion}
//           </div>
//           <div>
//             <span className="font-medium">Country:</span>{" "}
//             {data.address.addressCountry}
//           </div>
//         </div>
//       </div>
//     )}
//     {data.description && (
//       <p className="text-sm text-gray-700 ml-7 mt-2 italic">
//         {data.description}
//       </p>
//     )}
//   </div>
// );

// const CertificationView = ({ data }: { data: CertificateData }) => {
//   return (
//     <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
//       <div className="flex items-center gap-2">
//         <ShieldCheckIcon className="w-5 h-5 text-green-600" />
//         <span className="font-medium text-gray-900">{data.name}</span>
//       </div>
//       <div className="text-sm text-gray-700 ml-7">
//         <p className="mb-3">{data.description}</p>
//         {data.validFrom && (
//           <div className="flex items-center gap-2 bg-white p-2 rounded border">
//             <Calendar className="w-4 h-4 text-gray-500" />
//             <span>
//               <span className="font-medium">Valid from:</span>{" "}
//               {new Date(data.validFrom).toLocaleDateString()}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const OrganizationView = ({ data }: { data: CertificateData }) => (
//   <div className="space-y-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
//     <div className="flex items-center gap-2">
//       <Building2Icon className="w-5 h-5 text-purple-600" />
//       <span className="font-medium text-gray-900">{data.name}</span>
//     </div>
//     {data.identifier && (
//       <div className="text-sm text-gray-700 ml-7 bg-white p-2 rounded border">
//         <span className="font-medium">{data.identifier.propertyID}:</span>{" "}
//         {data.identifier.value}
//       </div>
//     )}
//   </div>
// );

// const LinkView = ({ data }: { data: CertificateData }) => (
//   <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
//     <div className="flex items-center gap-2">
//       <Link1Icon className="w-5 h-5 text-gray-600" />
//       <span className="font-medium text-gray-900">{data.name}</span>
//     </div>
//     {data.url && (
//       <div className="text-sm ml-7">
//         <a
//           href={data.url}
//           target="_blank"
//           rel="noreferrer"
//           className="text-green-600 hover:text-green-700 underline font-medium break-all"
//         >
//           {data.url}
//         </a>
//       </div>
//     )}
//   </div>
// );

// interface SchemaRendererProps {
//   certificates: CertificateData[];
// }

// export const SchemaRenderer = ({ certificates }: SchemaRendererProps) => {
//   if (!certificates || certificates.length === 0) {
//     return (
//       <Card className="bg-white border border-gray-200 shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-gray-900">
//             Fund Certification Details
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-600">No certification data available</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="bg-white border border-gray-200 shadow-sm">
//       <CardHeader>
//         <CardTitle className="text-gray-900">
//           Fund Certification & Compliance Details
//         </CardTitle>
//         <p className="text-sm text-gray-600">
//           Regulatory compliance and certification information for this fund
//         </p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {certificates.map((obj: CertificateData, index: number) => {
//           switch (obj["@type"]) {
//             case "GeoCoordinates":
//               return <GeoCoordinatesView key={index} data={obj} />;
//             case "Place":
//               return <PlaceView key={index} data={obj} />;
//             case "Certification":
//               return <CertificationView key={index} data={obj} />;
//             case "Organization":
//               return <OrganizationView key={index} data={obj} />;
//             case "Link":
//               return <LinkView key={index} data={obj} />;
//             default:
//               return (
//                 <div
//                   key={index}
//                   className="p-4 bg-gray-50 rounded-lg border border-gray-200"
//                 >
//                   <div className="font-medium text-gray-900">
//                     {obj["@type"]}
//                   </div>
//                   {obj.name && (
//                     <div className="text-sm text-gray-700 mt-1 font-medium">
//                       {obj.name}
//                     </div>
//                   )}
//                   {obj.description && (
//                     <div className="text-sm text-gray-600 mt-1">
//                       {obj.description}
//                     </div>
//                   )}
//                 </div>
//               );
//           }
//         })}
//       </CardContent>
//     </Card>
//   );
// };
