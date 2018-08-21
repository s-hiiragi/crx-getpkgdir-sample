/**
 * ディレクトリ内のエントリを取得 (サブディレクトリは探索しない)
 */
async function* getEntriesGeneratorAsync(dirEntry) {
	console.log(`getEntriesGeneratorAsync: ${dirEntry.name}`);

	let dirReader = dirEntry.createReader();

	let readEntriesAsync = async () => {
		return new Promise((resolve, reject) => {
			dirReader.readEntries(
				(results) => resolve(results),
				(error) => reject(error));
		});
	};

	while (true) {
		let es = await readEntriesAsync();
		if (es.length == 0) break;

		for (let e of es) {
			console.log(`  yield await [${e.name}]`);
			yield await e;
		}
	}
}

/**
 * ディレクトリ内の全エントリを取得
 */
async function getAllEntriesAsync(dirEntry) {
	let allEntries = [];

	for await (let e of getEntriesGeneratorAsync(dirEntry)) {
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
