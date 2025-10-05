export function MdxTable({ data }: { data: { headers: string[]; rows: string[][] } }) {
	const headers = data.headers.map((header: string, index: number) => <th key={index}>{header}</th>);
	const rows = data.rows.map((row: string[], index: number) => (
		<tr key={index}>
			{row.map((cell: string, cellIndex: number) => (
				<td key={cellIndex}>{cell}</td>
			))}
		</tr>
	));

	return (
		<table>
			<thead>
				<tr>{headers}</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
}
