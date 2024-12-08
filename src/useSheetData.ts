import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SheetData {
  values: string[][];
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

export function useSheetData() {
  return useQuery({
    queryKey: ["sheetData"],
    queryFn: async () => {
      const response = await axios.get<SheetData>(
        "https://sheets.googleapis.com/v4/spreadsheets/1DWXWf_8N1CbkxA6ezYcETIczQLg_vge3sHsPuHEApRQ/values/data",
        {
          params: {
            key: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY,
          },
        }
      );
      // 1行目はヘッダー行なので飛ばす
      return createItem(response.data.values.slice(1));
    },
  });
}
