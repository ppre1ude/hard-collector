export interface ScannedItem {
    id: number;
    name: string;
    count: number;
}

export const parseCsvToItems = (csvContent: string): ScannedItem[] => {
    const lines = csvContent.split("\n");
    const items: ScannedItem[] = [];
    let dataStarted = false;

    for (const line of lines) {
        if (!dataStarted) {
            if (line.includes("순번,항목 이름,수량")) dataStarted = true;
            continue;
        }
        const parts = line.split(",");
        if (parts.length >= 3) {
            const name = parts[1].replace(/"/g, "").trim();
            const count = parseInt(parts[2].trim(), 10);
            if (name && !isNaN(count)) items.push({ id: Date.now() + items.length, name, count });
        }
    }

    return items;
};

export const mergeItemsByName = (items: ScannedItem[]): ScannedItem[] => {
    const mergedMap: Record<string, ScannedItem> = {};
    items.forEach((item) => {
        const key = item.name;
        if (mergedMap[key]) {
            mergedMap[key].count += item.count;
        } else {
            mergedMap[key] = { ...item };
        }
    });
    return Object.values(mergedMap);
};

export const generateCsvContent = (fileName: string, dateStr: string, items: ScannedItem[]): string => {
    let csvContent = "\uFEFF"; // BOM for UTF-8 Excel compatibility
    csvContent += `파일명, ${fileName}\n`;
    csvContent += `날짜(수정일), ${dateStr}\n\n`;
    csvContent += "순번,항목 이름,수량\n";

    let index = 1;
    items.forEach((item) => {
        const name = `"${item.name.replace(/"/g, '""')}"`;
        csvContent += `${index++},${name},${item.count}\n`;
    });

    return csvContent;
};
