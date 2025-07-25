import { toast } from "sonner";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { addActivity } from "@/services/api";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";


const ActivityForm = () => {
  const [activityType, setActivityType] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [caloriesBurned, setCaloriesBurned] = useState<number | "">("");
  const [metrics, setMetrics] = useState([{ key: "", value: "" }]);

  const handleAddMetric = () => {
    setMetrics([...metrics, { key: "", value: "" }]);
  };

  const handleRemoveMetric = (index: number) => {
    const updated = [...metrics];
    updated.splice(index, 1);
    setMetrics(updated);
  };

  const handleMetricChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...metrics];
    updated[index][field] = value;
    setMetrics(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activityType || !duration || !caloriesBurned) {
      alert("Please fill all the fields.");
      return;
    }

    const additionalMatrices: Record<string, string> = {};
    metrics.forEach(({ key, value }) => {
      if (key.trim()) additionalMatrices[key] = value;
    });

    const activityData = {
      activityType,
      duration,
      caloriesBurned,
      additionalMatrices,
    };

    try {
      await addActivity(activityData);
      toast("Activity added successfully!");
      window.location.reload(); // Reload to see the new activity
    } catch (error) {
      console.error("Error adding activity:", error);
      toast("Failed to add activity. Please try again.");
    }
  };

  const handleClearForm = () => {
    setActivityType("");
    setDuration("");
    setCaloriesBurned("");
    setMetrics([{ key: "", value: "" }]);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800">
          <Plus className="mr-2" />
          Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center flex flex-col items-center gap-2">
          <h1>Add Activity Details</h1>
          <p className="text-sm text-muted-foreground">
            Please Fill all the fields to get better recommendation.
          </p>
        </DialogTitle>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-4 items-center w-full"
        >
          <Select onValueChange={setActivityType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Activity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Activity Type</SelectLabel>
                <SelectItem value="YOGA">Yoga</SelectItem>
                <SelectItem value="CARDIO">Cardio</SelectItem>
                <SelectItem value="RUNNING">Running</SelectItem>
                <SelectItem value="WALKING">Walking</SelectItem>
                <SelectItem value="CYCLING">Cycling</SelectItem>
                <SelectItem value="SWIMMING">Swimming</SelectItem>
                <SelectItem value="STRETCHING">Stretching</SelectItem>
                <SelectItem value="WEIGHT_TRAINING">Weight Training</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Duration in minutes"
            className="w-full"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />

          <Input
            type="number"
            placeholder="Calories Burned"
            className="w-full"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(Number(e.target.value))}
          />

          {/* Additional Matrices */}
          <div className="w-full">
            <p className="text-sm font-semibold mb-2">
              Additional Metrics (Optional)
            </p>
            {metrics.map((metric, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Metric Name (e.g., distance)"
                  className="w-1/2"
                  value={metric.key}
                  onChange={(e) =>
                    handleMetricChange(index, "key", e.target.value)
                  }
                />
                <Input
                  placeholder="Value (e.g., 5.2)"
                  className="w-1/2"
                  value={metric.value}
                  onChange={(e) =>
                    handleMetricChange(index, "value", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveMetric(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddMetric} className="mt-2">
              <Plus className="mr-1" size={16} />
              Add Metric
            </Button>
          </div>
          <div className="w-full flex items-center justify-between">
            <Button type="button" variant="outline" onClick={handleClearForm}>
              Reset
            </Button>
            <Button
              type="submit"
              className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
            >
              Add Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
