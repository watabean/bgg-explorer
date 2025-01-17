import * as React from "react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

import {
  Box,
  Button,
  Checkbox,
  Chip,
  Drawer,
  Fab,
  FormControlLabel,
  FormGroup,
  Link,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import FilterListIcon from "@mui/icons-material/FilterList";
import ScaleIcon from "@mui/icons-material/Scale";
import ElderlyIcon from "@mui/icons-material/Elderly";
import PeopleIcon from "@mui/icons-material/People";

import { Item, useSheetData } from "./useSheetData";

type FilterType = {
  weight: [number, number];
  year: [number, number];
  players: number[];
};

const initialFilterValues: FilterType = {
  weight: [0, 5],
  year: [1991, parseInt(format(new Date(), "yyyy"))],
  players: [1, 2, 3, 4, 5, 6, 7],
};
const marks = {
  weight: [
    { value: 1.5, label: "軽量級" },
    { value: 2.5, label: "中量級" },
    { value: 3.5, label: "重量級" },
  ],
  year: [
    { value: 2000, label: "2000年" },
    { value: 2010, label: "2010年" },
    { value: 2020, label: "2020年" },
  ],
};

const columns: GridColDef<Item>[] = [
  { field: "rank", headerName: "#", width: 60, flex: 0.1 },
  {
    field: "title",
    headerName: "title",
    minWidth: 200,
    flex: 1,
    renderCell: (params) => (
      <Link href={params.row.url} target="_blank">
        {params.row.title}
      </Link>
    ),
  },
  { field: "titleJapanese", headerName: "タイトル", minWidth: 200, flex: 1 },
  { field: "year", headerName: "出版年", minWidth: 100, flex: 0.2 },
  { field: "score", headerName: "レート", minWidth: 100, flex: 0.2 },
  { field: "weight", headerName: "重量", minWidth: 100, flex: 0.2 },
  { field: "bestPlayers", headerName: "ベスト人数", minWidth: 100, flex: 0.4, sortable: false },
  {
    field: "designers",
    headerName: "デザイナー",
    sortable: false,
    minWidth: 300,
    flex: 1,
    renderCell: (params) => (
      <Stack direction="row" gap={0.25} sx={{ flexWrap: "wrap" }}>
        {params.row.designers.map((designer, index) => (
          <Chip key={`${index}-${designer}`} label={designer} variant="outlined" />
        ))}
      </Stack>
    ),
  },
];

export default function DataGridBGG() {
  const [items, setItems] = useState<Item[]>([]);
  const { data = [] } = useSheetData();

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  const [filterValues, setFilterValues] = useState({
    ...initialFilterValues,
  });
  const [open, setOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const filterItems = (filter: FilterType) => {
    setItems(
      data
        .filter((item) => filter.weight[0] <= Number(item.weight) && Number(item.weight) <= filter.weight[1])
        .filter((item) => filter.year[0] <= Number(item.year) && Number(item.year) <= filter.year[1])
        .filter((item) => item.bestPlayers.some((player) => filter.players.includes(player))),
    );
  };

  const handleSliderChange =
    (filterType: "weight" | "year") => (_event: Event | React.ChangeEvent, newValue: number | number[]) => {
      setFilterValues((prevValues) => {
        const newValues = {
          ...prevValues,
          [filterType]: newValue,
        };
        setIsChanged(JSON.stringify(newValues) !== JSON.stringify(initialFilterValues));
        filterItems(newValues);
        return newValues;
      });
    };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, x: number) => {
    const { checked } = event.target;
    setFilterValues((prevValues) => {
      const playersSet = new Set(prevValues.players);

      if (checked) {
        playersSet.add(x);
      } else {
        playersSet.delete(x);
      }
      const newValues = {
        ...prevValues,
        players: Array.from(playersSet).sort(),
      };
      setIsChanged(JSON.stringify(newValues) !== JSON.stringify(initialFilterValues));
      filterItems(newValues);
      return newValues;
    });
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100dvh" }}>
        <Typography variant="h1" sx={{ fontSize: isMobile ? "1.5rem" : "3rem" }}>
          BGG Explorer
        </Typography>
        <DataGrid
          sx={{ flexGrow: 1 }}
          getRowHeight={() => "auto"}
          disableColumnFilter
          disableRowSelectionOnClick
          getRowId={(item) => item.rank}
          rows={items}
          columns={columns}
        />
      </Box>
      <Fab
        sx={{ position: "fixed", bottom: 50, right: 50 }}
        onClick={() => setOpen(true)}
        color={isChanged ? "warning" : "default"}
      >
        <FilterListIcon />
      </Fab>
      <Drawer anchor={"bottom"} open={open} onClose={() => setOpen(false)}>
        <Stack sx={{ touchAction: "none" }}>
          <Box
            sx={{
              margin: "10px 50px",
            }}
          >
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              重さ
              <ScaleIcon />
            </Typography>
            <Slider
              getAriaLabel={() => "重さ"}
              value={filterValues.weight}
              onChange={handleSliderChange("weight")}
              valueLabelDisplay="auto"
              min={initialFilterValues.weight[0]}
              max={initialFilterValues.weight[1]}
              marks={marks.weight}
              valueLabelFormat={(val) => val.toFixed(1)}
              step={0.1}
            />
          </Box>
          <Box
            sx={{
              margin: "10px 50px",
            }}
          >
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              出版年
              <ElderlyIcon />
            </Typography>
            <Slider
              getAriaLabel={() => "出版年"}
              value={filterValues.year}
              onChange={handleSliderChange("year")}
              valueLabelDisplay="auto"
              min={initialFilterValues.year[0]}
              max={initialFilterValues.year[1]}
              marks={marks.year}
              valueLabelFormat={(val) => `${val}年`}
            />
          </Box>
          <Box
            sx={{
              margin: "10px 50px",
            }}
          >
            <Typography sx={{ display: "flex", alignItems: "center" }}>
              ベスト人数
              <PeopleIcon />
            </Typography>
            <FormGroup
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              {initialFilterValues.players.map((x) => (
                <FormControlLabel
                  sx={{ flexGrow: 0.1 }}
                  key={x}
                  label={`${x}人`}
                  control={
                    <Checkbox
                      checked={filterValues.players.includes(x)}
                      onChange={(event) => handleCheckboxChange(event, x)}
                    />
                  }
                />
              ))}
            </FormGroup>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "10px 20px",
            }}
          >
            <Button
              onClick={() => {
                setFilterValues(initialFilterValues);
                setIsChanged(false);
                setItems(data);
              }}
              variant={isChanged ? "contained" : "outlined"}
              color={isChanged ? "warning" : "info"}
            >
              リセット
            </Button>
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}
