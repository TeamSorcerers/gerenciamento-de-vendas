import { Alert, Box, Button, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { Menu } from "../components/Menu";

import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    DataGrid,
    GridColDef,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowEditStopReasons,
    GridPreProcessEditCellProps,
} from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import { Cancel, Edit, Save } from "@mui/icons-material";
import { GATEWAY_UPDATE_STOCK, GATEWAY_VIEW_ALL_PRODUCT } from "../gateways";
import { FetchAllProductsResponse, RegisterResponse } from "../model/responses";

function parseLocaleNumber(stringNumber: string, locale: string) {
    const thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '');
    const decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '');

    return parseFloat(stringNumber
        .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
        .replace(new RegExp('\\' + decimalSeparator), '.')
    );
}

export function ViewStock(): JSX.Element {
    const [rows, setRows] = useState<GridRowsProp>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isUpdatingStock, setIsUpdatingStock] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<'success'|'error'>("error");

    const onSubmit = async () => {
        setIsUpdatingStock(true);
        setShowAlert(false);

        try {
            const response = await fetch(GATEWAY_UPDATE_STOCK, {
                method: "POST",
                body: JSON.stringify(rows.map(row => ({
                    code: row.id,
                    name: row.name,
                    price: parseLocaleNumber(row.price, 'pt-BR'),
                    amountAvailable: Number(row.amount)
                }))),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const responseData = await response.json() as RegisterResponse;
            
            if (responseData.ok) {
                setAlertType("success");
                setAlertMessage("O estoque foi atualizado com sucesso.");
                setShowAlert(true);

                try {
                    setIsLoadingProducts(true);

                    const response = await fetch(GATEWAY_VIEW_ALL_PRODUCT);
                    const products = await response.json() as FetchAllProductsResponse;

                    setRows(products.map(item => ({
                        id: item.code,
                        name: item.name,
                        price: item.price,
                        amount: item.amountAvailable
                    })));
                } catch (error) {
                    console.error(error);
                    setAlertType("error");
                    setAlertMessage("Não foi possível proceder devido a um erro interno.");
                    setShowAlert(true);
                } finally {
                    setIsLoadingProducts(false);
                }
            } else {
                setAlertType("error");
                
                if (responseData.error.type === "internal") {
                    throw responseData.error.message;
                } else if (responseData.error.type === "invalid-data") {
                    setAlertMessage("Os dados enviados são inválidos, tente novamente.");
                    setShowAlert(true);
                }
            }

        } catch (error) {
            console.error(error);
            setAlertType("error");
            setAlertMessage("Não foi possível proceder devido a um erro interno.");
            setShowAlert(true);
        }

        setIsUpdatingStock(false);
    }

    useEffect(() => {
        setIsLoadingProducts(true);

        const fetchData = async () => {
            try {
                const response = await fetch(GATEWAY_VIEW_ALL_PRODUCT);
                const products = await response.json() as FetchAllProductsResponse;

                setRows(products.map(item => ({
                    id: item.code,
                    name: item.name,
                    price: item.price,
                    amount: item.amountAvailable
                })));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoadingProducts(false);
            }
        }

        fetchData();
    }, []);

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Produto',
            width: 180,
            align: 'center',
            headerAlign: 'center',
            editable: true
        },
        {
          field: 'price',
          headerName: 'Preço',
          type: 'number',
          width: 120,
          valueFormatter: (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
          preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
            const hasError = params.props.value <= 0;
            return { ...params.props, error: hasError };
          },
          align: 'center',
          headerAlign: 'center',
          editable: true,
        },
        {
            field: 'amount',
            headerName: 'Quantidade',
            type: 'number',
            width: 120,
            preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
                const hasError = params.props.value < 0;
                return { ...params.props, error: hasError };
            },
            align: 'center',
            headerAlign: 'center',
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        
                if (isInEditMode) {
                return [
                    <GridActionsCellItem
                    icon={<Save />}
                    label="Save"
                    sx={{
                        color: 'primary.main',
                    }}
                    onClick={handleSaveClick(id)}
                    />,
                    <GridActionsCellItem
                    icon={<Cancel />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                    />,
                ];
                }
        
                return [
                <GridActionsCellItem
                    icon={<Edit />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                />
                ];
            },
        },
    ]

    if (isLoadingProducts) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: '100%',
                    gap: 8
                }}
            >
                <Menu />
                <Box sx={{
                    width: 500,
                    minHeight: 280,
                    maxHeight: 300,
                    marginTop: 0.5,
                }}>
                    <Paper>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 1, textAlign: 'justify' }}>
                            <CircularProgress />
                        </Box>
                    </Paper>
                </Box>
            </div>
        );
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                gap: 8
            }}
        >
            <Menu />
            <Box sx={{
                width: 600,
                minHeight: 280,
                maxHeight: 300,
                marginTop: 0.5,
            }}>
                <Paper>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 1 }}>
                        <Typography variant="h6">Estoque</Typography>
                    </Box>

                    <Divider />

                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            placeItems: 'center',
                            gap: 2,
                            padding: 0.5,
                        }}
                    >
                        <DataGrid
                            sx={{
                                width: '100%',
                            }}
                            rows={rows}
                            columns={columns}
                            editMode="row"
                            rowModesModel={rowModesModel}
                            onRowModesModelChange={handleRowModesModelChange}
                            onRowEditStop={handleRowEditStop}
                            processRowUpdate={processRowUpdate}
                            localeText={{
                                noRowsLabel: 'Não há produtos',
                                footerRowSelected: (count: number) => `${count} produto(s) selecionado(s)`,
                                footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,
                            }}
                        />
                        {
                            showAlert
                            && <Alert severity={alertType}>{alertMessage}</Alert>
                        }
                        <Button
                            type="submit"
                            sx={{
                                width: 450,
                                height: 40,
                                bottom: 2,
                            }}
                            onClick={onSubmit}
                            disabled={isUpdatingStock}
                            variant="outlined"
                        >
                            {
                                isUpdatingStock
                                ? <CircularProgress size={25} />
                                : "Atualizar estoque"
                            }    
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}