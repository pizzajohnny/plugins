'use strict';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

function commonjsRequire (path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

/*
**  graphql-query-compress -- Compress a GraphQL Query String
**  Copyright (c) 2017-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var graphqlQueryCompress_node = createCommonjsModule(function (module, exports) {
(function(f){{module.exports=f();}})(function(){return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof commonjsRequire&&commonjsRequire;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t);}return n[i].exports}for(var u="function"==typeof commonjsRequire&&commonjsRequire,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(_dereq_,module,exports){

var _tokenizr = _interopRequireDefault(_dereq_("tokenizr"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
**  graphql-query-compress -- Compress a GraphQL Query String
**  Copyright (c) 2017-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  external dependency  */

/*  the API function: compress a GraphQL query string  */
function compactGraphQLQuery(query) {
  const lexer = new _tokenizr.default();
  /*  configure lexical analysis  */

  lexer.rule(/#[^\r\n]*(?=\r?\n)/, (ctx, match) => {
    ctx.accept("comment");
  });
  lexer.rule(/"(?:\\"|[^"])*"/, (ctx, match) => {
    ctx.accept("string");
  });
  lexer.rule(/$[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
    ctx.accept("var");
  });
  lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
    ctx.accept("id");
  });
  lexer.rule(/[+-]?[0-9]*\.?[0-9]+(?:[eE][+-]?[0-9]+)?/, (ctx, match) => {
    ctx.accept("number");
  });
  lexer.rule(/[ \t\r\n]+/, (ctx, match) => {
    ctx.accept("ws", " ");
  });
  lexer.rule(/[{}]/, (ctx, match) => {
    ctx.accept("brace");
  });
  lexer.rule(/[[\]]/, (ctx, match) => {
    ctx.accept("bracket");
  });
  lexer.rule(/[()]/, (ctx, match) => {
    ctx.accept("parenthesis");
  });
  lexer.rule(/,/, (ctx, match) => {
    ctx.accept("comma");
  });
  lexer.rule(/!/, (ctx, match) => {
    ctx.accept("not");
  });
  lexer.rule(/\.\.\./, (ctx, match) => {
    ctx.accept("ellipsis");
  });
  lexer.rule(/@/, (ctx, match) => {
    ctx.accept("at");
  });
  lexer.rule(/:/, (ctx, match) => {
    ctx.accept("colon");
  });
  lexer.rule(/./, (ctx, match) => {
    ctx.accept("any");
  });
  lexer.input(query);
  lexer.debug(false);
  /*  fetch all parsed tokens  */

  const tokens = lexer.tokens();
  /*  remove whitespace tokens at harmless positions  */

  let output = "";
  const re = /^(?:brace|bracket|parenthesis|comma|colon)$/;

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type === "comment" || tokens[i].type === "ws" && (i < tokens.length - 1 && tokens[i + 1].type.match(re) || i > 0 && tokens[i - 1].type.match(re))) {
      tokens.splice(i, 1);
      i--;
    }
  }
  /*  assembly and return new query string  */


  tokens.forEach(token => {
    output += token.value;
  });
  return output;
}
/*  export the API function  */


module.exports = compactGraphQLQuery;

},{"tokenizr":"tokenizr"}]},{},[1])(1)
});
});

var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


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
        ctx.$logger.debug(`GET ${url}`);
        const res = yield ctx.$axios.get(url, {
            params: {
                query: graphqlQueryCompress_node(graphqlQuery).trim(),
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
var main = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
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
    const found = searchResults.find(({ title }) => basicMatch(ctx, filename, title));
    if (!found) {
        $logger.warn(`No result found for "${site.url}"`);
        return {};
    }
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

module.exports = main;
