const fs = require("fs");
const path = require("path");

const projectDir = path.join(__dirname, "src");

function fixImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      fixImports(fullPath);
    } else if (/\.(js|ts|tsx)$/.test(file.name)) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Fix invalid import paths
      content = content
        .replace(/@@components/g, "@components")
        .replace(/@@contexts/g, "@contexts")
        .replace(/components\//g, "@components/")
        .replace(/contexts\//g, "@contexts/")
        .replace(/\broutes\b/g, "@lib/routes")
        .replace(/utils\//g, "@utils/")
        .replace(/import\s+@lib\/routes\s+from/g, "import routes from '@lib/routes'"); // fix broken import

      fs.writeFileSync(fullPath, content, "utf8");
      console.log(`Fixed: ${fullPath}`);
    }
  }
}

fixImports(projectDir);
console.log("✅ All imports fixed!");
