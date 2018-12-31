
export function getColumnValue(columns, name, item) {
	var pos = columns.findIndex(colName => colName == name);
	if (pos >= 0) {
		return item[pos];
	}
	console.log("Column doesn't exist: " + name);
}
