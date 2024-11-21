import { Alert, Box, Button, CircularProgress, Divider, List, ListItem, ListSubheader, Paper, Typography } from "@mui/material";
import { Menu } from "../components/Menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { GATEWAY_VIEW_ALL_CLIENT, GATEWAY_VIEW_CLIENT } from "../gateways";
import { FetchAllClientsResponse, FetchClientResponse } from "../model/responses";
import { BootstrapSelect } from "../components/Bootstrap/BootstrapSelect";
import { SearchClientData, searchClientSchema } from "../schemas/searchClient";

export function SearchClient(): JSX.Element {
    const { 
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<SearchClientData>({
        resolver: zodResolver(searchClientSchema)
    });

    const [isLoadingClients, setIsLoadingClients] = useState(true);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<'success'|'error'>("error");

    const [clients, setClients] = useState<FetchAllClientsResponse>([]);

    const [isSubmitingSearch, setIsSubmitingSearch] = useState(false);

    const [clientInfo, setClientInfo] = useState<{
        name: string;
        code: number;
        phone: string;
        totalPurchase: number;
    } | undefined>(undefined);

    useEffect(() => {
        setIsLoadingClients(true);

        const fetchData = async () => {
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

    const onSubmit = async (data: SearchClientData) => {
        if (isSubmitingSearch) {
            return;
        }

        setShowAlert(false);
        setIsSubmitingSearch(true);

        try {
            const response = await fetch(GATEWAY_VIEW_CLIENT, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const responseData = await response.json() as FetchClientResponse;
            
            if (responseData.ok) {
                setClientInfo(responseData.info);
            } else {
                setAlertType("error");
                
                if (responseData.error.type === "internal") {
                    throw responseData.error.message;
                } else if (responseData.error.type === "invalid-data") {
                    setAlertMessage("Os dados enviados são inválidos, tente novamente.");
                    setShowAlert(true);
                } else if (responseData.error.type === "validation") {
                    for (const error of responseData.error.info) {
                        setError(error.path[0] as keyof SearchClientData, {
                            message: error.message,
                            type: error.code
                        });
                    }
                }
            }

        } catch (error) {
            console.error(error);
            setAlertType("error");
            setAlertMessage("Não foi possível proceder devido a um erro interno.");
            setShowAlert(true);
        }

        setIsSubmitingSearch(false);
    }

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
                width: 500,
                minHeight: 280,
                maxHeight: 300,
                marginTop: 0.5,
            }}>
                <Paper>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 1 }}>
                        <Typography variant="h6">Procurar cliente</Typography>
                    </Box>

                    <Divider />
                    
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            placeItems: 'center',
                            gap: 10,
                            padding: 10
                        }}
                    >
                        <BootstrapSelect
                            id="ClientName"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            options={
                                clients.map(client => ({
                                    label: `${client.code}. ${client.name}`,
                                    value: client.code
                                }))
                            }
                            isRequired={true}
                            text={{
                                label: "Nome do cliente",
                                error: errors.clientCode?.message
                            }}
                            props={{
                                input: {
                                    type: "text",
                                    ...register("clientCode")
                                }
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
                                height: 40
                            }}
                            variant="outlined"
                            disabled={isSubmitingSearch}
                        >
                            {
                                isSubmitingSearch
                                ? <CircularProgress size={25} />
                                : "Buscar"
                            }    
                        </Button>
                    </form>

                    {
                        clientInfo !== undefined && (
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
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader">
                                            {clientInfo.name}
                                        </ListSubheader>
                                    }
                                >
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Typography>Código</Typography>
                                        <Typography>{clientInfo.code}</Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Typography>Telefone</Typography>
                                        <Typography>{clientInfo.phone}</Typography>
                                    </ListItem>
                                    <ListItem
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Typography>Total de compras</Typography>
                                        <Typography>{clientInfo.totalPurchase}</Typography>
                                    </ListItem>
                                </List>
                            </Box>
                        )
                    }
                </Paper>
            </Box>
        </div>
    )
}