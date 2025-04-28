import { Request, Response } from 'express';
import fetch from 'node-fetch';
import FormData from 'form-data';

const PLANT_NET_API_KEY='2b10Lcie6O00HO9Bh78vw78a';
const PLANT_NET_API_URL = 'https://my-api.plantnet.org/v2/identify/all';



if (!PLANT_NET_API_KEY) {
  throw new Error('PLANT_NET_API_KEY is not defined in the environment variables.');
}

interface DiseaseInfo {
  name: string;
  symptoms: string;
  treatment: string;
  causes: string[];
}

const plantHealthDatabase: Record<string, { diseases: DiseaseInfo[] }> = {
  'Solanum lycopersicum': {
    diseases: [
      {
        name: 'Early Blight',
        symptoms: 'Dark brown spots with concentric rings on leaves, stems and fruits. Lesions have yellow margins. Lower leaves are affected first.',
        treatment: 'Remove infected leaves, apply copper-based fungicide, ensure proper plant spacing for air circulation, mulch soil to prevent splash.',
        causes: ['Alternaria solani fungus', 'Warm humid conditions', 'Poor air circulation', 'Leaf wetness']
      },
      {
        name: 'Late Blight',
        symptoms: 'Water-soaked spots on leaves turning brown, white fuzzy growth underneath, dark brown lesions on stems and fruits.',
        treatment: 'Remove infected plants immediately, apply fungicide preventively, avoid overhead watering, maintain good air flow.',
        causes: ['Phytophthora infestans', 'Cool wet conditions', 'High humidity']
      }
    ]
  },
  'Capsicum annuum': {
    diseases: [
      {
        name: 'Bacterial Spot',
        symptoms: 'Small, circular dark spots on leaves and fruits. Spots may have yellow halos. Leaves may yellow and drop.',
        treatment: 'Remove infected plants, use copper-based sprays, rotate crops, avoid overhead irrigation.',
        causes: ['Xanthomonas bacteria', 'Warm wet conditions', 'Splashing water']
      },
      {
        name: 'Powdery Mildew',
        symptoms: 'White powdery coating on leaves, stunted growth, leaf curling and yellowing.',
        treatment: 'Improve air circulation, apply sulfur-based fungicide, remove infected parts.',
        causes: ['Leveillula taurica fungus', 'High humidity', 'Moderate temperatures']
      }
    ]
  },
  'Mangifera indica': {
    diseases: [
      {
        name: 'Anthracnose',
        symptoms: 'Dark spots on leaves, flowers, and fruits. Black lesions on fruits that may lead to rot.',
        treatment: 'Prune affected areas, apply fungicide during flowering, maintain tree hygiene.',
        causes: ['Colletotrichum gloeosporioides', 'High humidity', 'Rainfall during flowering']
      }
    ]
  },
  'Oryza sativa': {
    diseases: [
      {
        name: 'Blast Disease',
        symptoms: 'Diamond-shaped lesions on leaves, neck rot, panicle damage.',
        treatment: 'Use resistant varieties, apply fungicide, maintain balanced fertilization.',
        causes: ['Magnaporthe oryzae', 'High humidity', 'Nitrogen excess']
      }
    ]
  }
};

export const detectCropHealth = async (req: Request, res: Response) => {
  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const formData = new FormData();
    formData.append('organs', 'leaf');
    formData.append('images', imageFile.buffer, imageFile.originalname);

    const plantNetResponse = await fetch(`${PLANT_NET_API_URL}?api-key=${PLANT_NET_API_KEY}`, {
      method: 'POST',
      body: formData as any
    });

    if (!plantNetResponse.ok) {
      const errorText = await plantNetResponse.text();
      return res.status(plantNetResponse.status).json({
        error: 'Failed to process image with PlantNet API',
        details: errorText
      });
    }

    const data = await plantNetResponse.json();
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({
        error: 'No plant identified',
        details: 'Unable to identify the plant species from the image.'
      });
    }

    const plantName = data.results[0].species.scientificNameWithoutAuthor;
    const diseaseInfo = plantHealthDatabase[plantName] || {
      diseases: [
        {
          name: 'General Health Check',
          symptoms: 'No specific diseases identified',
          treatment: 'General good practices...',
          causes: ['Unknown or healthy plant']
        }
      ]
    };

    return res.status(200).json({
      result: [
        {
          disease_name: diseaseInfo.diseases[0].name,
          confidence: Math.round((data.results[0].score || 0) * 1000) / 10,
          details: {
            description: diseaseInfo.diseases[0].symptoms,
            treatment: diseaseInfo.diseases[0].treatment,
            causes: diseaseInfo.diseases[0].causes
          },
          plant_info: {
            name: plantName || 'Unknown',
            common_names: data.results[0].species.commonNames || [],
            family: data.results[0].species.family?.scientificNameWithoutAuthor || 'Unknown',
            genus: data.results[0].species.genus?.scientificNameWithoutAuthor || 'Unknown',
            confidence: Math.round((data.results[0].score || 0) * 1000) / 10
          }
        }
      ]
    });
  } catch (error) {
    console.error('Unhandled error in crop health detection:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unexpected error'
    });
  }
};
