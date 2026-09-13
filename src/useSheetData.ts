import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SheetData {
  values?: string[][];
}

export type Item = {
  title: string;
  rank: number;
  score: number;
  weight: number;
  url: string;
  year: string;
  designers: string[];
  bestPlayers: number[];
  titleJapanese: string;
};

type SheetQueryData = {
  items: Item[];
  lastUpdatedAt: string | null;
};

const SPREADSHEET_ID = "1DWXWf_8N1CbkxA6ezYcETIczQLg_vge3sHsPuHEApRQ";
const SHEETS_API_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values`;

const createItem = (data: string[][]): Item[] => {
  return data.map((row) => ({
    rank: parseInt(row[0]),
    title: row[1],
    titleJapanese: row[2],
    year: row[3],
    score: parseFloat(row[4]),
    weight: parseFloat(row[5]),
    bestPlayers: row[6].split(",").map((num) => parseInt(num)),
    designers: row[7].split(","),
    url: row[8],
  }));
};

const fetchSheetRange = (range: string) => {
  return axios.get<SheetData>(`${SHEETS_API_BASE_URL}/${range}`, {
    params: {
      key: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
    },
  });
};

const getMetadataValue = (rows: string[][], key: string): string | null => {
  const row = rows.slice(1).find(([metadataKey]) => metadataKey === key);
  return row?.[1] ?? null;
};

export function useSheetData() {
  return useQuery({
    queryKey: ["sheetData"],
    queryFn: async (): Promise<SheetQueryData> => {
      const [dataResult, metadataResult] = await Promise.allSettled([
        fetchSheetRange("data"),
        fetchSheetRange("metadata"),
      ]);

      if (dataResult.status === "rejected") {
        throw dataResult.reason;
      }

      const dataRows = dataResult.value.data.values ?? [];
      const metadataRows = metadataResult.status === "fulfilled" ? metadataResult.value.data.values ?? [] : [];

      return {
        // 1行目はヘッダー行なので飛ばす
        items: createItem(dataRows.slice(1)),
        // metadata は補助情報。取得できなくてもゲーム一覧は表示し続ける。
        lastUpdatedAt: getMetadataValue(metadataRows, "lastUpdatedAt"),
      };
    },
  });
}
