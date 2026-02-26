"use client";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import modelData from "../../../data/eval-metrics.json";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const AIDashboard = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".model-stat",
      { opacity: 0, y: 1000 },
      { opacity: 1, y: 0, stagger: 0.2, ease: "power1.inOut", duration: 1 },
    );
  }, []);
  const chartData = modelData.test.rocCurve;
  const aucScore = modelData.test.auc * 100;

  const chartConfig = {
    tpr: {
      label: "True Positive Rate",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const xAxisTicks = Array.from({ length: 11 }, (_, i) => i * 0.1);

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-center">
          Model info
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-3 mb-5 mx-auto">
        <Card className="model-stat flex flex-col lg:w-[50%] shadow-lg">
          <CardHeader className="items-center pb-0">
            <CardTitle>AUR-ROC score</CardTitle>
            <CardDescription>
              The AUC-ROC score for the recommendation model
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 text-center ">
            <h2 className="font-bold text-8xl">{aucScore}%</h2>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              This indicates that the model is particularly capable of
              recommending media that match the user's tastes
            </div>
          </CardFooter>
        </Card>
        <Card className="model-stat flex flex-col lg:w-[50%] shadow-lg">
          <CardHeader className="items-center pb-0">
            <CardTitle>Number of samples</CardTitle>
            <CardDescription>
              The number of samples used to train the model
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 text-center ">
            <h2 className="font-bold text-8xl">{modelData.test.samples}</h2>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 leading-none font-medium">
              These samples were obtained from {modelData.test.users} users
            </div>
          </CardFooter>
        </Card>
      </div>
      <Card className="model-stat w-[80%] h-[80%] mx-auto">
        <CardHeader>
          <CardTitle>ROC Curve</CardTitle>
          <CardDescription>Model Performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="fpr"
                type="number"
                domain={[0, 1]}
                ticks={xAxisTicks}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <YAxis
                dataKey="tpr"
                type="number"
                domain={[0, 1]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="tpr"
                type="linear"
                stroke="var(--color-tpr)"
                strokeWidth={2}
                dot={false}
              />

              <Line
                dataKey="fpr"
                data={xAxisTicks.map((t) => ({ fpr: t, tpr: t }))}
                type="linear"
                stroke="var(--muted-foreground)"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            ROC Curve Analysis <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            True Positive Rate vs False Positive Rate
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default AIDashboard;
