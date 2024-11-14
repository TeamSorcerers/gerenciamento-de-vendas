import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { Menu } from "../components/Menu";
import { BootstrapInput } from "../components/BootstrapInput/BootstrapInput";
import { useForm } from "react-hook-form";
import { RegisterClientData, registerClientSchema } from "../schemas/client";
import { zodResolver } from "@hookform/resolvers/zod";

export function ClientRegister(): JSX.Element {
    const { 
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterClientData>({
        resolver: zodResolver(registerClientSchema)
    });

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
                        onSubmit={handleSubmit(console.log)}
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
                        <Button
                            type="submit"
                            sx={{
                                width: 450,
                                height: 40
                            }}
                            variant="outlined"
                        >
                            Cadastrar    
                        </Button>
                    </form>
                </Paper>
            </Box>
        </div>
    )
}