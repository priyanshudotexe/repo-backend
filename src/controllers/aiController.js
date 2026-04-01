const path = require("path");
const fs = require("fs/promises");
const asyncHandler = require("../utils/asyncHandler");
const datasetService = require("../services/datasetService");
const { parseCsvPreview } = require("../services/csvService");

const REPO_RANDOM_CSV_PATH = path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "random-dataset.csv",
);
const REPO_RANDOM_SUMMARIES_PATH = path.join(
  __dirname,
  "..",
  "..",
  "assets",
  "random-summaries.json",
);

const readRandomSummary = async () => {
  const content = await fs.readFile(REPO_RANDOM_SUMMARIES_PATH, "utf8");
  const summaries = JSON.parse(content);

  if (!Array.isArray(summaries) || summaries.length === 0) {
    return "Basic dataset analysis";
  }

  const index = Math.floor(Math.random() * summaries.length);
  return String(summaries[index]);
};

const suggestMetadata = asyncHandler(async (req, res) => {
  const rawDatasetId = req.body.datasetId;

  if (
    rawDatasetId === undefined ||
    rawDatasetId === null ||
    rawDatasetId === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "datasetId is required",
    });
  }

  if (!Number.isInteger(Number(rawDatasetId))) {
    return res.status(400).json({
      success: false,
      message: "Invalid dataset id",
    });
  }

  const datasetId = Number(rawDatasetId);

  await datasetService.getDatasetById(datasetId);
  const csvInfo = await parseCsvPreview(REPO_RANDOM_CSV_PATH);
  const summary = await readRandomSummary();

  res.json({
    suggestedModality: "tabular",
    suggestedTaskType: "regression",
    numRows: csvInfo.rows,
    numColumns: csvInfo.columns,
    summary,
  });
});

module.exports = {
  suggestMetadata,
};
