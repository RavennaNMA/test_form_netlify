const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const formData = JSON.parse(event.body).payload; // Netlify sends form data under "payload"

    // Generate Markdown content
    const markdownContent = `---
title: "${formData.workNameCN} / ${formData.workNameEN}"
author: "${formData.authorNameCN} / ${formData.authorNameEN}"
year: "${formData.year}"
recordLink: "[觀看影片](${formData.recordLink1})"
description: "${formData.description || 'N/A'}"
submitted_at: "${new Date().toISOString()}"
---

## 作品簡介
${formData.description || "No description provided."}

## 記錄影片
[觀看影片](${formData.recordLink1})

---

*Generated automatically from Netlify Form submission.*
`;

    // Define Markdown file path (Netlify Lambda functions only allow temporary storage)
    const filePath = path.join("/tmp", `submission-${Date.now()}.md`);
    fs.writeFileSync(filePath, markdownContent);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Markdown file created successfully!",
        markdown: markdownContent,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error processing form submission: ${error.message}`,
    };
  }
};
