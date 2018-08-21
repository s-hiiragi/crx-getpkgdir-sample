/**
 * ディレクトリ内のエントリを取得 (サブディレクトリは探索しない)
 */
async function getEntriesAsync(dirEntry) {
	console.log(`getEntriesAsync: ${dirEntry.name}`);

	let dirReader = dirEntry.createReader();

	let readEntriesAsync = async () => {
		return new Promise((resolve, reject) => {
			dirReader.readEntries(
				(results) => resolve(results),
				(error) => reject(error));
		});
	};

	let entries = [];
	while (true) {
		let es = await readEntriesAsync();
		if (es.length == 0) break;

		entries = entries.concat(es);
	}

	console.log(`  return [${entries.map(e => e.name)}]`);
	return entries;
}

/**
 * ディレクトリ内の全エントリを取得
 */
async function getAllEntriesAsync(dirEntry) {
	let entries = await getEntriesAsync(dirEntry);

	let allEntries = [];
	for (let e of entries) {
		allEntries.push(e);
		if (e.isDirectory) {
			allEntries = allEntries.concat(await getAllEntriesAsync(e));
		}
	}

	return allEntries;
}

/**
 * ディレクトリ内の全エントリを表示
 */
async function showAllEntriesAsync(dirEntry) {
	let entries = await getAllEntriesAsync(dirEntry);

	entries.forEach((e) => {
		console.log(`${e.fullPath} (${e.isDirectory ? "directory" : "file"})`);
	});
}

// パッケージディレクトリを取得し、ディレクトリ内の全エントリを表示
chrome.runtime.getPackageDirectoryEntry(showAllEntriesAsync);
