import { Alert, Box, CircularProgress, Divider, List, ListItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Menu } from "../components/Menu";
import { useEffect, useState } from "react";
import { GATEWAY_VIEW_ALL_CLIENT, GATEWAY_VIEW_REPORT } from "../gateways";
import { FetchAllClientsResponse } from "../model/responses";

export function ViewReport(): JSX.Element {
    const [isLoadingClients, setIsLoadingClients] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<'success'|'error'>("error");

    const [clients, setClients] = useState<FetchAllClientsResponse>([]);

    const [totalSale, setTotalSale] = useState(0);
    const [totalSaleByClient, setTotalSaleByClient] = useState(0);

    useEffect(() => {
        setIsLoadingClients(true);

        const fetchData = async () => {
            try {
                const response = await fetch(GATEWAY_VIEW_REPORT);
                const data = await response.json();

                setTotalSale(data.totalSale);
                setTotalSaleByClient(data.totalSaleByClient);
            } catch (error) {
                console.error(error);
                setAlertType("error");
                setAlertMessage("Não foi possível proceder devido a um erro interno.");
                setShowAlert(true);
            }
            
            try {
                const response = await fetch(GATEWAY_VIEW_ALL_CLIENT);
                setClients(await response.json());
            } catch (error) {
                console.error(error);
                setAlertType("error");
                setAlertMessage("Não foi possível proceder devido a um erro interno.");
                setShowAlert(true);
            } finally {
                setIsLoadingClients(false);
            }
        }

        fetchData();
    }, []);

    if (isLoadingClients) {
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
                        <Typography variant="h6">Relatório</Typography>
                    </Box>

                    {
                        showAlert
                        && <Alert severity={alertType}>{alertMessage}</Alert>
                    }

                    <Divider />
                    
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            placeItems: 'center',
                            gap: 2,
                            padding: 2,
                            width: '100%'
                        }}
                    >
                        <List
                            sx={{ width: 450, maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper' }}
                            component="nav"
                        >
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography>Total de vendas do empreendimento:</Typography>
                                <Typography>{totalSale}</Typography>
                            </ListItem>
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Typography>Total de vendas por cliente:</Typography>
                                <Typography>{totalSaleByClient}</Typography>
                            </ListItem>
                        </List>
                        <TableContainer component={Paper} elevation={2}>
                            <Table sx={{ minWidth: 450 }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell align="center">Código</TableCell>
                                    <TableCell align="center">Nome</TableCell>
                                    <TableCell align="center">Telefone</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {clients.map((client) => (
                                    <TableRow
                                    key={client.code}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row" align="center">
                                        {client.code}
                                    </TableCell>
                                    <TableCell align="center">{client.name}</TableCell>
                                    <TableCell align="center">{client.phone}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}