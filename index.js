const fsP = require('fs').promises;
const { formatText } = require('lua-fmt');
const parser = require('luaparse');
const assert = require('assert').strict;
const workshopFetcher = require('./workshopFetcher');
const inserter = require('./inserter');

async function main() {
  const luaCodeOriginal = await fsP.readFile('modoverrides.lua', 'utf8');
  const luaCode = formatText(luaCodeOriginal);
  const ast = parser.parse(luaCode, { locations: true, comments: true });

  const body0 = ast.body[0];
  assert(body0.type === 'ReturnStatement');
  const arguments0 = body0.arguments[0];
  assert(arguments0.type === 'TableConstructorExpression');

  const modsStructure = arguments0.fields.map(field => ({
    value: field.key.value.slice(9),
    startLine: field.loc.start.line,
  }));

  const commentsStructure = ast.comments.map(comment => ({
    value: comment.value,
    startLine: comment.loc.start.line,
  }));

  const result = await workshopFetcher(modsStructure.map(item => item.value));

  const tmp = [];
  modsStructure.forEach(({ value, startLine }) => {
    // will steam return in order we request?
    const { title } = result.find(
      ({ publishedfileid }) => publishedfileid === value,
    ) || { title: null };
    tmp.push({ startLine, name: title });
  });

  const code = inserter(luaCode, tmp, commentsStructure);
  await fsP.writeFile('modoverrides.lua', formatText(code));
}

main();
