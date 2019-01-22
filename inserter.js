function inserter(src, mods, comments) {
  const stringFragments = [];
  let currentLine = 1;
  let currentOffset = 0;

  mods.forEach(({ startLine: ml, name }) => {
    const possiblyValidComment = comments.find(({ startLine: cl }) => cl === ml - 1);
    if (!possiblyValidComment || possiblyValidComment.value !== name) {
      const fragmentStart = currentOffset;
      while (currentLine !== ml) {
        currentOffset = src.indexOf('\n', currentOffset) + 1; // relys on lua-fmt give a newline ("\n" in js) if a mod table key is in the last line
        currentLine += 1;
      }
      const fragmentEnd = currentOffset;
      stringFragments.push(src.slice(fragmentStart, fragmentEnd));
      stringFragments.push(`--${name}\n`);
    }
  });

  stringFragments.push(src.slice(currentOffset));

  return stringFragments.join('');
}

module.exports = inserter;
