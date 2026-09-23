import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCard } from "@/shared/components/FileCard";
import { FileLightbox } from "@/shared/components/FileLightbox";
import { StatTile } from "@/shared/components/StatTile";
import { blobUrlResolver } from "@/shared/utils/previewResolver";
import { ProcessedRepairData, RepairImage } from "@/shared/utils/zipHandler";
import { PreviewSource } from "@filedgr/web-core/preview";
import { motion } from "framer-motion";
import {
  Bike,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Hash,
  Image as ImageIcon,
  Settings,
  User,
  Wrench,
} from "lucide-react";
import React, { useMemo, useState } from "react";

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

const money = (value?: number | null) =>
  value != null ? `$${value.toFixed(2)}` : "N/A";

const imageSource = (image: RepairImage): PreviewSource => ({
  id: image.url ?? image.filename,
  filename: image.filename,
  mimeType: "image/jpeg",
});

/** Field label + value, the way the Details tab lays them out. */
const Field = ({
  label,
  value,
  mono = false,
  icon: Icon,
}: {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
  icon?: React.ElementType;
}) => (
  <div>
    <div className="u-eyebrow">{label}</div>
    <p
      className={`mt-0.5 flex items-center gap-1.5 text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
      {value || "N/A"}
    </p>
  </div>
);

/** One before-or-after tile inside a photo pair. */
const PhotoTile = ({
  image,
  label,
  tone,
  onOpen,
}: {
  image?: RepairImage;
  label: string;
  tone: "status-error" | "status-success";
  onOpen?: () => void;
}) => (
  <div>
    <span
      className={`mb-2 inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tone}`}
    >
      {label}
    </span>
    {image?.url ? (
      <motion.button
        type="button"
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onClick={onOpen}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-border bg-abyss-900/60"
      >
        <img
          src={image.url}
          alt={`${label} ${image.category}`}
          className="aspect-[4/3] w-full object-cover"
        />
        <span className="absolute inset-0 rounded-xl transition-colors group-hover:bg-neon-400/10" />
      </motion.button>
    ) : (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-border bg-abyss-900/60">
        <span className="text-sm text-muted-foreground">
          No {label.toLowerCase()} image
        </span>
      </div>
    )}
  </div>
);

const RepairVisualization: React.FC<RepairVisualizationProps> = ({ data }) => {
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [docIndex, setDocIndex] = useState<number | null>(null);

  const matches = data?.imageMatches ?? [];
  const repairSession = data?.repairData?.[0];
  const documents = data?.documents ?? [];

  // Every before/after photo in display order, so the lightbox can walk them.
  const photos = useMemo(
    () =>
      matches.flatMap((m) =>
        [m.before, m.after].filter((i): i is RepairImage => !!i?.url),
      ),
    [matches],
  );
  const photoSources = useMemo(() => photos.map(imageSource), [photos]);
  const photoIndexOf = (image?: RepairImage) =>
    image ? photos.indexOf(image) : -1;

  const docSources = useMemo<PreviewSource[]>(
    () =>
      documents
        .filter((d) => d.url)
        .map((d) => ({
          id: d.url!,
          filename: d.filename || d.name,
          mimeType: "application/pdf",
        })),
    [documents],
  );

  // Titles repeat when a category has several sets ("Chain" twice), so number
  // only those.
  const categoryCounts = matches.reduce<Record<string, number>>((acc, m) => {
    acc[m.category] = (acc[m.category] ?? 0) + 1;
    return acc;
  }, {});
  const seen: Record<string, number> = {};
  const titleFor = (category: string) => {
    seen[category] = (seen[category] ?? 0) + 1;
    const pretty = category.replace(/_/g, " ");
    return categoryCounts[category] > 1
      ? `${pretty} · set ${seen[category]}`
      : pretty;
  };

  if (!data || (!repairSession && !matches.length && !documents.length)) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No repair data available</p>
      </div>
    );
  }

  const availableTabs: Array<{
    value: string;
    label: string;
    icon: React.ElementType;
  }> = [];
  if (matches.length > 0)
    availableTabs.push({ value: "images", label: "Photos", icon: ImageIcon });
  if (repairSession)
    availableTabs.push({ value: "details", label: "Details", icon: FileText });
  if (documents.length > 0)
    availableTabs.push({ value: "documents", label: "Docs", icon: FileText });
  if (repairSession?.partsUsed?.length)
    availableTabs.push({ value: "parts", label: "Parts", icon: Settings });
  const defaultTab = availableTabs[0]?.value ?? "details";
  const gridCols =
    ["", "grid-cols-1", "grid-cols-2", "grid-cols-3"][availableTabs.length] ??
    "grid-cols-4";

  const parts = repairSession?.partsUsed ?? [];
  const partsTotal = parts.reduce(
    (sum, p) => sum + (p.cost ?? 0) * (p.quantity ?? 1),
    0,
  );

  return (
    <div className="space-y-6">
      {repairSession && (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
            {
              icon: Bike,
              label: "Motorcycle",
              value:
                [
                  repairSession.vehicleInfo.year,
                  repairSession.vehicleInfo.make,
                  repairSession.vehicleInfo.model,
                ]
                  .filter(Boolean)
                  .join(" ") || "N/A",
              tone: "primary" as const,
            },
            {
              icon: Wrench,
              label: "Service type",
              value: repairSession.repairInfo.type || "General service",
              tone: "success" as const,
            },
            {
              icon: DollarSign,
              label: "Total cost",
              value: money(repairSession.repairInfo.cost),
              tone: "warning" as const,
            },
            {
              icon: Clock,
              label: "Labour hours",
              value: repairSession.repairInfo.laborHours
                ? `${repairSession.repairInfo.laborHours}h`
                : "N/A",
              tone: "neutral" as const,
            },
          ].map((card) => (
            <motion.div key={card.label} variants={staggerItem}>
              <StatTile {...card} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div {...fadeIn} transition={{ duration: 0.4, delay: 0.2 }}>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList
            className={`grid w-full ${gridCols} gap-1 rounded-xl border border-border bg-steel-800 p-1`}
          >
            {availableTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 rounded-lg text-xs data-[state=active]:bg-steel-700 data-[state=active]:text-glow-50 sm:text-sm"
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Photos */}
          <TabsContent value="images" className="mt-6">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              {matches.map((match, index) => (
                <motion.div key={index} variants={staggerItem}>
                  <Card className="overflow-hidden">
                    <CardHeader className="px-5 pb-3 pt-4">
                      <CardTitle className="flex items-center gap-2 text-sm capitalize">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        {titleFor(match.category)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <PhotoTile
                          image={match.before}
                          label="Before"
                          tone="status-error"
                          onOpen={() =>
                            setPhotoIndex(photoIndexOf(match.before))
                          }
                        />
                        <PhotoTile
                          image={match.after}
                          label="After"
                          tone="status-success"
                          onOpen={() =>
                            setPhotoIndex(photoIndexOf(match.after))
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details" className="mt-6">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            >
              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Bike className="h-4 w-4 text-primary" />
                      Motorcycle information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        label="Make"
                        value={repairSession?.vehicleInfo.make}
                      />
                      <Field
                        label="Model"
                        value={repairSession?.vehicleInfo.model}
                      />
                      <Field
                        label="Year"
                        value={repairSession?.vehicleInfo.year}
                      />
                      <Field
                        label="Mileage"
                        value={repairSession?.vehicleInfo.mileage}
                      />
                      <div className="col-span-2">
                        <Field
                          label="VIN"
                          value={repairSession?.vehicleInfo.vin}
                          mono
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={staggerItem}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Wrench className="h-4 w-4 text-trellis-400" />
                      Service information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    <Field
                      label="Service date"
                      value={repairSession?.repairInfo.date}
                      icon={Calendar}
                    />
                    <Field
                      label="Technician"
                      value={repairSession?.repairInfo.technician}
                      icon={User}
                    />
                    <div>
                      <div className="u-eyebrow">Description</div>
                      <p className="mt-0.5 text-sm leading-relaxed text-mist-100">
                        {repairSession?.repairInfo.description || "N/A"}
                      </p>
                    </div>
                    <Field
                      label="Warranty"
                      value={repairSession?.repairInfo.warranty}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="mt-6">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 gap-4 md:grid-cols-3"
            >
              {docSources.map((source, index) => (
                <motion.div key={source.id} variants={staggerItem}>
                  <FileCard
                    source={source}
                    resolver={blobUrlResolver}
                    onOpen={() => setDocIndex(index)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          {/* Parts */}
          <TabsContent value="parts" className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Parts used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-x-6 px-3 pb-2 md:grid">
                  {["Part", "Qty", "Warranty", "Cost"].map((h) => (
                    <div key={h} className="u-eyebrow last:text-right">
                      {h}
                    </div>
                  ))}
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="divide-y divide-border"
                >
                  {parts.map((part, index) => (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="grid gap-x-6 gap-y-1 px-3 py-3 transition-colors hover:bg-steel-700/40 md:grid-cols-[1fr_auto_auto_auto] md:items-center"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground">
                          {part.partName}
                        </div>
                        {part.partNumber && (
                          <div className="mt-0.5 flex items-center gap-1 font-mono text-xs text-muted-foreground">
                            <Hash className="h-3 w-3" />
                            {part.partNumber}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-mist-200">
                        <span className="md:hidden">Qty </span>
                        {part.quantity ?? 1}
                      </div>
                      <div>
                        {part.warranty && (
                          <span className="inline-flex rounded-md border border-border bg-steel-700 px-2 py-0.5 text-[11px] text-mist-200">
                            {part.warranty}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-glow-50 md:text-right">
                        {money(part.cost)}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="mt-2 flex items-center justify-between border-t border-primary/30 px-3 pt-3">
                  <span className="u-eyebrow">Parts total</span>
                  <span className="text-base font-medium text-glow-50">
                    {money(partsTotal)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <FileLightbox
        items={photoSources}
        index={photoIndex}
        resolver={blobUrlResolver}
        onClose={() => setPhotoIndex(null)}
        onIndexChange={setPhotoIndex}
      />
      <FileLightbox
        items={docSources}
        index={docIndex}
        resolver={blobUrlResolver}
        onClose={() => setDocIndex(null)}
        onIndexChange={setDocIndex}
      />
    </div>
  );
};

export default RepairVisualization;
