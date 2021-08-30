'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var plugin = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMetadata = void 0;
function applyMetadata(handler, info) {
    handler.info = info;
}
exports.applyMetadata = applyMetadata;
});

var name = "vixen_network";
var version = "0.5.2";
var authors = [
	"boi123212321"
];
var description = "Scrape data from VIXEN Network (VIXEN, BLACKED, BLACKED RAW, TUSHY, TUSHY RAW, DEEPER, SLAYED) scenes";
var events = [
	"sceneCreated",
	"sceneCustom"
];
var require$$0 = {
	name: name,
	version: version,
	authors: authors,
	description: description,
	events: events,
	"arguments": [
	{
		name: "stripString",
		type: "String",
		required: false,
		"default": "[^a-zA-Z0-9'/\\,()[\\]{}-]",
		description: "Matcher string regex"
	},
	{
		name: "dry",
		type: "Boolean",
		required: false,
		"default": false,
		description: "Whether to commit data changes"
	},
	{
		name: "useThumbnail",
		type: "Boolean",
		required: false,
		"default": false,
		description: "Download & attach scene thumbnail"
	},
	{
		name: "useChapters",
		type: "Boolean",
		required: false,
		"default": false,
		description: "Create scene markers from chapters"
	}
]
};

var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};


const info_json_1 = __importDefault(require$$0);
const sites = [
    {
        name: "BLACKED RAW",
        url: "https://blackedraw.com",
    },
    {
        name: "BLACKED",
        url: "https://blacked.com",
    },
    {
        name: "TUSHY RAW",
        url: "https://tushyraw.com",
    },
    {
        name: "TUSHY",
        url: "https://tushy.com",
    },
    {
        name: "VIXEN",
        url: "https://vixen.com",
    },
    {
        name: "DEEPER",
        url: "https://deeper.com",
    },
    {
        name: "SLAYED",
        url: "https://slayed.com",
    },
];
function getArgs(ctx) {
    return ctx.args;
}
const graphqlQuery = `
query($query: String!, $site: Site!) {
  searchVideos(input: {
      query: $query,
      site: $site
  }) {
    edges {
      node {
        title
        slug
        description
        releaseDate
        categories {
          name
        }
        chapters {
          video {
            title
            seconds
          }
        }
        models {
          name
        }
        images {
          poster {
            ...ImageInfo
          }
        }
      }
    }
  }
}

fragment ImageInfo on Image {
  src
  highdpi {
    double
  }
}
`;
function search(ctx, site, query) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `${site.url}/graphql`;
        ctx.$logger.debug(`GET ${url} with query "${query}"`);
        const res = yield ctx.$axios.get(url, {
            params: {
                query: graphqlQuery.trim(),
                variables: JSON.stringify({
                    site: site.name.replace(/ /g, ""),
                    query: query.trim(),
                }),
            },
        });
        return res.data.data.searchVideos.edges.map(({ node }) => node);
    });
}
function basicMatch(ctx, a, b) {
    const stripString = getArgs(ctx).stripString || "[^a-zA-Z0-9'/\\,()[\\]{}-]";
    const stripRegex = new RegExp(stripString, "g");
    function normalize(str) {
        return str.trim().toLocaleLowerCase().replace(stripRegex, "");
    }
    return normalize(a).includes(normalize(b));
}
function findSite(ctx, str) {
    return sites.find((site) => {
        ctx.$logger.debug(`Compare "${str}" <-> "${site.name}"`);
        return basicMatch(ctx, str, site.name);
    });
}
const handler = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { $logger, sceneName, scene, event, $formatMessage, $path } = ctx;
    if (!sceneName) {
        $logger.error(`Invalid event: ${event}`);
        return {};
    }
    if (!scene.path) {
        $logger.error(`No scene path: ${scene._id}`);
        return {};
    }
    const result = {
        custom: {},
        $markers: [],
    };
    $logger.verbose(`Checking VIXEN sites for "${scene.path}"`);
    const site = findSite(ctx, scene.path) || findSite(ctx, (yield ctx.$getStudio()).name);
    if (!site) {
        $logger.warn(`No VIXEN site found in "${scene.path}"`);
        return {};
    }
    const basename = $path.basename(scene.path);
    const filename = basename.replace($path.extname(basename), "");
    const searchResults = yield search(ctx, site, filename);
    $logger.debug("Search results:");
    $logger.debug($formatMessage(searchResults.map(({ title }) => title)));
    const found = searchResults
        .filter(({ title }) => basicMatch(ctx, filename, title))
        .sort((a, b) => b.title.length - a.title.length)[0];
    if (!found) {
        $logger.warn(`No result found for "${site.url}"`);
        return {};
    }
    $logger.verbose(`Using scene "${found.title}"`);
    result.name = found.title;
    result.actors = found.models.map(({ name }) => name).sort();
    result.description = found.description;
    result.studio = site.name;
    result.releaseDate = new Date(found.releaseDate).valueOf();
    result.labels = found.categories.map(({ name }) => name).sort();
    const thumbUrl = found.images.poster[3].src;
    result.$thumbnail = thumbUrl;
    const args = getArgs(ctx);
    if (args.useThumbnail) {
        $logger.verbose("Setting thumbnail");
        result.thumbnail = yield ctx.$createImage(thumbUrl, `${result.name}`, true);
    }
    if (args.useChapters) {
        const chapters = found.chapters.video;
        for (const { title, seconds } of chapters) {
            result.$markers.push({
                name: title,
                time: seconds,
            });
        }
    }
    if (args.dry) {
        $logger.info(`Would have returned ${$formatMessage(result)}`);
        return {};
    }
    $logger.verbose(`Creating ${result.$markers.length} markers`);
    for (const { name, time } of result.$markers) {
        $logger.silly(`Creating marker: ${name} at ${time}s`);
        yield ctx.$createMarker(name, time);
    }
    return result;
});
handler.requiredVersion = ">=0.27.0";
plugin.applyMetadata(handler, info_json_1.default);
var main = handler;
var _default = handler;
main.default = _default;

module.exports = _default;
