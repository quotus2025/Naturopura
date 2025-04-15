import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const PLANT_NET_API_KEY = '2b10Lcie6O00HO9Bh78vw78a';
const PLANT_NET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';

export async function POST(request: NextRequest) {
  console.log('Route accessed: /api/farmer/crop');

  try {
    const cookieStore = cookies();
    const token = await cookieStore.get('token');

    if (!token?.value) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    console.log('Sending request to Plant.net API...');

    const formDataForPlantNet = new FormData();
    formDataForPlantNet.append('organs', 'leaf');
    formDataForPlantNet.append('images', imageFile);
    // Removed project parameter

    const plantNetResponse = await fetch(`${PLANT_NET_API_URL}?api-key=${PLANT_NET_API_KEY}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PLANT_NET_API_KEY}`
      },
      body: formDataForPlantNet
    });

    if (!plantNetResponse.ok) {
      const errorText = await plantNetResponse.text();
      console.error('Plant.net API error:', {
        status: plantNetResponse.status,
        body: errorText
      });

      return NextResponse.json(
        {
          error: 'Failed to process image with Plant.net API',
          details: `Status: ${plantNetResponse.status}, Body: ${errorText}`
        },
        { status: plantNetResponse.status }
      );
    }

    const data = await plantNetResponse.json();
    const plantName = data.results?.[0]?.species?.scientificNameWithoutAuthor;

    // Plant diseases and treatments database
    const plantHealthDatabase = {
      'Solanum lycopersicum': {
        diseases: [
          {
            name: 'Early Blight',
            symptoms: 'Dark brown spots with concentric rings on leaves, stems, and fruits',
            treatment: '1. Remove infected leaves\n2. Improve air circulation\n3. Apply copper-based fungicide\n4. Water at the base of plants\n5. Maintain proper plant spacing',
            causes: ['Alternaria solani fungus', 'Warm humid conditions', 'Poor air circulation']
          },
          {
            name: 'Late Blight',
            symptoms: 'Water-soaked spots on leaves, white fuzzy growth underneath',
            treatment: '1. Remove and destroy infected plants\n2. Apply fungicide preventively\n3. Ensure good drainage\n4. Avoid overhead watering\n5. Plant resistant varieties',
            causes: ['Phytophthora infestans', 'Cool, wet conditions', 'Poor air circulation']
          }
        ]
      },
      'Capsicum annuum': {
        diseases: [
          {
            name: 'Bacterial Spot',
            symptoms: 'Small, dark, raised spots on leaves and fruits',
            treatment: '1. Remove infected plants\n2. Use copper-based sprays\n3. Rotate crops\n4. Avoid overhead irrigation',
            causes: ['Xanthomonas bacteria', 'Warm, wet conditions']
          }
        ]
      }
      // Add more plants and their diseases as needed
    };

    const plantHealth = plantHealthDatabase[plantName] || {
      diseases: [{
        name: 'General Health Check',
        symptoms: 'No specific diseases identified',
        treatment: '1. Regular monitoring\n2. Maintain good air circulation\n3. Proper watering practices\n4. Regular fertilization\n5. Pest monitoring',
        causes: ['Regular plant maintenance recommended']
      }]
    };

    return NextResponse.json({
      result: [{
        disease_name: plantHealth.diseases[0].name,
        confidence: Math.round((data.results?.[0]?.score || 0) * 1000) / 10,
        details: {
          description: `${plantHealth.diseases[0].symptoms}\n\nPlant identified: ${(data.results?.[0]?.species?.commonNames || []).join(', ')}`,
          treatment: plantHealth.diseases[0].treatment,
          causes: plantHealth.diseases[0].causes
        },
        plant_info: {
          name: plantName || 'Unknown',
          common_names: data.results?.[0]?.species?.commonNames || [],
          family: data.results?.[0]?.species?.family?.scientificNameWithoutAuthor || 'Unknown',
          genus: data.results?.[0]?.species?.genus?.scientificNameWithoutAuthor || 'Unknown',
          confidence: Math.round((data.results?.[0]?.score || 0) * 1000) / 10
        }
      }]
    });

  } catch (error) {
    console.error('Unhandled error in plant detection:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
