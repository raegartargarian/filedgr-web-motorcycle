import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileThumbnailButton } from "@/shared/components/FileThumbnailButton";
import { blobUrlResolver } from "@/shared/utils/previewResolver";
import { ProcessedRepairData } from "@/shared/utils/zipHandler";
import { FilePreview } from "@filedgr/web-core/preview";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Car,
  Clock,
  DollarSign,
  Download,
  FileText,
  Hash,
  Image as ImageIcon,
  Maximize2,
  Settings,
  User,
  Wrench,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface RepairVisualizationProps {
  data: ProcessedRepairData;
}

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const RepairVisualization: React.FC<RepairVisualizationProps> = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<{
    url: string;
    name: string;
    filename: string;
  } | null>(null);

  if (
    !data ||
    (!data.repairData?.length &&
      !data.images?.length &&
      !data.documents?.length)
  ) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No repair data available</p>
      </div>
    );
  }

  const repairSession = data.repairData[0];

  // Compute which tabs have data
  const availableTabs: Array<{
    value: string;
    label: string;
    icon: React.ElementType;
  }> = [];
  if (data.imageMatches && data.imageMatches.length > 0) {
    availableTabs.push({ value: "images", label: "Photos", icon: ImageIcon });
  }
  if (repairSession) {
    availableTabs.push({ value: "details", label: "Details", icon: FileText });
  }
  if (data.documents && data.documents.length > 0) {
    availableTabs.push({ value: "documents", label: "Docs", icon: FileText });
  }
  if (repairSession?.partsUsed && repairSession.partsUsed.length > 0) {
    availableTabs.push({ value: "parts", label: "Parts", icon: Settings });
  }
  const defaultTab = availableTabs[0]?.value ?? "details";
  const gridCols =
    availableTabs.length === 1
      ? "grid-cols-1"
      : availableTabs.length === 2
        ? "grid-cols-2"
        : availableTabs.length === 3
          ? "grid-cols-3"
          : "grid-cols-4";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {repairSession && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            {
              icon: Car,
              label: "Vehicle",
              value:
                [
                  repairSession.vehicleInfo.year,
                  repairSession.vehicleInfo.make,
                  repairSession.vehicleInfo.model,
                ]
                  .filter(Boolean)
                  .join(" ") || "N/A",
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              icon: Wrench,
              label: "Service Type",
              value: repairSession.repairInfo.type || "General Service",
              color: "text-green-600",
              bg: "bg-green-50",
              border: "border-green-100",
            },
            {
              icon: DollarSign,
              label: "Total Cost",
              value: repairSession.repairInfo.cost
                ? `$${repairSession.repairInfo.cost.toFixed(2)}`
                : "N/A",
              color: "text-emerald-700",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              icon: Clock,
              label: "Labor Hours",
              value: repairSession.repairInfo.laborHours
                ? `${repairSession.repairInfo.laborHours}h`
                : "N/A",
              color: "text-orange-600",
              bg: "bg-orange-50",
              border: "border-orange-100",
            },
          ].map((card) => (
            <motion.div key={card.label} variants={staggerItem}>
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${card.bg} border ${card.border} flex items-center justify-center flex-shrink-0`}
                    >
                      <card.icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                        {card.label}
                      </div>
                      <div className="text-sm font-bold text-gray-900 truncate">
                        {card.value}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList
            className={`grid w-full ${gridCols} bg-gray-100 gap-1 p-1 rounded-xl`}
          >
            {availableTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm"
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Before/After Photos */}
          <TabsContent value="images" className="mt-6">
            {data.imageMatches && data.imageMatches.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="space-y-6"
              >
                {data.imageMatches.map((match, index) => (
                  <motion.div key={index} variants={staggerItem}>
                    <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                      <CardHeader className="pb-3 pt-4 px-5">
                        <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          {match.category.replace(/_/g, " ")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Before */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[11px] font-semibold uppercase tracking-wide border border-red-100">
                                Before
                              </span>
                            </div>
                            {match.before ? (
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                                className="relative cursor-pointer rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                                onClick={() =>
                                  setSelectedImage(match.before!.url!)
                                }
                              >
                                <img
                                  src={match.before.url}
                                  alt={`Before ${match.category}`}
                                  className="w-full aspect-[4/3] object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors rounded-xl" />
                              </motion.div>
                            ) : (
                              <div className="w-full aspect-[4/3] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                                <span className="text-gray-400 text-sm">
                                  No before image
                                </span>
                              </div>
                            )}
                          </div>

                          {/* After */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-[11px] font-semibold uppercase tracking-wide border border-green-100">
                                After
                              </span>
                            </div>
                            {match.after ? (
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                }}
                                className="relative cursor-pointer rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                                onClick={() =>
                                  setSelectedImage(match.after!.url!)
                                }
                              >
                                <img
                                  src={match.after.url}
                                  alt={`After ${match.category}`}
                                  className="w-full aspect-[4/3] object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors rounded-xl" />
                              </motion.div>
                            ) : (
                              <div className="w-full aspect-[4/3] bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                                <span className="text-gray-400 text-sm">
                                  No after image
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </TabsContent>

          {/* Details */}
          <TabsContent value="details" className="mt-6">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <motion.div variants={staggerItem}>
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Car className="w-4 h-4 text-blue-600" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          label: "Make",
                          value: repairSession?.vehicleInfo.make,
                        },
                        {
                          label: "Model",
                          value: repairSession?.vehicleInfo.model,
                        },
                        {
                          label: "Year",
                          value: repairSession?.vehicleInfo.year,
                        },
                        {
                          label: "Mileage",
                          value: repairSession?.vehicleInfo.mileage,
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                            {item.label}
                          </label>
                          <p className="text-sm text-gray-900 font-medium">
                            {item.value || "N/A"}
                          </p>
                        </div>
                      ))}
                      <div className="col-span-2">
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                          VIN
                        </label>
                        <p className="text-sm text-gray-900 font-mono">
                          {repairSession?.vehicleInfo.vin || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Wrench className="w-4 h-4 text-green-600" />
                      Service Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                    {[
                      {
                        icon: Calendar,
                        label: "Service Date",
                        value: repairSession?.repairInfo.date,
                      },
                      {
                        icon: User,
                        label: "Technician",
                        value: repairSession?.repairInfo.technician,
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                          {item.label}
                        </label>
                        <p className="text-sm text-gray-900 flex items-center gap-1.5 font-medium">
                          <item.icon className="w-3.5 h-3.5 text-gray-400" />
                          {item.value || "N/A"}
                        </p>
                      </div>
                    ))}
                    <div>
                      <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                        Description
                      </label>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {repairSession?.repairInfo.description || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                        Warranty
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {repairSession?.repairInfo.warranty || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="mt-6">
            {data.documents && data.documents.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {data.documents.map((doc, index) => (
                  <motion.div key={index} variants={staggerItem}>
                    <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                      <CardContent className="p-0">
                        <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 text-sm capitalize flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            {doc.name}
                          </h4>
                          <div className="flex items-center gap-3">
                            {doc.url && (
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedPdf({
                                    url: doc.url!,
                                    name: doc.name,
                                    filename: doc.filename || doc.name,
                                  })
                                }
                                className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs font-medium"
                              >
                                <Maximize2 className="w-3 h-3" />
                                Full screen
                              </button>
                            )}
                            <a
                              href={doc.url}
                              download={doc.filename}
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </a>
                          </div>
                        </div>
                        <div className="relative bg-gray-50 h-80">
                          {doc.url && (
                            <FileThumbnailButton
                              source={{
                                id: doc.url,
                                filename: doc.filename || doc.name,
                                mimeType: "application/pdf",
                              }}
                              resolver={blobUrlResolver}
                              onOpen={() =>
                                setSelectedPdf({
                                  url: doc.url!,
                                  name: doc.name,
                                  filename: doc.filename || doc.name,
                                })
                              }
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </TabsContent>

          {/* Parts */}
          <TabsContent value="parts" className="mt-6">
            {repairSession?.partsUsed && repairSession.partsUsed.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      Parts Used
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {repairSession.partsUsed.map((part, index) => (
                        <motion.div
                          key={index}
                          variants={staggerItem}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors gap-2"
                        >
                          <div className="min-w-0">
                            <h4 className="text-sm font-medium text-gray-900">
                              {part.partName}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-0.5">
                              {part.partNumber && (
                                <span className="flex items-center gap-0.5">
                                  <Hash className="w-2.5 h-2.5" />
                                  {part.partNumber}
                                </span>
                              )}
                              {part.quantity && (
                                <span>Qty: {part.quantity}</span>
                              )}
                              {part.warranty && (
                                <span>Warranty: {part.warranty}</span>
                              )}
                            </div>
                          </div>
                          {part.cost != null && (
                            <div className="text-sm font-bold text-gray-900 flex-shrink-0">
                              ${part.cost.toFixed(2)}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage}
                alt="Repair photo"
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-page PDF preview */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={() => setSelectedPdf(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="relative flex flex-col w-full h-full max-w-6xl bg-white rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
                <h3 className="text-sm font-semibold text-gray-900 capitalize flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{selectedPdf.name}</span>
                </h3>
                <div className="flex items-center gap-4 shrink-0">
                  <a
                    href={selectedPdf.url}
                    download={selectedPdf.filename}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedPdf(null)}
                    aria-label="Close"
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF body */}
              <div className="flex-1 min-h-0 bg-gray-50">
                <FilePreview
                  source={{
                    id: selectedPdf.url,
                    filename: selectedPdf.filename,
                    mimeType: "application/pdf",
                  }}
                  resolver={blobUrlResolver}
                  className="fdgr-host h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RepairVisualization;
