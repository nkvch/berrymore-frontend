import { Alert, Button, InputAdornment, Popover, Switch, TextField, Typography } from "@mui/material";
import { ClearIcon, SearchInfoIcon, ToolbarWrapper } from "./elements";
import { useState } from "react";
import FetchSelect from "../../../../components/common/FetchSelect/FetchSelect";
import getForemen, { ForemanTableItem } from "../../../../api/queryFns/foremen.query";
import getFlags, { FlagItem } from "../../../../api/queryFns/flags.query";

interface SearchToolbarPropd {
  onSearchSubmit: (search: string) => void;
  foremanId: ForemanTableItem['id'] | null;
  setForemanId: (foremanId: ForemanTableItem['id'] | null) => void;
  flagsPresent: number[];
  setFlagsPresent: (flagsPresent: number[]) => void;
  flagsAbsent: number[];
  setFlagsAbsent: (flagsAbsent: number[]) => void;
  hasShift: boolean;
  setHasShift: (hasShift: boolean) => void;
}

function SearchToolbar(props: SearchToolbarPropd) {
  const {
    onSearchSubmit,
    foremanId,
    setForemanId,
    flagsPresent,
    setFlagsPresent,
    flagsAbsent,
    setFlagsAbsent,
    hasShift,
    setHasShift,
  } = props;

  const [search, setSearch] = useState('');
  const [searchInfoAnchorEl, setSearchInfoAnchorEl] = useState<SVGSVGElement | null>(null);


  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    setSearchInfoAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setSearchInfoAnchorEl(null);
  };

  const clearSearch = () => {
    setSearch('');
    onSearchSubmit('');
  };

  const open = Boolean(searchInfoAnchorEl);
  const id = open ? 'search-info' : undefined;

  return (
    <ToolbarWrapper>
      <TextField
        name='employeessearch'
        label='Поиск...'
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        type='search'
        variant='outlined'
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <ClearIcon onClick={clearSearch} />
              <SearchInfoIcon aria-describedby={id} onClick={handleClick} />
            </InputAdornment>
          )
        }}
      />
      <Popover
        open={open}
        anchorEl={searchInfoAnchorEl}
        onClose={handleClose}
        id={id}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert severity="info">
          Поиск по фамилии, телефону и номеру договора. Работает только с полным совпадением.
        </Alert>
      </Popover>
      <Button
        variant='outlined'
        onClick={() => onSearchSubmit(search)}
      >
        Найти
      </Button>
      <FetchSelect<ForemanTableItem>
        label='Бригадир'
        multiple={false}
        value={foremanId as ForemanTableItem['id']}
        onChange={(value) => setForemanId(value as ForemanTableItem['id'])}
        queryFn={getForemen}
        showInOption={[{
          key: 'firstName',
          type: 'text'
        }, {
          key: 'lastName',
          type: 'text'
        }]}
        showInValue={[{
          key: 'firstName',
          type: 'text'
        }, {
          key: 'lastName',
          type: 'text'
        }]}
        valueKey='id'
      />
      <FetchSelect<FlagItem>
        label='С метками'
        multiple={true}
        value={flagsPresent}
        onChange={(value) => setFlagsPresent(value as number[])}
        queryFn={getFlags}
        showInOption={[{
          key: 'name',
          type: 'text'
        }]}
        showInValue={[{
          key: 'name',
          type: 'text'
        }]}
        valueKey='id'
      />
      <FetchSelect<FlagItem>
        label='Без меток'
        multiple={true}
        value={flagsAbsent}
        onChange={(value) => setFlagsAbsent(value as number[])}
        queryFn={getFlags}
        showInOption={[{
          key: 'name',
          type: 'text'
        }]}
        showInValue={[{
          key: 'name',
          type: 'text'
        }]}
        valueKey='id'
      />
      <Typography variant='body1'>Смена</Typography>
      <Switch
        checked={hasShift}
        onChange={(event) => setHasShift(event.target.checked)}
      />
    </ToolbarWrapper>
  )
}

export default SearchToolbar;
