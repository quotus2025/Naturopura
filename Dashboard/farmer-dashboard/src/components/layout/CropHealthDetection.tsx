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
    plant_info: {
      name: string;
      common_names: string[];
      family: string;
      genus: string;
      confidence: number;
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
      
      // Add a console.log to verify the request
      console.log('Sending request to:', '/api/farmer/crop');
      
      const res = await fetch('/api/farmer/crop', {
        method: 'POST',
        body: formData,
        credentials: 'include'  // Add this line
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
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Crop Health Analysis</h2>
        <p className="text-gray-600">Upload a photo of your crop to detect diseases and get treatment recommendations</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="space-y-4">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="text-green-600 font-medium">Click to upload</span> or drag and drop
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
              {file && (
                <div className="text-sm text-green-600">Selected: {file.name}</div>
              )}
            </div>
          </label>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02]
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </div>
          ) : 'Analyze Crop Health'}
        </button>
      </form>

      {result && (
        <div className="mt-12 space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h3>
          {result.result.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Plant Information Section */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 mb-2">Plant Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-700">Scientific Name: {item.plant_info.name}</p>
                    <p className="text-sm text-green-700">Common Names: {item.plant_info.common_names.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Family: {item.plant_info.family}</p>
                    <p className="text-sm text-green-700">Genus: {item.plant_info.genus}</p>
                    <p className="text-sm text-green-700">Identification Confidence: {item.plant_info.confidence}%</p>
                  </div>
                </div>
              </div>

              {/* Disease Information Section */}
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-semibold text-gray-800">{item.disease_name}</h4>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {item.confidence}% confidence
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2">Description</h5>
                  <p className="text-gray-600">{item.details.description}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-700 mb-2">Treatment</h5>
                  <p className="text-gray-600 whitespace-pre-line">{item.details.treatment}</p>
                </div>
                {item.details.causes && item.details.causes.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">Causes</h5>
                    <ul className="list-disc list-inside text-gray-600">
                      {item.details.causes.map((cause, i) => (
                        <li key={i}>{cause}</li>
                      ))}
                    </ul>
                  </div>
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
