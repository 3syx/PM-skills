const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} = require("docx");

const INPUT = path.join(__dirname, "..", "brainstorming-mmba-plan.md");
const OUTPUT = path.join(
  __dirname,
  "..",
  "电销系统对接MMBA工作手机方案.docx"
);

// ── helpers ──────────────────────────────────────────────

function parseInlineRuns(text, baseOpts = {}) {
  const runs = [];
  // split by **bold**, ~~strike~~, `code`
  const re = /(\*\*(.+?)\*\*)|(~~(.+?)~~)|(`([^`]+?)`)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      runs.push(new TextRun({ text: text.slice(last, m.index), ...baseOpts }));
    }
    if (m[2]) {
      runs.push(new TextRun({ text: m[2], bold: true, ...baseOpts }));
    } else if (m[4]) {
      runs.push(
        new TextRun({
          text: m[4],
          strike: true,
          color: "999999",
          ...baseOpts,
        })
      );
    } else if (m[6]) {
      runs.push(
        new TextRun({
          text: m[6],
          font: "Consolas",
          size: 20,
          color: "C7254E",
          ...baseOpts,
        })
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    runs.push(new TextRun({ text: text.slice(last), ...baseOpts }));
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text: text || "", ...baseOpts }));
  }
  return runs;
}

function makeParagraph(text, options = {}) {
  return new Paragraph({ children: parseInlineRuns(text), ...options });
}

// ── parse markdown into blocks ───────────────────────────

function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // heading
    const hm = line.match(/^(#{1,4})\s+(.*)/);
    if (hm) {
      const level = hm[1].length; // 1-4
      blocks.push({ type: "heading", level, text: hm[2] });
      i++;
      continue;
    }

    // code block
    if (line.trim().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", text: codeLines.join("\n") });
      continue;
    }

    // table (starts with |)
    if (line.trim().startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      // parse table
      const rows = [];
      for (const tl of tableLines) {
        const cells = tl
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c !== "");
        // skip separator row (---)
        if (cells.every((c) => /^[-:]+$/.test(c))) continue;
        rows.push(cells);
      }
      if (rows.length > 0) {
        blocks.push({ type: "table", rows });
      }
      continue;
    }

    // blockquote
    if (line.trim().startsWith(">")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: quoteLines.join("\n") });
      continue;
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "list", items: listItems });
      continue;
    }

    // checkbox list
    if (/^\s*-\s+\[[ x]\]\s+/.test(line)) {
      const listItems = [];
      while (i < lines.length && /^\s*-\s+\[[ x]\]\s+/.test(lines[i])) {
        const checked = lines[i].includes("[x]");
        const text = lines[i].replace(/^\s*-\s+\[[ x]\]\s+/, "");
        listItems.push({ text, checked });
        i++;
      }
      blocks.push({ type: "checklist", items: listItems });
      continue;
    }

    // horizontal rule
    if (/^---+$/.test(line.trim())) {
      i++;
      continue;
    }

    // normal paragraph
    blocks.push({ type: "paragraph", text: line });
    i++;
  }

  return blocks;
}

// ── convert blocks to docx elements ─────────────────────

function blocksToDocx(blocks) {
  const children = [];

  for (const block of blocks) {
    switch (block.type) {
      case "heading": {
        const levelMap = {
          1: HeadingLevel.HEADING_1,
          2: HeadingLevel.HEADING_2,
          3: HeadingLevel.HEADING_3,
          4: HeadingLevel.HEADING_4,
        };
        children.push(
          new Paragraph({
            children: parseInlineRuns(block.text),
            heading: levelMap[block.level] || HeadingLevel.HEADING_4,
            spacing: { before: 240, after: 120 },
          })
        );
        break;
      }

      case "paragraph": {
        children.push(
          new Paragraph({
            children: parseInlineRuns(block.text),
            spacing: { after: 80 },
          })
        );
        break;
      }

      case "quote": {
        for (const ql of block.text.split("\n")) {
          children.push(
            new Paragraph({
              children: parseInlineRuns(ql.trim(), { italics: true, color: "555555" }),
              indent: { left: 400 },
              spacing: { after: 40 },
              border: {
                left: {
                  style: BorderStyle.SINGLE,
                  size: 6,
                  color: "BBBBBB",
                  space: 10,
                },
              },
            })
          );
        }
        break;
      }

      case "code": {
        const codeLines = block.text.split("\n");
        for (const cl of codeLines) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: cl || " ",
                  font: "Consolas",
                  size: 18,
                  color: "333333",
                }),
              ],
              spacing: { after: 0, line: 276 },
              indent: { left: 300 },
              shading: {
                type: ShadingType.SOLID,
                color: "F5F5F5",
                fill: "F5F5F5",
              },
            })
          );
        }
        // spacing after code block
        children.push(new Paragraph({ spacing: { after: 80 } }));
        break;
      }

      case "list": {
        for (const item of block.items) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: "•  " }),
                ...parseInlineRuns(item),
              ],
              indent: { left: 400 },
              spacing: { after: 40 },
            })
          );
        }
        break;
      }

      case "checklist": {
        for (const item of block.items) {
          const prefix = item.checked ? "☑  " : "☐  ";
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: prefix }),
                ...parseInlineRuns(item.text),
              ],
              indent: { left: 400 },
              spacing: { after: 40 },
            })
          );
        }
        break;
      }

      case "table": {
        const { rows } = block;
        if (rows.length === 0) break;
        const colCount = Math.max(...rows.map((r) => r.length));

        const tableRows = rows.map((row, ri) => {
          const cells = [];
          for (let ci = 0; ci < colCount; ci++) {
            const cellText = row[ci] || "";
            const isHeader = ri === 0;
            cells.push(
              new TableCell({
                children: [
                  new Paragraph({
                    children: parseInlineRuns(cellText, {
                      bold: isHeader,
                      size: isHeader ? 21 : 20,
                    }),
                    spacing: { after: 0 },
                  }),
                ],
                shading: isHeader
                  ? {
                      type: ShadingType.SOLID,
                      color: "E8EDF2",
                      fill: "E8EDF2",
                    }
                  : undefined,
                margins: {
                  top: 40,
                  bottom: 40,
                  left: 80,
                  right: 80,
                },
              })
            );
          }
          return new TableRow({ children: cells });
        });

        children.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
        children.push(new Paragraph({ spacing: { after: 80 } }));
        break;
      }
    }
  }

  return children;
}

// ── main ─────────────────────────────────────────────────

async function main() {
  console.log("Reading:", INPUT);
  const md = fs.readFileSync(INPUT, "utf-8");

  console.log("Parsing markdown...");
  const blocks = parseMarkdown(md);

  console.log("Generating Word document...");
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Microsoft YaHei", size: 22 },
        },
        heading1: {
          run: { font: "Microsoft YaHei", size: 36, bold: true, color: "1F2937" },
          paragraph: { spacing: { before: 360, after: 200 } },
        },
        heading2: {
          run: { font: "Microsoft YaHei", size: 30, bold: true, color: "1F4E79" },
          paragraph: { spacing: { before: 300, after: 160 } },
        },
        heading3: {
          run: { font: "Microsoft YaHei", size: 26, bold: true, color: "2E75B6" },
          paragraph: { spacing: { before: 240, after: 120 } },
        },
        heading4: {
          run: { font: "Microsoft YaHei", size: 24, bold: true, color: "404040" },
          paragraph: { spacing: { before: 200, after: 100 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
          },
        },
        children: blocksToDocx(blocks),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT, buffer);
  console.log("Done! Saved to:", OUTPUT);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
