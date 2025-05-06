"use client";

import { useState, useEffect } from "react";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { X, Music } from "lucide-react";
import toast from "react-hot-toast";

export default function UploadAudio({ onChange, existingAudio = null }) {
  const [uploadedAudio, setUploadedAudio] = useState(existingAudio || null);

  // Sync with parent component when existingAudio changes
  useEffect(() => {
    const loadProxiedAudio = async () => {
      if (!uploadedAudio?.serverData?.url) return;

      const res = await fetch("/api/audio-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadedAudio.serverData.url }),
      });

      if (!res.ok) return toast.error("Failed to load audio");

      const blob = await res.blob();
      const tempUrl = URL.createObjectURL(blob);
      setUploadedAudio((prev) => ({
        ...prev,
        proxyUrl: tempUrl,
      }));
    };

    loadProxiedAudio();
  }, [uploadedAudio?.serverData?.url]);

  // Handle successful upload
  const handleUploadComplete = (res) => {
    if (res && res.length > 0) {
      const audioFile = res[0]; // Only take the first file since we allow single upload
      setUploadedAudio(audioFile);
      onChange(audioFile);
      toast.success("Audio Upload Completed");
    }
  };

  // Remove uploaded audio
  const removeAudio = () => {
    setUploadedAudio(null);
    onChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Display uploaded audio */}
      {uploadedAudio && (
        <div className="mt-4 flex flex-col items-center">
          <div className="relative group w-full max-w-md">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Music size={18} className="text-indigo-600 mr-2" />
                  <span className="font-medium text-indigo-800 truncate max-w-xs">
                    {uploadedAudio.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeAudio}
                  className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
              <audio controls>
                <source
                  src={uploadedAudio.serverData?.url}
                  type={uploadedAudio.type || "audio/mpeg"}
                />
              </audio>

              <div className="text-xs text-indigo-500 mt-1">
                {(uploadedAudio.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      <div className="flex flex-col items-center">
        <UploadDropzone
          endpoint="audioUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error) => {
            toast.error(`Upload Error: ${error.message}`);
          }}
          className="ut-label:text-indigo-600 
                     ut-allowed-content:text-indigo-400 
                     ut-button:bg-indigo-600 
                     ut-button:hover:bg-indigo-700 
                     border-indigo-300 
                     hover:border-indigo-400"
          config={{
            mode: "manual",
          }}
        />
      </div>

      {!uploadedAudio && (
        <div className="flex items-center justify-center p-4 border border-dashed border-indigo-300 rounded-lg bg-indigo-50 text-indigo-500">
          <Music size={18} className="mr-2 opacity-70" />
          <span className="text-sm">No audio selected</span>
        </div>
      )}
    </div>
  );
}
