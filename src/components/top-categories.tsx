import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { category: "Salary", totalAmount: 20000 },
  { category: "Sales", totalAmount: 50000 },
  { category: "Contract", totalAmount: 30000 },
];

const chartConfig = {
  totalAmount: {
    label: "Total Amount",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--foreground))",
  },
} satisfies ChartConfig;

export function TopCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Income Categories</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="totalAmount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="totalAmount"
              layout="vertical"
              fill="var(--color-totalAmount)"
              radius={4}
            >
              <LabelList
                dataKey="category"
                fontWeight={500}
                position="insideLeft"
                offset={8}
                className="fill-[--color-category]"
                fontSize={12}
              />
              {/* <LabelList
                dataKey="totalAmount"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
