import { useParams } from "react-router";
import { useEffect, useState } from "react";

import { Loading } from "@/components/Loading";
import { getActivityDetails, getActivityRecommendations } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Activity {
  id: string;
  activityType: string;
  duration: number;
  caloriesBurned: number;
  createdAt: string;
}

interface Recommendation {
  id: string;
  userId: string;
  activityId: string;
  activityType: "CYCLING" | "RUNNING" | "WALKING" | string;
  recommendation: string;
  suggestions: string[];
  improvements: string[];
  safety: string[];
  createdAt: string;
  updatedAt: string;
}

const ActivityDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [activity, setActivity] = useState<Activity>();
  const [recommendations, setRecommendations] = useState<Recommendation>();

  useEffect(() => {
    const fetchActivityDetails = async () => {
      if (!id) return;
      try {
        const response = await getActivityDetails(id);
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching activity details:", error);
      }
    };

    const fetchActivityRecommendations = async () => {
      if (!id) return;
      try {
        const response = await getActivityRecommendations(id);
        setRecommendations(response.data);
      } catch (error) {
        console.error("Error fetching activity recommendations:", error);
      }
    };

    fetchActivityDetails();
    fetchActivityRecommendations();
  }, [id]);

  if (!activity && !recommendations) {
    return <Loading />;
  }

  return (
    <div>
      <Card
        key={activity?.id}
        className="cursor-pointer transition-shadow hover:shadow-lg my-6 mx-6"
      >
        <CardHeader>
          <CardTitle className="font-bold text-lg">
            Activity Type: {activity?.activityType}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Duration: {activity?.duration} (minutes)</p>
          <p>Calories Burned: {activity?.caloriesBurned}</p>
          <p>
            Date:{" "}
            {activity?.createdAt
              ? new Date(activity.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </CardContent>
      </Card>
      {recommendations && (
        <Card className="my-6 mx-6">
          <CardHeader>
            <CardTitle>
              <h1 className="text-xl font-bold">AI Recommendations</h1>
              <p className="text-sm text-muted-foreground">
                Analysis of your given activity
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{recommendations.recommendation}</p>
          </CardContent>
          <CardContent>
            <h1 className="text-lg font-semibold">Improvements</h1>
            {recommendations?.improvements?.map((improvement, idx) => (
              <p key={idx}>{improvement}</p>
            ))}
          </CardContent>
          <CardContent>
            <h1 className="text-lg font-semibold">Suggestions</h1>
            {recommendations?.suggestions?.map((suggestion, idx) => (
              <p key={idx}>{suggestion}</p>
            ))}
          </CardContent>
          <CardContent>
            <h1 className="text-lg font-semibold">Safety Guidelines</h1>
            {recommendations?.safety?.map((item, idx) => (
              <p key={idx}>{item}</p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityDetails;
