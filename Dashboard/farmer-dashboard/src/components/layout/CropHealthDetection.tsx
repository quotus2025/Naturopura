"use client";

import React, { useState } from 'react';

interface CropHealthResult {
  result: {
    disease_name: string;
    confidence: number;
    details: {
      description: string;
      treatment: string;
      causes: string[];
    };
  }[];
}

const CropHealthDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<CropHealthResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch('/api/farmer/crop-health', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error("Crop health API error:", data);
        throw new Error(data.error || "Failed to detect crop health");
      }

      setResult(data);
    } catch (err) {
      console.error("Error submitting to crop health:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Crop Health Detection</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Crop Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {loading ? 'Analyzing...' : 'Detect Crop Health'}
        </button>
      </form>

      {result && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold">Results</h3>
          {result.result.map((disease, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{disease.disease_name}</h4>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {(disease.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Description:</strong> {disease.details.description}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Treatment:</strong> {disease.details.treatment}
                </p>
                {disease.details.causes && (
                  <p className="text-sm text-gray-600">
                    <strong>Causes:</strong> {disease.details.causes.join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropHealthDetection;
