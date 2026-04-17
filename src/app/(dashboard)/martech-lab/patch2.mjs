import fs from 'fs';

let content = fs.readFileSync('c:/Users/Carlos/Documents/antigravity/nexus-website/src/app/martech-lab/MartechContent.tsx', 'utf8');

// Remove static recharts import
content = content.replace(
  /import \{\s*Area,\s*AreaChart,\s*Bar,\s*BarChart,\s*CartesianGrid,\s*Legend,\s*Line,\s*LineChart,\s*ResponsiveContainer,\s*Tooltip,\s*XAxis,\s*YAxis,?\s*\} from "recharts"/g,
  'import dynamic from "next/dynamic"\nconst DashboardCharts = dynamic(() => import("./DashboardCharts"), { ssr: false, loading: () => <div className="h-[320px] w-full animate-pulse rounded-[2rem] bg-white/5" /> })'
);

// Replace the grid container that holds the BarChart and LineChart with our DashboardCharts component
const chartContainerRegex = /<div className="grid gap-6 xl:grid-cols-2">\r?\n\s*<div className="rounded-\[2rem\] border border-white\/10 bg-\[#111111\] p-6">\r?\n\s*<div className="mb-4 flex items-center justify-between gap-4">[\s\S]*?<\/LineChart>\r?\n\s*<\/ResponsiveContainer>\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>/g;

content = content.replace(
  chartContainerRegex,
  '<DashboardCharts periodTrendData={periodTrendData} />'
);

fs.writeFileSync('c:/Users/Carlos/Documents/antigravity/nexus-website/src/app/martech-lab/MartechContent.tsx', content);
