import { Alert, Box, Button, CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { Menu } from "../components/Menu";
import { BootstrapInput } from "../components/BootstrapInput/BootstrapInput";
import { useForm } from "react-hook-form";
import { RegisterClientData, registerClientSchema } from "../schemas/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { GATEWAY_REGISTER_CLIENT } from "../gateways";

export function ClientRegister(): JSX.Element {
    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterClientData>({
        resolver: zodResolver(registerClientSchema)
    });

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState<'success'|'error'>("error");

    const [isSubmitingRegister, setIsSubmitingRegister] = useState(false);

    const onSubmit = async (data: RegisterClientData) => {
        if (isSubmitingRegister) {
            return;
        }

        setShowAlert(false);
        setIsSubmitingRegister(true);

        try {
            const request = await fetch(GATEWAY_REGISTER_CLIENT, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const response = await request.json();
            
            if (response.ok) {
                setAlertType("success");
                setAlertMessage("O cliente foi registrado com sucesso.");
                setShowAlert(true);
            } else {
                setAlertType("error");
                
                if (response.error.type === "internal") {
                    throw response.error.message;
                } else if (response.error.type === "invalid-data") {
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
                        <Typography variant="h6">Cadastrar cliente</Typography>
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
                        <BootstrapInput
                            id="Nome"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            isRequired={true}
                            text={{
                                label: "Nome",
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
                            id="Telefone"
                            size={{
                                width: 450,
                                height: 40
                            }}
                            isRequired={true}
                            text={{
                                label: "Telefone",
                                error: errors.phone?.message
                            }}
                            props={{
                                input: {
                                    type: "tel",
                                    ...register("phone")
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