import { Pie, PieChart } from "recharts";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
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
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const DashboardInfo = ({ user }) => {
  useGSAP(() => {
    gsap.fromTo(
      ".stat-card",
      { opacity: 0, y: 1000 },
      { opacity: 1, y: 0, stagger: 0.2, ease: "power1.inOut", duration: 1 },
    );
  }, []);

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
  const chartData = [
    {
      difficulty: "very_easy",
      number: user.revisionData.very_easy,
      fill: "var(--color-very_easy)",
    },
    {
      difficulty: "easy",
      number: user.revisionData.easy,
      fill: "var(--color-easy)",
    },
    {
      difficulty: "medium",
      number: user.revisionData.medium,
      fill: "var(--color-medium)",
    },
    {
      difficulty: "hard",
      number: user.revisionData.hard,
      fill: "var(--color-hard)",
    },
    {
      difficulty: "forgotten",
      number: user.revisionData.forgotten,
      fill: "var(--color-forgotten)",
    },
  ];

  const chartConfig = {
    number: {
      label: "Number",
    },
    very_easy: {
      label: "Very Easy",
      color: "var(--chart-2)",
    },
    easy: {
      label: "Easy",
      color: "var(--chart-3)",
    },
    medium: {
      label: "Medium",
      color: "var(--chart-4)",
    },
    hard: {
      label: "Hard",
      color: "var(--chart-5)",
    },
    forgotten: {
      label: "Forgotten",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const pieChartConfig = {
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
    <>
      <h1 className="text-center text-xl font-bold mb-2">Stats</h1>
      <div className="flex flex-row gap-2">
        <Card className="stat-card flex flex-col w-[33%] shadow-lg ">
          <CardHeader className="items-center pb-0">
            <CardTitle>Italian lesson progress</CardTitle>
            <CardDescription>
              This chart shows the total number of italian lessons completed
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={pieChartConfig}
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
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Lessons completed: {user.lessonsCompleted.italian}/51
            </div>
          </CardFooter>
        </Card>
        <Card className="stat-card flex flex-col w-[33%] shadow-lg ">
          <CardHeader className="items-center pb-0">
            <CardTitle>French lesson progress</CardTitle>
            <CardDescription>
              This chart shows the total number of french lessons completed
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={pieChartConfig}
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
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Lessons completed: {user.lessonsCompleted.french}/13
            </div>
          </CardFooter>
        </Card>
        <Card className="stat-card flex flex-col w-[33%] shadow-lg">
          <CardHeader className="items-center pb-0">
            <CardTitle>Current Login Streak</CardTitle>
            <CardDescription>
              {user.streakData.startDate} - {user.streakData.endDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 text-center ">
            <div className="mt-12">
              <h2 className="font-bold text-8xl">
                {user.streakData.currentDuration}
              </h2>
              <p className="font-semibold text-2xl">Days</p>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              Longest streak: {user.streakData.maxDuration} days (
              {user.streakData.maxStartDate} - {user.streakData.maxEndDate})
            </div>
          </CardFooter>
        </Card>
      </div>
      <Card className="stat-card mt-5">
        <CardHeader>
          <CardTitle>Flashcard revision data</CardTitle>
          <CardDescription>
            Here is how many times each option has been selected during
            revison{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="difficulty"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="number"
                strokeWidth={2}
                radius={8}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  );
                }}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardInfo;
