"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "../context/UserContext";
import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserDashboard = () => {
  const { user } = useUser();

  const italianLessonData = [
    {
      label: "completed",
      number: user.lessonsCompleted.italian,
      fill: "var(--color-completed)",
    },
    {
      label: "toComplete",
      number: 51 - user.lessonsCompleted.italian,
      fill: "var(--color-toComplete)",
    },
  ];

  const frenchLessonData = [
    {
      label: "completed",
      number: user.lessonsCompleted.french,
      fill: "var(--color-completed)",
    },
    {
      label: "toComplete",
      number: 13 - user.lessonsCompleted.french,
      fill: "var(--color-toComplete)",
    },
  ];

  const chartConfig = {
    number: {
      label: "Lessons",
    },
    completed: {
      label: "Completed",
      color: "var(--chart-1)",
    },
    toComplete: {
      label: "To complete",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <Tabs defaultValue="stats">
      <TabsList>
        <TabsTrigger value="stats">Stats</TabsTrigger>
        <TabsTrigger value="uploads">Uploads</TabsTrigger>
      </TabsList>

      <TabsContent value="stats">
        <h1>Stats</h1>
        <div className="flex flex-row gap-1">
          <Card className="flex flex-col w-[30%]">
            <CardHeader className="items-center pb-0">
              <CardTitle>Italian lesson progress</CardTitle>
              <CardDescription>
                This chart shows the total number of italian lessons completed
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={italianLessonData}
                    dataKey="number"
                    nameKey="label"
                    stroke="0"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="flex flex-col w-[30%]">
            <CardHeader className="items-center pb-0">
              <CardTitle>French lesson progress</CardTitle>
              <CardDescription>
                This chart shows the total number of french lessons completed
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={frenchLessonData}
                    dataKey="number"
                    nameKey="label"
                    stroke="0"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="uploads"></TabsContent>
    </Tabs>
  );
};

export default UserDashboard;
