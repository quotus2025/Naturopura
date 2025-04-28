import { useState } from 'react';
import { Upload, AlertCircle, Sprout, Leaf, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import FarmerLayout from '../layouts/FarmerLayout';
import { Badge } from "../ui/badge";

interface DetectionResult {
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
}

const CropHealthDetection = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/api/crops/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to detect crop health');
      }

      const data = await response.json();
      setResult(data.result[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout
      title="Crop Health Detection"
      subtitle="Upload a photo of your crop to detect diseases and get treatment recommendations"
    >
      <div className="grid gap-6">
        <Card className="border-emerald-100">
          <CardHeader className="border-b border-emerald-100 bg-white">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-emerald-600" />
              <CardTitle>Upload Image</CardTitle>
            </div>
            <CardDescription className="text-emerald-700">
              Take a clear photo of the affected plant part (leaf, stem, or fruit)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-gradient-to-br from-emerald-50 to-green-50">
            <div className="grid gap-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-lg p-8 hover:border-green-400 hover:bg-green-50/50 transition-all duration-300">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-64 rounded-lg mb-4 shadow-lg border-4 border-white"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-600 text-white">
                        Change Image
                      </Badge>
                    </div>
                  ) : (
                    <div className="p-8 bg-green-50 rounded-full mb-4">
                      <Upload className="h-12 w-12 text-green-600" />
                    </div>
                  )}
                  <span className="text-sm text-green-700 font-medium">
                    Click to upload or drag and drop
                  </span>
                </label>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!selectedImage || loading}
                className="w-full bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-6"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </div>
                ) : (
                  'Detect Crop Health'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Card className="border-emerald-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-emerald-500 to-green-600">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-white" />
                <CardTitle className="text-white">Detection Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-white">
              <div className="space-y-6">
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold text-green-800 flex items-center gap-2">
                    <Sprout className="h-4 w-4" /> Plant Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-green-700">
                      <span className="font-medium">Name:</span> {result.plant_info.name}
                    </p>
                    <p className="text-green-700">
                      <span className="font-medium">Family:</span> {result.plant_info.family}
                    </p>
                    <Badge className="bg-gradient-to-br from-emerald-500 to-green-600">
                      Confidence: {result.plant_info.confidence}%
                    </Badge>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h3 className="font-semibold text-green-800 flex items-center gap-2">
                    <Leaf className="h-4 w-4" /> Disease Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p className="text-green-700">
                      <span className="font-medium">Disease:</span> {result.disease_name}
                    </p>
                    <Badge className="bg-gradient-to-br from-emerald-500 to-green-600">
                      Confidence: {result.confidence}%
                    </Badge>
                    <p className="text-green-700 mt-2">
                      <span className="font-medium">Description:</span> {result.details.description}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-semibold text-green-800">Treatment</h3>
                    <p className="mt-2 text-green-700">{result.details.treatment}</p>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-semibold text-green-800">Causes</h3>
                    <ul className="mt-2 space-y-1">
                      {result.details.causes.map((cause, index) => (
                        <li key={index} className="text-emerald-700 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-green-600" />
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </FarmerLayout>
  );
};

export default CropHealthDetection;