import { Alert, Autocomplete, AutocompleteInputChangeReason, Avatar, Box, CircularProgress, TextField } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SyntheticEvent, useCallback, useMemo, useRef, useState } from 'react';
import { PaginatedResponse, PaginationParams } from '../../../api/types/pagination';

export interface DisplayedItem<TApiReturnItem> {
  key: keyof TApiReturnItem;
  type: 'text' | 'image';
}

function FetchSelect<TApiReturnItem extends {
  [key: string]: any;
}>(props: {
  queryFn: (search: string, pagParams: PaginationParams) => Promise<PaginatedResponse<TApiReturnItem>>,
  multiple?: boolean,
  showInOption: DisplayedItem<TApiReturnItem>[],
  showInValue: DisplayedItem<TApiReturnItem>[],
  valueKey: keyof TApiReturnItem,
  label: string,
  value: TApiReturnItem[keyof TApiReturnItem] | TApiReturnItem[keyof TApiReturnItem][],
  onChange: (value: TApiReturnItem[keyof TApiReturnItem] | TApiReturnItem[keyof TApiReturnItem][] | null) => void,
  backendSearch?: boolean,
  preloadedValues?: TApiReturnItem | TApiReturnItem[],
}) {
  const {
    queryFn,
    multiple,
    label,
    showInOption,
    showInValue,
    value,
    valueKey,
    onChange,
    backendSearch,
    preloadedValues,
  } = props;

  const uniqueId = useRef(Math.random().toString(36).substring(7));

  const autocompleteId = `${uniqueId.current}fetchSelect`;

  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');

  const {
    data,
    isFetching,
    // isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [search, uniqueId.current],
    ({ pageParam = 0 }) => queryFn(search, { page: pageParam, perPage: 5 }),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
      },
    }
  );

  const loading = useMemo(() => isFetching && !data, [isFetching, data]);

  const renderCellContent = (
    [key, value]: [keyof TApiReturnItem, TApiReturnItem[keyof TApiReturnItem]]
  ) => {
    let cell;

    const displayedItemConfig = showInOption.find(item => item.key === key);

    switch (displayedItemConfig!.type) {
      case 'image':
        cell = (
          <Avatar
            alt="Аватар"
            src={value as string}
            sx={{ width: 20, height: 20 }}
          />
        );
        break;
      default:
        cell = value;
    }

    return <div style={{ marginRight: '5px' }}>{cell}</div>;
  };

  const handleInputChange = useCallback((_: SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    console.log(value, reason);
    if (backendSearch && reason === 'input')
      setSearch(value);

    if (!backendSearch && reason === 'input')
      setLocalSearch(value);
  }, []);

  const onAutocompleteChange = useCallback((_: React.ChangeEvent<{}>, newvalue: TApiReturnItem | NonNullable<string | TApiReturnItem> | (string | TApiReturnItem)[] | null) => {
    console.log(newvalue);
    if (!newvalue) {
      setSearch('');
      setLocalSearch('');
      onChange(null);
    }


    if (multiple && Array.isArray(newvalue)) {
      if (newvalue.length === 0) {
        onChange([]);
        return;
      }

      const objectItems = newvalue.filter(item => typeof item === 'object') as TApiReturnItem[];

      onChange(objectItems.map(item => item[valueKey]));
    } else if (newvalue && !Array.isArray(newvalue) && typeof newvalue === 'object') {
      onChange(newvalue[valueKey]);
    }
  }, [multiple, onChange, valueKey]);

  const collectedItems = useMemo(() => {
    let result: TApiReturnItem[] = [];
    if (data) {
      result = data.pages.flatMap(page => page.items);

      if (hasNextPage) {
        result.push({
          [valueKey]: 'loading',
        } as any);
      }
    }

    if (preloadedValues) {
      if (multiple && Array.isArray(preloadedValues)) {
        result = [...preloadedValues, ...result];
      } else if (!multiple && !Array.isArray(preloadedValues)) {
        result = [preloadedValues, ...result];
      }
    }

    return result;
  }, [data, hasNextPage, multiple, preloadedValues, valueKey]);

  const autocompleteValue = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return collectedItems.filter(item => value.includes(item[valueKey]));
    }
    return collectedItems.find(item => item[valueKey] === value);
  }, [collectedItems, multiple, value, valueKey]);

  return (
    <Autocomplete<TApiReturnItem, boolean, boolean, boolean>
      multiple={multiple}
      id={autocompleteId}
      options={collectedItems}
      sx={{ flex: 1 }}
      autoHighlight
      value={autocompleteValue}
      isOptionEqualToValue={(option, value) => option[valueKey] === value[valueKey]}
      filterOptions={option => {
        if (multiple && Array.isArray(value) && backendSearch) {
          return option.filter(o => !value.includes(o[valueKey]));
        }
        if (!backendSearch) {
          return option.filter(o => {
            const optionLabel = o ? showInValue.map(field => o[field.key]).join(' ') : ''

            return optionLabel.toLowerCase().includes(localSearch.toLowerCase());
          });
        }
        return option;
      }}
      getOptionLabel={selected => {
        const isObject = typeof selected === 'object';

        const fullOption = collectedItems.find(o => o[valueKey] === (isObject ? selected[valueKey] : selected));

        const optionLabel = fullOption ? showInValue.map(field => fullOption[field.key]).join(' ') : ''

        return optionLabel;
      }}
      onChange={onAutocompleteChange}
      onInputChange={handleInputChange}
      loading={loading}
      loadingText="Загрузка"
      noOptionsText="Не найдено"
      renderOption={(props, option) => (
        <>
          {
            option[valueKey] === 'loading' ? (
              <Box
                component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                {...props}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  fetchNextPage();
                }}
              >
                Загрузить еще
              </Box>
            ) : (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                {
                  Object.entries(option).filter(([field]) =>
                    showInOption.find(item => item.key === field)
                  ).map(([key, value]) => renderCellContent([key as keyof TApiReturnItem, value as TApiReturnItem[keyof TApiReturnItem]]))
                }
              </Box>
            )
          }
          {
            backendSearch && option[valueKey] === 'loading' && (
              <Alert severity="info">
                Чтобы найти сотрудника впишите фамилию полностью
              </Alert>
            )
          }
        </>
      )
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
};

export default FetchSelect;
