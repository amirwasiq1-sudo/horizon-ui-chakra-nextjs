const fs = require("fs");
const path = require("path");

const adminDir = path.join(__dirname, "src");

function fixImports(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      fixImports(fullPath);
    } else if (/\.(js|ts|tsx)$/.test(file.name)) {
      let content = fs.readFileSync(fullPath, "utf8");

      // Replace imports
      content = content
        .replace(/@@@components/g, "@components")
        .replace(/components\//g, "@components/")
        .replace(/contexts\//g, "@contexts/")
        .replace(/\broutes\b/g, "@lib/routes")
        .replace(/utils\//g, "@utils/");

      fs.writeFileSync(fullPath, content, "utf8");
      console.log(`Fixed imports: ${fullPath}`);
    }
  }
}

fixImports(adminDir);
console.log("✅ All imports fixed!");
