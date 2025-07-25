export type Activity = {
  activityType: string;
  duration: number;
  caloriesBurned: number;
  additionalMatrices: Record<string, string | number>;
};
