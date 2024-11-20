import { Alert, Box, Button, CircularProgress, Divider, IconButton, List, ListItem, ListSubheader, Paper, Typography } from "@mui/material";
import { Menu } from "../components/Menu";
import { BootstrapInput } from "../components/Bootstrap/BootstrapInput";
import { useForm } from "react-hook-form";
import { RegisterProductData, registerProductSchema } from "../schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { GATEWAY_VIEW_ALL_CLIENT, GATEWAY_REGISTER_PRODUCT, GATEWAY_VIEW_ALL_PRODUCT } from "../gateways";
import { FetchAllClientsResponse, FetchAllProductsResponse, RegisterResponse } from "../model/responses";
import { BootstrapSelect } from "../components/Bootstrap/BootstrapSelect";
import { Delete } from "@mui/icons-material";

export function SaleRegister(): JSX.Element {
    const { 
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<RegisterProductData>({
        resolver: zodResolver(registerProductSchema)
    });

    const [clients, setClients] = useState<FetchAllClientsResponse>([]);
    const [products, setProducts] = useState<FetchAllProductsResponse>([]);

    const [cart, setCart] = useState<{ code: number, amount: number }[]>([]);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<'success'|'error'>("error");

    const [isSubmitingRegister, setIsSubmitingRegister] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(GATEWAY_VIEW_ALL_CLIENT);
                setClients(await response.json());
            } catch (error) {
                console.error(error);
                setAlertType("error");
                setAlertMessage("Não foi possível proceder devido a um erro interno.");
                setShowAlert(true);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(GATEWAY_VIEW_ALL_PRODUCT);
                setProducts(await response.json());
            } catch (error) {
                console.error(error);
                setAlertType("error");
                setAlertMessage("Não foi possível proceder devido a um erro interno.");
                setShowAlert(true);
            }
        }

        fetchData();
    }, []);

    const onSubmit = async (data: RegisterProductData) => {
        if (isSubmitingRegister) {
            return;
        }

        setShowAlert(false);
        setIsSubmitingRegister(true);

        try {
            const response = await fetch(GATEWAY_REGISTER_PRODUCT, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const responseData = await response.json() as RegisterResponse;
            
            if (responseData.ok) {
                setAlertType("success");
                setAlertMessage("O produto foi registrado com sucesso.");
                setShowAlert(true);
            } else {
                setAlertType("error");
                
                if (responseData.error.type === "internal") {
                    throw responseData.error.message;
                } else if (responseData.error.type === "invalid-data") {
                    setAlertMessage("Os dados enviados são inválidos, tente novamente.");
                    setShowAlert(true);
                } else if (responseData.error.type === "validation") {
                    for (const error of responseData.error.info) {
                        setError(error.path[0] as keyof RegisterProductData, {
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

        setIsSubmitingRegister(false);
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
                        <Typography variant="h6">Cadastrar venda</Typography>
                    </Box>

                    <Divider />
                    
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            placeItems: 'center',
                            gap: 10,
                            padding: 10,
                        }}
                    >
                        <List
                            sx={{ width: 450, bgcolor: 'background.paper' }}
                            component="nav"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    Carrinho
                                </ListSubheader>
                            }
                        >
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete">
                                        <Delete />
                                    </IconButton>
                                }

                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 2
                                    }}
                                >
                                    <Typography fontSize={14} paddingTop={0.10}>4x</Typography>
                                    <Typography>Arroz</Typography>
                                </Box>
                                <Typography>R$ 16,99</Typography>
                            </ListItem>
                            <Divider />
                            <ListItem
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    paddingTop: 2
                                }}
                            >
                                <Typography>Total</Typography>
                                <Typography>R$ 16,99</Typography>
                            </ListItem>
                        </List>

                        <BootstrapSelect
                            id="ProductName"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            options={Object.fromEntries(products.map(product => [`${product.code}. ${product.name} - R$ ${product.price} - Qtd. Disponível: ${product.amountAvailable}`, product.code]))}
                            isRequired={true}
                            text={{
                                label: "Produto",
                                error: errors.name?.message
                            }}
                            props={{
                                input: {
                                    type: "text",
                                    ...register("name")
                                }
                            }}
                        />

                        <BootstrapInput
                            id="Amount"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            isRequired={true}
                            text={{
                                label: "Quantidade",
                                error: errors.amountAvailable?.message
                            }}
                            props={{
                                input: {
                                    type: "number",
                                    ...register("amountAvailable")
                                }
                            }}
                        />

                        <Button
                            type="button"
                            sx={{
                                width: 450,
                                height: 40
                            }}
                            variant="outlined"
                        >
                            Adicionar ao carrinho
                        </Button>

                        <Divider sx={{ width: '100%' }} />

                        <BootstrapSelect
                            id="ClientName"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            options={Object.fromEntries(clients.map(client => [`${client.code} - ${client.name}`, client.code]))}
                            isRequired={true}
                            text={{
                                label: "Nome do cliente",
                                error: errors.name?.message
                            }}
                            props={{
                                input: {
                                    type: "text",
                                    ...register("name")
                                }
                            }}
                        />
                        <BootstrapSelect
                            id="PaymentMethod"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            options={Object.fromEntries(clients.map(client => [`${client.code} - ${client.name}`, client.code]))}
                            isRequired={true}
                            text={{
                                label: "Método de pagamento",
                                error: errors.name?.message
                            }}
                            props={{
                                input: {
                                    type: "text",
                                    ...register("name")
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
                            disabled={isSubmitingRegister}
                        >
                            {
                                isSubmitingRegister
                                ? <CircularProgress size={25} />
                                : "Cadastrar"
                            }    
                        </Button>
                    </form>
                </Paper>
            </Box>
        </div>
    )
}