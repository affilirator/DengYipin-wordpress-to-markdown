const { format } = require("date-fns");
const fetch = require("node-fetch");
const path = require("path");
const prettier = require("prettier");

const xml2js = require("xml2js");
const fs = require("fs");
const slugify = require("slugify");
const htmlentities = require("he");
const {
  cleanupShortcodes,
  fixCodeBlocks,
  codeBlockDebugger,
  fixBadHTML,
  fixEmbeds,
} = require("./articleCleanup");

const unified = require("unified");
const parseHTML = require("rehype-parse");
const rehype2remark = require("rehype-remark");
const stringify = require("remark-stringify");
const imageType = require("image-type");

// Start processing the XML file
processExport("mahinge.xml");

function processExport(file) {
  const parser = new xml2js.Parser();

  fs.readFile(file, function (err, data) {
    if (err) {
      return console.log("Error: " + err);
    }

    parser.parseString(data, function (err, result) {
      if (err) {
        return console.log("Error parsing xml: " + err);
      }
      console.log("Parsed XML");

      const posts = result.rss.channel[0].item;

      // Create output directories
      fs.mkdirSync("output", { recursive: true });
      fs.mkdirSync("output/posts", { recursive: true });
      fs.mkdirSync("output/images", { recursive: true });

      // Process each post
      posts.filter((p) => p["wp:post_type"][0] === "post").forEach(processPost);
    });
  });
}

function constructImageName({ urlParts, buffer }) {
  const pathParts = path.parse(
    urlParts.pathname.replace(/^\//, "").replace(/\//g, "-").replace(/\*/g, "")
  );
  const { ext } = imageType(new Buffer(buffer));

  return `${pathParts.name}.${ext}`;
}

async function processImage({ url, postData }) {
  const cleanUrl = htmlentities.decode(url);

  if (cleanUrl.startsWith("./images")) {
    console.log(`Already processed ${cleanUrl}`);

    return postData;
  }

  const urlParts = new URL(cleanUrl);
  const filePath = `output/images`; // All images go into this single directory

  try {
    const response = await downloadFile(cleanUrl);
    const type = response.headers.get("Content-Type");

    if (type.includes("image") || type.includes("octet-stream")) {
      const buffer = await response.arrayBuffer();
      const imageName = constructImageName({
        urlParts,
        buffer,
      });

      // Update postData to use the new image path
      postData = postData.replace(url, `./images/${imageName}`);

      // Write the image to the output directory
      fs.writeFileSync(`${filePath}/${imageName}`, Buffer.from(buffer));
    }
  } catch (e) {
    console.log(`Keeping reference to ${url}`);
  }

  return postData;
}

async function processImages({ postData }) {
  const patt = new RegExp('(?:src="(.*?)")', "gi");
  let matches = [];

  let m;
  while ((m = patt.exec(postData)) !== null) {
    if (!m[1].endsWith(".js")) {
      matches.push(m[1]);
    }
  }

  if (matches.length > 0) {
    for (let match of matches) {
      try {
        postData = await processImage({
          url: match,
          postData,
        });
      } catch (err) {
        console.log("ERROR PROCESSING IMAGE", match);
      }
    }
  }

  return postData;
}

async function processPost(post) {
  console.log("Processing Post");

  const postTitle = typeof post.title === "string" ? post.title : post.title[0];
  console.log("Post title: " + postTitle);

  const postDate = isFinite(new Date(post.pubDate))
    ? new Date(post.pubDate)
    : new Date(post["wp:post_date"]);

  console.log("Post Date: " + postDate);

  let postData = post["content:encoded"][0];

  console.log("Post length: " + postData.length + " bytes");

  const slug = slugify(postTitle, { remove: /[^\w\s]/g })
    .toLowerCase()
    .replace(/\*/g, "");

  console.log("Post slug: " + slug);

  // Takes the longest description candidate
  const description = [
    post.description,
    ...post["wp:postmeta"].filter(
      (meta) =>
        meta["wp:meta_key"][0].includes("metadesc") ||
        meta["wp:meta_key"][0].includes("description")
    ),
  ].sort((a, b) => b.length - a.length)[0];

  const heroURLs = post["wp:postmeta"]
    .filter(
      (meta) =>
        meta["wp:meta_key"][0].includes("opengraph-image") ||
        meta["wp:meta_key"][0].includes("twitter-image")
    )
    .map((meta) => meta["wp:meta_value"][0])
    .filter((url) => url.startsWith("http"));

  let heroImage = "";

  // Use a single directory for all posts
  let fname = `${slug}.md`;

  // Merge categories and tags into tags
  const categories = post.category && post.category.map((cat) => cat["_"]);

  // Find all images
  if (heroURLs.length > 0) {
    const url = heroURLs[0];
    postData = await processImage({
      url,
      postData,
    });
  }

  postData = await processImages({ postData });

  heroImage = ""; // You can set this based on your logic

  const markdown = await new Promise((resolve, reject) => {
    unified()
      .use(parseHTML, { fragment: true })
      .use(fixCodeBlocks)
      .use(fixEmbeds)
      .use(rehype2remark)
      .use(cleanupShortcodes)
      .use(stringify, { fences: true })
      .process(fixBadHTML(postData), (err, markdown) => {
        if (err) reject(err);
        else
          resolve(prettier.format(markdown.contents, { parser: "markdown" }));
      });
  });

  let frontmatter;
  try {
    frontmatter = [
      "---",
      `title: '${postTitle.replace(/'/g, "''")}'`,
      `description: "${description}"`,
      `pubDate: ${format(postDate, "yyyy-MM-dd")}`,
      `redirect_from:\n            - ${post.link[0]
        .replace(/https:\/\/swizec.com/, "")
        .replace(/https:\/\/www.swizec.com/, "")}`,
    ];
  } catch (e) {
    console.log("Error creating frontmatter", e);
    throw e;
  }

  if (categories && categories.length > 0) {
    const updatedCategories = categories.map((category) =>
      category === "Uncategorized" ? "Affiliate Marketing" : category
    );
    frontmatter.push(`tags: ["${updatedCategories.join('", "')}"]`);
  }

  frontmatter.push(`image: ${heroImage || "/blog/post-01-cover.png"}`);
  frontmatter.push("---");
  frontmatter.push("");

  // Write the markdown file to the posts directory
  fs.writeFileSync(`output/posts/${fname}`, frontmatter.join("\n") + markdown);
}

async function downloadFile(url) {
  const response = await fetch(url);
  if (response.status >= 400) {
    throw new Error("Bad response from server");
  } else {
    return response;
  }
}
