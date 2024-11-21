import { Alert, Box, Button, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { Menu } from "../components/Menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { GATEWAY_VIEW_ALL_CLIENT, GATEWAY_VIEW_ALL_PRODUCT, GATEWAY_REGISTER_SALE } from "../gateways";
import { FetchAllClientsResponse, FetchAllProductsResponse, RegisterResponse } from "../model/responses";
import { BootstrapSelect } from "../components/Bootstrap/BootstrapSelect";
import { RegisterSaleData, registerSaleSchema } from "../schemas/sale";
import { CartModel } from "../model/cart";
import { SaleCart } from "../components/SaleCart";

export function SaleRegister(): JSX.Element {
    const { 
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors }
    } = useForm<RegisterSaleData>({
        resolver: zodResolver(registerSaleSchema)
    });

    const [clients, setClients] = useState<FetchAllClientsResponse>([]);
    const [products, setProducts] = useState<FetchAllProductsResponse>([]);

    const [cart, setCart] = useState<CartModel>([]);

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

    const onSubmit = async (data: RegisterSaleData) => {
        if (isSubmitingRegister) {
            return;
        }

        if (cart.length === 0) {
            setAlertType("error");
            setAlertMessage("O carrinho não pode estar vazio.");  
            setShowAlert(true);
            return;
        }

        setShowAlert(false);
        setIsSubmitingRegister(true);

        try {
            const response = await fetch(GATEWAY_REGISTER_SALE, {
                method: "POST",
                body: JSON.stringify({...data, cart}),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const responseData = await response.json() as RegisterResponse;
            
            if (responseData.ok) {
                setAlertType("success");
                setAlertMessage("A venda foi registrada com sucesso.");
                setShowAlert(true);
                reset();
                setCart([]);

                try {
                    const response = await fetch(GATEWAY_VIEW_ALL_PRODUCT);
                    setProducts(await response.json());
                } catch (error) {
                    console.error(error);
                    setAlertType("error");
                    setAlertMessage("Não foi possível proceder devido a um erro interno.");
                    setShowAlert(true);
                }
            } else {
                setAlertType("error");
                
                if (responseData.error.type === "internal") {
                    throw responseData.error.message;
                } else if (responseData.error.type === "invalid-data") {
                    setAlertMessage("Os dados enviados são inválidos, tente novamente.");
                    setShowAlert(true);
                } else if (responseData.error.type === "validation") {
                    for (const error of responseData.error.info) {
                        setError(error.path[0] as keyof RegisterSaleData, {
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

    if (clients.length === 0) {
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
                            <Typography textAlign="justify">Não há clientes cadastrados para poder vender.</Typography>
                        </Box>
                    </Paper>
                </Box>
            </div>
        );
    }

    if (products.length === 0) {
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
                            <Typography textAlign="justify">Não há produtos cadastrados para poder vender.</Typography>
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
                        <Typography variant="h6">Cadastrar venda</Typography>
                    </Box>

                    <Divider />

                    <SaleCart products={products} setCart={setCart} cart={cart} />

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

                        <BootstrapSelect
                            id="PaymentMethod"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            options={[
                                {
                                    label: "Dinheiro",
                                    value: 1
                                },
                                {
                                    label: "Pix",
                                    value: 2
                                },
                                {
                                    label: "Cartão de Débito",
                                    value: 3
                                },
                                {
                                    label: "Cartão de Crédito",
                                    value: 4
                                },
                            ]}
                            isRequired={true}
                            text={{
                                label: "Método de pagamento",
                                error: errors.paymentMethod?.message
                            }}
                            props={{
                                input: {
                                    type: "text",
                                    ...register("paymentMethod")
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
                                : "Vender"
                            }    
                        </Button>
                    </form>
                </Paper>
            </Box>
        </div>
    )
}