"use client";

import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import toast from "react-hot-toast";

const SheetUpload = ({ onSheetUpload }) => {
  const [sheetUrl, setSheetUrl] = useState(null);

  const handleUploadComplete = ([file]) => {
    setSheetUrl(file.ufsUrl);
    onSheetUpload?.(file.ufsUrl);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">
        Music Sheet (PDF)
      </label>
      {sheetUrl ? (
        <iframe src={sheetUrl} className="w-full h-96 border rounded-md" />
      ) : (
        <UploadButton
          endpoint="sheetUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(e) => toast.error(`Upload failed: ${e.message}`)}
        />
      )}
    </div>
  );
};

export default SheetUpload;
