export interface PlantHealth {
  health_assessment: {
    diseases: Array<{
      name: string;
      probability: number;
      disease_details: {
        cause: string;
        common_names: string[];
        classification: string;
        treatment: string;
      };
    }>;
    is_healthy: boolean;
    is_healthy_probability: number;
  };
}