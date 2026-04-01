import fs from 'fs';

let content = fs.readFileSync('c:/Users/Carlos/Documents/antigravity/nexus-website/src/app/martech-lab/MartechContent.tsx', 'utf8');

// 1. Remove PDF styles and document
content = content.replace(/function getExecutivePdfStyles\(\) \{[\s\S]*?<\/Document>\s*\)\s*\}\s*/g, '');

// 2. Change function signature and remove activeTab state
content = content.replace(
  /export default function MartechLabPage\(\) \{\r?\n\s+const \[activeTab, setActiveTab\] = useState<Tab>\("Upload de Dados"\)\r?\n/g,
  'export default function MartechContent({ activeTab, setActiveTab }: { activeTab: Tab; setActiveTab: (t: Tab) => void }) {\n'
);

// 3. Update handleExportExecutiveReport
content = content.replace(
  /async function handleExportExecutiveReport\(\) \{[\s\S]*?URL\.revokeObjectURL\(url\)\r?\n\s+\} catch \(error\) \{/g,
  `async function handleExportExecutiveReport() {
    if (!hasAnyData) return

    setIsExportingPdf(true)
    try {
      const { generateAndDownloadPdf } = await import("./exportPdf")
      await generateAndDownloadPdf(overallSummary, warningItems, periodChannelSummaries)
    } catch (error) {`
);

// 4. Transform the return structure to remove Next.js <main>, outer container, header and tabs
content = content.replace(
  /return \(\r?\n\s*<main className="min-h-screen bg-\[#0D0D0D\] px-6 py-10 text-white">\r?\n\s*<div className="mx-auto max-w-7xl">\r?\n\s*<div className="rounded-\[2rem\] border border-white\/10 bg-\[#0b0b0b\] p-10 shadow-\[0_40px_120px_rgba\(0,0,0,0\.35\)\]">\r?\n\s*<div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">[\s\S]*?<div className="mb-10 flex flex-wrap items-center justify-between gap-3">[\s\S]*?<\/div>\r?\n\s*<\/div>\r?\n/g,
  'return (\n    <>\n'
);

content = content.replace(/\s*<\/div>\r?\n\s*<\/div>\r?\n\s*<\/main>\r?\n  \)\r?\n\}\r?\n/g, '\n    </>\n  )\n}\n');

fs.writeFileSync('c:/Users/Carlos/Documents/antigravity/nexus-website/src/app/martech-lab/MartechContent.tsx', content);
