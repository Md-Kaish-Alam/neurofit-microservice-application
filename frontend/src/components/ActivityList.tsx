import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

import { getActivities } from "@/services/api";

import { Loading } from "./Loading";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Activity {
  id: string;
  activityType: string;
  duration: number;
  caloriesBurned: number;
  createdAt: string;
}

const ActivityList = () => {
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (activities.length === 0) {
    return <div className="text-center mt-6">No activities found.</div>;
  }

  if (!activities) {
    return <Loading />;
  }

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {activities?.map((activity) => (
        <Card
          key={activity?.id}
          className="cursor-pointer transition-shadow hover:shadow-lg"
          onClick={() => navigate(`/activities/${activity?.id}`)}
        >
          <CardHeader>
            <CardTitle className="font-bold text-lg">
              Activity Type: {activity?.activityType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Duration: {activity?.duration} (minutes)</p>
            <p>Calories Burned: {activity?.caloriesBurned}</p>
            <p>Date: {new Date(activity?.createdAt).toLocaleString()} </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivityList;
